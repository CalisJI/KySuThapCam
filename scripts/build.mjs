import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'site');
const output = path.join(root, 'dist');

// One entry per language. Add a new entry (plus its content/site.<lang>.json and posts folder) to add a language.
const LANGS = [
  { code: 'vi', label: 'VI', name: 'Tiếng Việt', locale: 'vi-VN', site: 'site.json', posts: 'posts', base: '', articles: 'bai-viet' },
  { code: 'en', label: 'EN', name: 'English', locale: 'en-GB', site: 'site.en.json', posts: 'posts-en', base: '/en', articles: 'articles' },
];

// Inline SVG flags (emoji flags do not render on Windows). Add one per language in LANGS.
const FLAG_SVG = {
  vi: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="20" fill="#da251d"/><polygon fill="#ff0" points="15,4 16.76,9.1 22.16,9.2 17.86,12.4 19.4,17.6 15,14.5 10.6,17.6 12.14,12.4 7.84,9.2 13.24,9.1"/></svg>',
  en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M0,0 60,40M60,0 0,40" stroke="#fff" stroke-width="8"/><path d="M0,0 60,40M60,0 0,40" stroke="#C8102E" stroke-width="3"/><path d="M30,0V40M0,20H60" stroke="#fff" stroke-width="12"/><path d="M30,0V40M0,20H60" stroke="#C8102E" stroke-width="7"/></svg>',
};
const flagUri = (code) => `data:image/svg+xml;utf8,${encodeURIComponent(FLAG_SVG[code] || '')}`;
const langList = (current, hrefs = {}) => LANGS.map((l) => ({
  code: l.code, label: l.label, name: l.name, href: hrefs[l.code] || `${l.base}/`, flag: flagUri(l.code), mark: l === current ? '✓' : '',
}));

const REQUIRED = ['heroTitle', 'heroHighlight', 'heroDescription', 'contactEmail', 'phoneDisplay', 'phoneLink', 'fields', 'products', 'steps', 'faqs'];
const UI_DEFAULTS = JSON.parse(await readFile(path.join(root, 'scripts', 'ui-defaults.json'), 'utf8'));
const baseContent = JSON.parse(await readFile(path.join(root, 'content', LANGS[0].site), 'utf8'));

// Translatable keys per list. A key K is translated by the optional sibling "KEn"; everything else
// (color, image, href...) is shared between languages.
const TRANSLATABLE = {
  fields: ['tag', 'title', 'desc', 'items'],
  products: ['name', 'cta'],
  steps: ['num', 'title', 'desc'],
  projects: ['tag', 'title', 'desc'],
  faqs: ['q', 'a'],
};
const SHARED_SINGLE = ['phoneDisplay', 'phoneLink', 'contactEmail', 'fbUrl', 'showBlog', 'logo', 'analyticsToken', 'googleVerification', 'zaloUrl'];
// Optional Cloudflare Web Analytics beacon (visitor counts). Set the token in the CMS; empty = no tracking script.
const analyticsTag = (c) => (/^[a-f0-9]{32}$/i.test((c.analyticsToken || '').trim())
  ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${c.analyticsToken.trim()}"}'></script>`
  : '');
const SITE_URL = String(baseContent.siteUrl || 'https://kysuthapcam.com').replace(/\/+$/, '');
const absUrl = (u) => (/^https?:/i.test(u) ? u : SITE_URL + (String(u).startsWith('/') ? '' : '/') + encodeURI(String(u)));
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
// Static SEO tags (canonical, Open Graph, hreflang, structured data) so crawlers need not run the page script.
function seoHead({ lang, content, title, description, path: urlPath, image, type = 'website', alternates = false, ld = [] }) {
  const url = SITE_URL + urlPath;
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${url}">`,
    content.googleVerification ? `<meta name="google-site-verification" content="${esc(content.googleVerification)}">` : '',
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:site_name" content="Kỹ Sư Thập Cẩm">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${esc(absUrl(image))}">`,
    `<meta property="og:locale" content="${lang.locale.replace('-', '_')}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${esc(absUrl(image))}">`,
  ];
  if (alternates) {
    for (const l of LANGS) tags.push(`<link rel="alternate" hreflang="${l.code}" href="${SITE_URL}${l.base}/">`);
    tags.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">`);
  }
  for (const o of ld) tags.push(jsonLd(o));
  return tags.filter(Boolean).join('\n');
}
const orgLd = (content, description) => ({
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Kỹ Sư Thập Cẩm', url: `${SITE_URL}/`,
  logo: absUrl(content.logo), email: content.contactEmail, telephone: content.phoneLink, description,
  address: { '@type': 'PostalAddress', addressLocality: 'Ho Chi Minh City', addressCountry: 'VN' },
  sameAs: [content.fbUrl].filter(Boolean),
});
// Plain-HTML copy of the main content for crawlers and visitors without JavaScript.
const noscriptHtml = (c) => `<noscript><div style="max-width:960px;margin:0 auto;padding:24px;font-family:sans-serif;line-height:1.6">
<h1>${esc(c.heroTitle)} ${esc(c.heroHighlight)}</h1><p>${esc(c.heroDescription)}</p>
<h2>${esc(c.ui.fieldsTitleA)} ${esc(c.ui.fieldsTitleB)}</h2><ul>${c.fields.map((f) => `<li><strong>${esc(f.title)}</strong>: ${esc(f.desc)} ${(f.items || []).map(esc).join(', ')}</li>`).join('')}</ul>
<h2>${esc(c.ui.devicesTitle)}</h2><ul>${c.products.map((p) => `<li>${esc(p.name)}</li>`).join('')}</ul>
<h2>${esc(c.ui.faqTitle)}</h2>${c.faqs.map((q) => `<h3>${esc(q.q)}</h3><p>${esc(q.a)}</p>`).join('')}
<p>${esc(c.phoneDisplay)} · <a href="mailto:${esc(c.contactEmail)}">${esc(c.contactEmail)}</a></p></div></noscript>`;
const sitemap = [];
const ICON_LINKS = `<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">`;
const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
const mapItems = (list, fn) => (Array.isArray(list) ? list.map(fn) : []);
function stripTranslations(c) {
  const out = { ...c };
  for (const [list, keys] of Object.entries(TRANSLATABLE)) {
    out[list] = mapItems(c[list], (item) => {
      const o = { ...item };
      for (const k of keys) delete o[`${k}En`];
      return o;
    });
  }
  return out;
}
// Build a non-base language: own singular texts + shared singles + lists derived from the base file.
function localize(base, own) {
  const out = { ...own };
  for (const k of SHARED_SINGLE) if (k in base) out[k] = base[k];
  for (const [list, keys] of Object.entries(TRANSLATABLE)) {
    out[list] = mapItems(base[list], (item) => {
      const o = { ...item };
      for (const k of keys) {
        const tr = item[`${k}En`];
        if (!isEmpty(tr)) o[k] = tr;
        else if (k === 'cta') o[k] = '';
        delete o[`${k}En`];
      }
      return o;
    });
  }
  return out;
}

const esc = (v = '') => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const toDate = (d) => (d instanceof Date ? d : new Date(d));
const isoDate = (d) => {
  const dt = toDate(d);
  return Number.isNaN(dt.getTime()) ? '' : dt.toISOString().slice(0, 10);
};
const fmtDate = (d, locale) => {
  const dt = toDate(d);
  return Number.isNaN(dt.getTime()) ? '' : dt.toLocaleDateString(locale, { timeZone: 'UTC' });
};
// Display labels (tags) in one consistent style: first letter capitalised, rest lower-case; short Latin
// acronyms (PLC, HMI) and mixed-case words (IoT) are kept. Each "a · b" / "a / b" segment is handled separately.
function normTag(s) {
  const text = String(s || '').trim();
  if (!text) return '';
  return text.split(/(\s+[·/|,]\s+|\s*,\s+)/).map((seg) => {
    if (/^\s*[·/|,]\s*$/.test(seg) || !seg) return seg;
    if (!/[a-z]/.test(seg) && (/[^\x00-\x7F]/.test(seg) || /[A-Za-z]\s+[A-Za-z]/.test(seg.trim()))) {
      const low = seg.toLowerCase();
      return low.charAt(0).toUpperCase() + low.slice(1);
    }
    const out = seg.replace(/[\p{L}\p{M}]+/gu, (w) => {
      if (/^[A-Z]{2,4}$/.test(w)) return w;
      if (/[a-z]/.test(w) && /[A-Z]/.test(w.slice(1))) return w;
      return w.toLowerCase();
    });
    return out.charAt(0).toUpperCase() + out.slice(1);
  }).join('');
}
const safeColor = (c) => (/^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#e8590c');

// The site must work whether it is served from the domain root or from a sub-path (e.g. when the host
// publishes the repo root and the site lives under /dist/). So every root-absolute URL ("/media/x.jpg",
// "/en/") is rewritten to a path relative to the page that contains it.
const relPath = (p, prefix) => {
  const r = prefix + p;
  return r === '' ? './' : r;
};
const relativizeHtml = (html, prefix) =>
  html.replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) => `${attr}="${relPath(rest, prefix)}"`);
const relativizeJs = (js, prefix) =>
  js.replace(/"(image|cover|logo|href|altHref|articlesHref)": "\/(?!\/)([^"]*)"/g, (_, key, rest) => `"${key}": "${relPath(rest, prefix)}"`);

async function loadArticles(lang) {
  const dir = path.join(root, 'content', lang.posts);
  let files = [];
  try { files = (await readdir(dir)).filter((f) => f.endsWith('.md')); } catch { /* none yet */ }
  const list = [];
  for (const file of files) {
    const { data, content: body } = matter(await readFile(path.join(dir, file), 'utf8'));
    if (data.draft) continue;
    if (!data.title) throw new Error(`Article ${lang.posts}/${file} is missing a title.`);
    list.push({
      slug: file.replace(/\.md$/, ''),
      title: String(data.title),
      tag: normTag(data.tag),
      translation: String(data.translation || '').split('/').pop().replace(/\.md$/, ''),
      color: safeColor(data.color),
      cover: data.cover || '',
      excerpt: data.excerpt || '',
      date: data.date || '',
      html: marked.parse(body),
    });
  }
  list.sort((a, b) => isoDate(b.date).localeCompare(isoDate(a.date)));
  return list;
}

const langMenuHtml = (lang, hrefs) => `<details class="lang-menu"><summary><img src="${flagUri(lang.code)}" width="22" height="15" alt=""> ${lang.label} <span>▾</span></summary><div class="lang-pop">${langList(lang, hrefs).map((l) => `<a href="${l.href}" hreflang="${l.code}"><img src="${l.flag}" width="22" height="15" alt=""><span>${l.name}</span><b>${l.mark}</b></a>`).join('')}</div></details>`;
const LANG_CSS = `.zalo-fab{position:fixed;right:18px;bottom:18px;z-index:40;display:flex;align-items:center;gap:8px;background:#fff;color:#0068ff;border-radius:999px;padding:6px 16px 6px 6px;font-weight:700;font-size:14px;box-shadow:0 8px 24px -6px rgba(0,0,0,.35)}.zalo-fab:hover{color:#0050c8;transform:translateY(-2px)}.zalo-ic{display:flex}.zalo-ic svg{display:block}@media(max-width:560px){.zalo-fab{padding:0;background:none;box-shadow:none;right:14px;bottom:14px}.zalo-tx{display:none}.zalo-ic svg{width:52px;height:52px;border-radius:14px;box-shadow:0 8px 20px -6px rgba(0,0,0,.4)}}.burger{display:none;width:42px;height:42px;border:1.5px solid #141414;border-radius:12px;background:none;cursor:pointer;padding:0;flex-direction:column;align-items:center;justify-content:center;gap:5px}.burger i{display:block;width:18px;height:2px;background:#141414;border-radius:2px;transition:transform .2s,opacity .2s}.hd.open .burger i:nth-child(1){transform:translateY(7px) rotate(45deg)}.hd.open .burger i:nth-child(2){opacity:0}.hd.open .burger i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}@media(max-width:860px){.hd-top-txt{display:none}.hd-top>div{justify-content:center!important}.hd>div{flex-wrap:wrap!important;gap:10px 12px!important;padding:10px 16px!important}.hd-logo{order:1;flex:1 1 auto;min-width:0}.hd .lang-menu{order:2}.burger{display:flex;order:3}.hd-nav,.hd-cta{display:none!important;order:4;width:100%}.hd.open .hd-nav{display:flex!important;flex-direction:column;gap:0!important;border-top:1px solid #ececE6;padding-top:6px}.hd.open .hd-nav a{padding:13px 4px;font-size:16px!important;border-bottom:1px solid #ececE6}.hd.open .hd-cta{display:block!important;text-align:center;margin:8px 0 4px;padding:14px 20px!important}}@media(max-width:480px){.hd-tag,.hd-logo i{display:none}.hd-logo b,.hd-logo span:first-of-type span:first-child{font-size:15px!important}}.lang-menu{position:relative}.lang-menu summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;border:1.5px solid #141414;color:#141414;border-radius:999px;padding:6px 12px;font-size:13px;font-weight:800}.lang-menu summary::-webkit-details-marker{display:none}.lang-menu img{border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.15)}.lang-pop{position:absolute;right:0;top:calc(100% + 8px);background:#fff;border-radius:14px;box-shadow:0 12px 32px -8px rgba(0,0,0,.28);padding:6px;min-width:170px;z-index:50}.lang-pop a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:#141414;font-size:14px;font-weight:600}.lang-pop a:hover{background:#f3f1ec;color:#141414}.lang-pop b{margin-left:auto;color:#1f9d4d}`;
const NEWS_JS = `(function(){var chips=[].slice.call(document.querySelectorAll('.chip')),cards=[].slice.call(document.querySelectorAll('#newsgrid .card')),more=document.getElementById('more'),limit=9,tag='';function ok(c){return !tag||c.getAttribute('data-tag')===tag}function apply(){var n=0;cards.forEach(function(c){var v=ok(c)&&n<limit;if(ok(c))n++;c.style.display=v?'':'none'});if(more)more.style.display=cards.filter(ok).length>limit?'':'none'}chips.forEach(function(b){b.onclick=function(){tag=b.getAttribute('data-tag');chips.forEach(function(x){x.className=x===b?'chip on':'chip'});limit=9;apply()}});if(more)more.onclick=function(){limit+=9;apply()};apply()})();`;
const LANG_JS = `document.addEventListener('click',function(e){var bg=e.target.closest&&e.target.closest('.burger');var hd=document.querySelector('header.hd');if(hd){if(bg){var o=hd.classList.toggle('open');bg.setAttribute('aria-expanded',o?'true':'false')}else if(hd.classList.contains('open')&&(e.target.closest('.hd-nav a,.hd-cta')||!hd.contains(e.target))){hd.classList.remove('open');var b2=hd.querySelector('.burger');if(b2)b2.setAttribute('aria-expanded','false')}}document.querySelectorAll('details.lang-menu[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open')});var a=e.target.closest&&e.target.closest('.lang-pop a');if(a){try{var h=a.getAttribute('href');if(location.hash&&h.indexOf('#')<0)a.setAttribute('href',h+location.hash);var m=document.documentElement.scrollHeight-innerHeight;sessionStorage.setItem('kstc-scroll',JSON.stringify({f:m>0?scrollY/m:0,t:Date.now()}))}catch(x){}}});window.addEventListener('load',function(){try{var s=JSON.parse(sessionStorage.getItem('kstc-scroll')||'null');sessionStorage.removeItem('kstc-scroll');if(!s||Date.now()-s.t>8000||location.hash)return;setTimeout(function(){var m=document.documentElement.scrollHeight-innerHeight;if(m>0)scrollTo(0,Math.round(s.f*m))},350)}catch(x){}});`;
const shell = (lang, content, { title, description, body, alt, seo, wide, hrefs }) => `<!doctype html>
<html lang="${lang.code}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${seo}
${ICON_LINKS}
${analyticsTag(content)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;background:#fafaf8;color:#141414;font-family:'Be Vietnam Pro',Helvetica,Arial,sans-serif}
a{color:#e8590c;text-decoration:none}a:hover{color:#1f9d4d}
.wrap{max-width:760px;margin:0 auto;padding:0 24px}.bar{max-width:1200px;margin:0 auto;padding:16px 24px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center}
.brand{font-weight:800;color:#141414;font-size:16px;display:flex;align-items:center;gap:10px}.brand img{width:34px;height:34px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.14)}
.meta{display:flex;gap:10px;font-size:12px;font-weight:800;letter-spacing:.06em}
h1{font-size:clamp(28px,4vw,42px);line-height:1.15;letter-spacing:-.02em;margin:12px 0 0}
.cover{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:18px;margin-top:28px;display:block}
.prose{font-size:17px;line-height:1.75;color:#2e2e2b;margin-top:28px}.prose h2{font-size:26px;margin:36px 0 8px}.prose h3{font-size:21px;margin:28px 0 6px}
.prose img{max-width:100%;height:auto;border-radius:12px}.prose table{border-collapse:collapse;width:100%}.prose td,.prose th{border:1px solid #ddd;padding:8px}
.prose pre{background:#141414;color:#eee;padding:16px;border-radius:12px;overflow:auto}.prose code{font-family:ui-monospace,Menlo,monospace}
.cta{margin:56px 0 0;background:#157a3a;color:#fff;border-radius:28px;padding:clamp(26px,5vw,40px);display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between}.cta .cta-txt{flex:1 1 320px;min-width:0}.cta .cta-k{font-size:12px;font-weight:800;color:#c8f0d4;letter-spacing:.12em;text-transform:uppercase}.cta h2{margin:10px 0 0;font-size:clamp(22px,3vw,30px);line-height:1.2;letter-spacing:-.02em}.cta p{margin:12px 0 0;color:#e2f4e8;font-size:15px;line-height:1.65}.cta .cta-btns{flex:0 1 280px;min-width:230px;display:flex;flex-direction:column;gap:10px}.cta .cta-btns a{display:block;text-align:center;padding:13px 18px;border-radius:14px;font-weight:700;font-size:15px}.cta .b1{background:#fff;color:#141414}.cta .b1:hover{color:#e8590c}.cta .b2{background:#ff8a45;color:#141414}.cta .b2:hover{background:#fff;color:#141414}.cta .b4{background:#0068ff;color:#fff}.cta .b4:hover{background:#0050c8;color:#fff}.cta .b3{border:1.5px solid rgba(255,255,255,.55);color:#fff}.cta .b3:hover{background:rgba(255,255,255,.12);color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:32px}
.card{background:#fff;border-radius:20px;padding:22px;color:#141414;display:flex;flex-direction:column;gap:10px;box-shadow:0 6px 18px -10px rgba(0,0,0,.18)}
.card img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px}
${LANG_CSS}
.wrap.wide{max-width:1200px}
.news-kicker{font-size:12px;font-weight:800;color:#1f9d4d;letter-spacing:.12em;text-transform:uppercase}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}.chip{font:inherit;font-size:13px;font-weight:700;border:1.5px solid #d8d6cf;background:#fff;color:#141414;border-radius:999px;padding:7px 14px;cursor:pointer}.chip.on{background:#141414;border-color:#141414;color:#fff}
.feature{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:0;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 8px 24px -10px rgba(0,0,0,.18);margin-top:32px;color:#141414}
.feature .thumb{width:100%;height:100%;min-height:260px;aspect-ratio:auto}.feature .txt{padding:32px;display:flex;flex-direction:column;gap:12px;justify-content:center}.feature h2{margin:0;font-size:clamp(22px,2.6vw,32px);line-height:1.25}
@media(max-width:760px){.feature{grid-template-columns:1fr}.feature .thumb{min-height:0;aspect-ratio:16/9}}
.card .thumb{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;display:block;background:#f3f1ec}
.thumb.ph{display:grid;place-items:center;background:repeating-linear-gradient(135deg,#f6f4ef 0 12px,#efece5 12px 24px);border-radius:12px}.thumb.ph img{width:56px;height:56px;border-radius:14px;opacity:.85;object-fit:contain}
.feature .thumb.ph{border-radius:0}
.clamp2,.clamp3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.clamp2{-webkit-line-clamp:2}.clamp3{-webkit-line-clamp:3}
.card{height:100%}.card .txt{display:flex;flex-direction:column;gap:10px;flex:1}
.more{display:block;margin:32px auto 0;font:inherit;font-weight:700;font-size:15px;border:1.5px solid #141414;background:none;border-radius:999px;padding:11px 26px;cursor:pointer}
.hd-top{background:#141414;color:#e9e9e4;font-size:13px}.hd-top>div{max-width:1200px;margin:0 auto;padding:9px 24px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.hd-top a{color:#ff8a45;font-weight:700}.hd-top a:hover{color:#fff}
.hd{position:sticky;top:0;z-index:20;background:rgba(250,250,248,.92);backdrop-filter:blur(10px);border-bottom:1px solid #ececE6}.hd>div{max-width:1200px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.hd-logo{display:flex;align-items:center;gap:10px;color:#141414}.hd-logo:hover{color:#141414}.hd-logo img{width:40px;height:40px;border-radius:11px;box-shadow:0 2px 8px rgba(0,0,0,.14);display:block}.hd-logo span{display:flex;flex-direction:column;line-height:1.15}.hd-logo b{font-weight:800;font-size:16px}.hd-logo i{font-style:normal;font-size:10px;font-weight:700;letter-spacing:.12em;color:#6a6a64}
.hd-nav{display:flex;gap:24px;flex-wrap:wrap;font-size:14px;font-weight:600}.hd-nav a{color:#141414}.hd-nav a:hover{color:#e8590c}
.hd-cta{background:#e8590c;color:#fff;padding:11px 20px;border-radius:999px;font-size:14px;font-weight:700}.hd-cta:hover{background:#c94a05;color:#fff}
.back{display:inline-block;margin-top:8px;font-weight:700}
.ft{background:#141414;color:#c9c9c2;margin-top:48px}.ft>div{max-width:1200px;margin:0 auto;padding:28px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;font-size:13px}.ft strong{font-weight:800;color:#fff}.ft nav{display:flex;gap:18px;flex-wrap:wrap}.ft a{color:#c9c9c2}.ft a:hover{color:#ff8a45}
</style></head><body>
<div class="hd-top"><div><span class="hd-top-txt">${esc(content.ui.topbar)}</span><span>${esc(content.ui.city)} · <a href="tel:${esc(content.phoneLink)}">${esc(content.phoneDisplay)}</a></span></div></div>
<header class="hd"><div><a class="hd-logo" href="${lang.base}/"><img src="${esc(content.logo)}" alt="Kỹ Sư Thập Cẩm" width="40" height="40"><span><b>KỸ SƯ THẬP CẨM</b><i>${esc(content.ui.tagline)}</i></span></a>
<nav class="hd-nav"><a href="${lang.base}/#linh-vuc">${esc(content.ui.navFields)}</a><a href="${lang.base}/#thiet-bi">${esc(content.ui.navDevices)}</a><a href="${lang.base}/#cach-hoat-dong">${esc(content.ui.navHow)}</a>${content.projects.length ? `<a href="${lang.base}/#du-an">${esc(content.ui.navProjects)}</a>` : ''}<a href="${lang.base}/${lang.articles}/">${esc(content.ui.navShare)}</a><a href="${lang.base}/#hoi-dap">${esc(content.ui.navFaq)}</a></nav>
<a class="hd-cta" href="${lang.base}/#lien-he">${esc(content.ui.navCta)}</a>${langMenuHtml(lang, hrefs)}<button class="burger" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button></div></header>
<main class="wrap${wide ? ' wide' : ''}">${body}
<section class="cta"><div class="cta-txt"><div class="cta-k">${esc(content.ui.contactKicker)}</div><h2>${esc(content.ui.articleCta)}</h2><p>${esc(content.ui.articleCtaDesc)}</p></div>
<div class="cta-btns"><a class="b1" href="tel:${esc(content.phoneLink)}">☎ ${esc(content.phoneDisplay)}</a><a class="b4" href="${esc(content.zaloUrl)}" target="_blank" rel="noopener">${esc(content.ui.contactZalo)}</a><a class="b2" href="${esc(content.fbUrl)}" target="_blank" rel="noopener">${esc(content.ui.contactFb)}</a><a class="b3" href="mailto:${esc(content.contactEmail)}?subject=${encodeURIComponent(content.ui.mailSubject || '')}">✉ ${esc(content.contactEmail)}</a></div></section>
<a class="back" href="${lang.base}/">${esc(content.ui.backHome)}</a>
</main><a class="zalo-fab" href="${esc(content.zaloUrl)}" target="_blank" rel="noopener" aria-label="${esc(content.ui.contactZalo)}"><span class="zalo-ic"><svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#0068ff"/><text x="24" y="30.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="15" fill="#fff">Zalo</text></svg></span><span class="zalo-tx">${esc(content.ui.contactZalo)}</span></a><script>${LANG_JS}</script>
<footer class="ft"><div><strong>KỸ SƯ THẬP CẨM</strong><span>${esc(content.ui.footerCopy)}</span><nav><a href="tel:${esc(content.phoneLink)}">${esc(content.ui.footPhone)}</a><a href="mailto:${esc(content.contactEmail)}">${esc(content.ui.footEmail)}</a><a href="${esc(content.fbUrl)}" target="_blank" rel="noopener">${esc(content.ui.footFb)}</a><a href="${esc(content.zaloUrl)}" target="_blank" rel="noopener">${esc(content.ui.footZalo)}</a><a href="#top">${esc(content.ui.footTop)}</a></nav></div></footer></body></html>`;

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
const template = await readFile(path.join(source, 'index.html'), 'utf8');

const ALL = {};
for (const l of LANGS) ALL[l.code] = await loadArticles(l);
// translation pairs, symmetric: declaring it on either side is enough
const PAIR = {};
for (const l of LANGS) {
  for (const a of ALL[l.code]) {
    if (!a.translation) continue;
    const o = LANGS.find((x) => x !== l);
    if (ALL[o.code].some((x) => x.slug === a.translation)) {
      (PAIR[l.code] ||= {})[a.slug] = a.translation;
      (PAIR[o.code] ||= {})[a.translation] = a.slug;
    }
  }
}
const summary = [];
for (const lang of LANGS) {
  let content = JSON.parse(await readFile(path.join(root, 'content', lang.site), 'utf8'));
  // Lists (services, equipment, steps, projects, FAQ) live ONLY in the first language's file, each item carrying
  // optional "<field>En" translations, so adding an item once makes it appear in every language.
  content = lang === LANGS[0] ? stripTranslations(content) : localize(baseContent, content);
  // A stale CMS form can save a file without newer fields; fall back to defaults instead of failing the build.
  const defaults = UI_DEFAULTS[lang.code] || {};
  content.metaDescription = content.metaDescription || defaults.metaDescription || '';
  content.ui = { ...(defaults.ui || {}), ...(content.ui || {}) };
  content.projects = content.projects || [];
  for (const key of ['fields', 'projects']) content[key] = (content[key] || []).map((it) => ({ ...it, tag: normTag(it.tag) }));
  content.logo = content.logo || '/media/logo.png';
  // Zalo chat link: explicit CMS value, else zalo.me/<phone digits>
  content.zaloUrl = (content.zaloUrl || '').trim() || `https://zalo.me/${String(content.phoneLink || content.phoneDisplay || '').replace(/\D/g, '')}`;
  for (const key of REQUIRED) {
    if (!(key in content)) throw new Error(`${lang.site}: missing required field "${key}"`);
  }
  if (!Array.isArray(content.fields)) {
    throw new Error(`${lang.site}: fields must be an array.`);
  }
  const other = LANGS.find((l) => l !== lang);
  const alt = { code: other.code, label: other.label, href: `${other.base}/` };
  const articles = ALL[lang.code];
  const artUrl = (l, slug) => `${l.base}/${l.articles}/${encodeURIComponent(slug)}/`;
  const listHrefs = { [lang.code]: `${lang.base}/${lang.articles}/`, [other.code]: ALL[other.code].length ? `${other.base}/${other.articles}/` : `${other.base}/` };
  const href = (a) => `${lang.base}/${lang.articles}/${encodeURIComponent(a.slug)}/`;

  // Homepage cards: real articles only (no placeholder cards).
  const cards = articles.slice(0, 3).map((a) => ({
    href: href(a), tag: a.tag, color: a.color, date: fmtDate(a.date, lang.locale), title: a.title, excerpt: a.excerpt, image: a.cover,
  }));
  const homeContent = {
    ...content, posts: cards, articleCount: articles.length,
    articlesHref: `${lang.base}/${lang.articles}/`, altHref: alt.href, altLang: alt.code, altLabel: alt.label, lang: lang.code,
    langs: langList(lang), curFlag: flagUri(lang.code), curLabel: lang.label,
  };

  // Homepage (static <title>/<meta> so crawlers see them without running the page script)
  const homeTitle = content.siteTitle || 'Kỹ Sư Thập Cẩm';
  const hreflang = seoHead({ lang, content, title: homeTitle, description: content.metaDescription || '', path: `${lang.base}/`, image: content.logo, alternates: true, ld: [orgLd(content, content.metaDescription || '')] });
  const html = template
    .replace('<html lang="vi">', `<html lang="${lang.code}">`)
    .replace('<title>{{ siteTitle }}</title>', '')
    .replace('<meta name="description" content="{{ metaDescription }}">', '')
    .replace('<body>', `<body>\n${noscriptHtml(content)}`)
    .replace('</head>', `${hreflang}\n${ICON_LINKS}\n${analyticsTag(content)}\n<style>${LANG_CSS}</style><script>${LANG_JS}</script>\n</head>`);
  const outDir = path.join(output, lang.base.replace(/^\//, ''));
  await mkdir(outDir, { recursive: true });
  const homePrefix = lang.base ? '../' : '';
  await writeFile(path.join(outDir, 'index.html'), relativizeHtml(html, homePrefix), 'utf8');
  await writeFile(path.join(outDir, 'content.js'), relativizeJs(`window.KSTC_CONTENT = ${JSON.stringify(homeContent, null, 2)};\n`, homePrefix), 'utf8');
  sitemap.push({ loc: `${lang.base}/`, alternates: true });
  if (articles.length) sitemap.push({ loc: `${lang.base}/${lang.articles}/` });
  for (const a of articles) sitemap.push({ loc: `${lang.base}/${lang.articles}/${encodeURIComponent(a.slug)}/`, lastmod: isoDate(a.date) });
  const depth = (lang.base ? 1 : 0) + 1; // folder levels from site root to the articles list page

  // Article pages + list page
  for (const a of articles) {
    const body = `<article style="padding-top:40px">
<div class="meta"><span style="color:${a.color}">${esc(a.tag)}</span><span style="color:#8a8a84;font-weight:500">${esc(fmtDate(a.date, lang.locale))}</span></div>
<h1>${esc(a.title)}</h1>${a.cover ? `<img class="cover" src="${esc(a.cover)}" alt="${esc(a.title)}" onerror="this.onerror=null;this.src='/media/industrial-component.jpg'">` : ''}
<div class="prose">${a.html}</div></article>`;
    const dir = path.join(outDir, lang.articles, a.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), relativizeHtml(shell(lang, content, { title: a.title, description: a.excerpt || a.title, body, alt, hrefs: { [other.code]: PAIR[lang.code]?.[a.slug] ? artUrl(other, PAIR[lang.code][a.slug]) : listHrefs[other.code] }, seo: seoHead({ lang, content, title: `${a.title} · Kỹ Sư Thập Cẩm`, description: a.excerpt || a.title, path: `${lang.base}/${lang.articles}/${encodeURIComponent(a.slug)}/`, image: a.cover || content.logo, type: 'article', ld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt || a.title, image: [absUrl(a.cover || content.logo)], datePublished: isoDate(a.date) || undefined, inLanguage: lang.code, author: { '@type': 'Organization', name: 'Kỹ Sư Thập Cẩm' }, publisher: { '@type': 'Organization', name: 'Kỹ Sư Thập Cẩm', logo: { '@type': 'ImageObject', url: absUrl(content.logo) } }, mainEntityOfPage: `${SITE_URL}${lang.base}/${lang.articles}/${encodeURIComponent(a.slug)}/` }] }) }), '../'.repeat(depth + 1)), 'utf8');
  }
  const thumb = (a) => (a.cover ? `<img class="thumb" src="${esc(a.cover)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='/media/industrial-component.jpg'">` : `<div class="thumb ph"><img src="${esc(content.logo)}" alt=""></div>`);
  const metaLine = (a) => `<div class="meta"><span style="color:${a.color}">${esc(a.tag)}</span><span style="color:#8a8a84;font-weight:500">${esc(fmtDate(a.date, lang.locale))}</span></div>`;
  const newsCard = (a) => `<a class="card" data-tag="${esc(a.tag)}" href="${href(a)}">${thumb(a)}<div class="txt">${metaLine(a)}<strong class="clamp2" style="font-size:19px;line-height:1.35">${esc(a.title)}</strong><span class="clamp3" style="color:#4a4a46;font-size:15px;line-height:1.6">${esc(a.excerpt)}</span></div></a>`;
  const [lead, ...rest] = articles;
  const tags = [...new Set(rest.map((a) => a.tag).filter(Boolean))];
  const listBody = !articles.length ? `<p>${esc(content.ui.listEmpty)}</p>` : `<div style="padding-top:40px"><div class="news-kicker">${esc(content.ui.blogKicker)}</div><h1>${esc(content.ui.blogTitle)}</h1>
<a class="feature" href="${href(lead)}">${thumb(lead)}<div class="txt">${metaLine(lead)}<h2>${esc(lead.title)}</h2><span style="color:#4a4a46;font-size:16px;line-height:1.65">${esc(lead.excerpt)}</span><span style="color:#e8590c;font-weight:700">${esc(content.ui.readMore)} →</span></div></a>
${rest.length ? `${tags.length > 1 ? `<div class="chips"><button class="chip on" data-tag="">${esc(content.ui.blogFilterAll)}</button>${tags.map((t) => `<button class="chip" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div>` : ''}
<div class="grid" id="newsgrid">${rest.map(newsCard).join('')}</div>
<button class="more" id="more" style="display:none">${esc(content.ui.blogMore)}</button>
<script>${NEWS_JS}</script>` : ''}</div>`;
  if (articles.length) {
  await mkdir(path.join(outDir, lang.articles), { recursive: true });
  await writeFile(path.join(outDir, lang.articles, 'index.html'), relativizeHtml(shell(lang, content, { title: content.ui.blogTitle, description: content.ui.listDesc, body: listBody, alt, wide: true, hrefs: { [other.code]: listHrefs[other.code] }, seo: seoHead({ lang, content, title: `${content.ui.blogTitle} · Kỹ Sư Thập Cẩm`, description: content.ui.listDesc, path: `${lang.base}/${lang.articles}/`, image: content.logo }) }), '../'.repeat(depth)), 'utf8');
  }

  summary.push(`${lang.code}: ${articles.length} articles, ${cards.length} homepage cards`);
}

const sm = sitemap.map((e) => `  <url>
    <loc>${SITE_URL}${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}${e.alternates ? LANGS.map((l) => `\n    <xhtml:link rel="alternate" hreflang="${l.code}" href="${SITE_URL}${l.base}/"/>`).join('') : ''}
  </url>`).join('\n');
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sm}\n</urlset>\n`, 'utf8');
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');

console.log(`Built static site to ${path.relative(root, output)} (${summary.join(' | ')}).`);
