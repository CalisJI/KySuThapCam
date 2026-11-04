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
const langList = (current) => LANGS.map((l) => ({
  code: l.code, label: l.label, name: l.name, href: `${l.base}/`, flag: flagUri(l.code), mark: l === current ? '✓' : '',
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
const SHARED_SINGLE = ['phoneDisplay', 'phoneLink', 'contactEmail', 'fbUrl', 'showBlog', 'logo', 'analyticsToken', 'googleVerification'];
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
      tag: data.tag || '',
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

const langMenuHtml = (lang) => `<details class="lang-menu"><summary><img src="${flagUri(lang.code)}" width="22" height="15" alt=""> ${lang.label} <span>▾</span></summary><div class="lang-pop">${langList(lang).map((l) => `<a href="${l.href}" hreflang="${l.code}"><img src="${l.flag}" width="22" height="15" alt=""><span>${l.name}</span><b>${l.mark}</b></a>`).join('')}</div></details>`;
const LANG_CSS = `.lang-menu{position:relative}.lang-menu summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;border:1.5px solid #141414;color:#141414;border-radius:999px;padding:6px 12px;font-size:13px;font-weight:800}.lang-menu summary::-webkit-details-marker{display:none}.lang-menu img{border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.15)}.lang-pop{position:absolute;right:0;top:calc(100% + 8px);background:#fff;border-radius:14px;box-shadow:0 12px 32px -8px rgba(0,0,0,.28);padding:6px;min-width:170px;z-index:50}.lang-pop a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:#141414;font-size:14px;font-weight:600}.lang-pop a:hover{background:#f3f1ec;color:#141414}.lang-pop b{margin-left:auto;color:#1f9d4d}`;
const NEWS_JS = `(function(){var chips=[].slice.call(document.querySelectorAll('.chip')),cards=[].slice.call(document.querySelectorAll('#newsgrid .card')),more=document.getElementById('more'),limit=9,tag='';function ok(c){return !tag||c.getAttribute('data-tag')===tag}function apply(){var n=0;cards.forEach(function(c){var v=ok(c)&&n<limit;if(ok(c))n++;c.style.display=v?'':'none'});if(more)more.style.display=cards.filter(ok).length>limit?'':'none'}chips.forEach(function(b){b.onclick=function(){tag=b.getAttribute('data-tag');chips.forEach(function(x){x.className=x===b?'chip on':'chip'});limit=9;apply()}});if(more)more.onclick=function(){limit+=9;apply()};apply()})();`;
const LANG_JS = `document.addEventListener('click',function(e){document.querySelectorAll('details.lang-menu[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open')})});`;
const shell = (lang, content, { title, description, body, alt, seo, wide }) => `<!doctype html>
<html lang="${lang.code}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${seo}
${ICON_LINKS}
${analyticsTag(content)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;background:#fafaf8;color:#141414;font-family:'Be Vietnam Pro',Helvetica,Arial,sans-serif}
a{color:#e8590c;text-decoration:none}a:hover{color:#1f9d4d}
header{background:rgba(250,250,248,.92);border-bottom:1px solid #ececE6}
.wrap{max-width:760px;margin:0 auto;padding:0 24px}.bar{max-width:1200px;margin:0 auto;padding:16px 24px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center}
.brand{font-weight:800;color:#141414;font-size:16px;display:flex;align-items:center;gap:10px}.brand img{width:34px;height:34px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.14)}
.meta{display:flex;gap:10px;font-size:12px;font-weight:800;letter-spacing:.06em}
h1{font-size:clamp(28px,4vw,42px);line-height:1.15;letter-spacing:-.02em;margin:12px 0 0}
.cover{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:18px;margin-top:28px;display:block}
.prose{font-size:17px;line-height:1.75;color:#2e2e2b;margin-top:28px}.prose h2{font-size:26px;margin:36px 0 8px}.prose h3{font-size:21px;margin:28px 0 6px}
.prose img{max-width:100%;height:auto;border-radius:12px}.prose table{border-collapse:collapse;width:100%}.prose td,.prose th{border:1px solid #ddd;padding:8px}
.prose pre{background:#141414;color:#eee;padding:16px;border-radius:12px;overflow:auto}.prose code{font-family:ui-monospace,Menlo,monospace}
.cta{margin:48px 0;background:#141414;color:#fff;border-radius:22px;padding:28px}.cta a{color:#ff8a45;font-weight:700}
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
footer{padding:40px 0;color:#6a6a64;font-size:14px}
</style></head><body>
<header><div class="bar"><a class="brand" href="${lang.base}/"><img src="${esc(content.logo)}" alt="" width="34" height="34">KỸ SƯ THẬP CẨM</a>
<nav style="display:flex;gap:20px;font-size:14px;font-weight:600;align-items:center"><a href="${lang.base}/#thiet-bi">${esc(content.ui.navDevices)}</a><a href="${lang.base}/${lang.articles}/">${esc(content.ui.navShare)}</a><a href="${lang.base}/#lien-he">${esc(content.ui.navCta.replace(/\s*↗/, ''))}</a>${langMenuHtml(lang)}</nav></div></header>
<main class="wrap${wide ? ' wide' : ''}">${body}
<div class="cta"><strong>${esc(content.ui.articleCta)}</strong><br>
<a href="tel:${esc(content.phoneLink)}">${esc(content.phoneDisplay)}</a> · <a href="mailto:${esc(content.contactEmail)}">${esc(content.contactEmail)}</a></div>
</main><script>${LANG_JS}</script><footer><div class="wrap"><a href="${lang.base}/">${esc(content.ui.backHome)}</a></div></footer></body></html>`;

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
const template = await readFile(path.join(source, 'index.html'), 'utf8');

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
  content.logo = content.logo || '/media/logo.png';
  for (const key of REQUIRED) {
    if (!(key in content)) throw new Error(`${lang.site}: missing required field "${key}"`);
  }
  if (!Array.isArray(content.fields)) {
    throw new Error(`${lang.site}: fields must be an array.`);
  }
  const other = LANGS.find((l) => l !== lang);
  const alt = { code: other.code, label: other.label, href: `${other.base}/` };
  const articles = await loadArticles(lang);
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
<h1>${esc(a.title)}</h1>${a.cover ? `<img class="cover" src="${esc(a.cover)}" alt="${esc(a.title)}">` : ''}
<div class="prose">${a.html}</div></article>`;
    const dir = path.join(outDir, lang.articles, a.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), relativizeHtml(shell(lang, content, { title: a.title, description: a.excerpt || a.title, body, alt, seo: seoHead({ lang, content, title: `${a.title} · Kỹ Sư Thập Cẩm`, description: a.excerpt || a.title, path: `${lang.base}/${lang.articles}/${encodeURIComponent(a.slug)}/`, image: a.cover || content.logo, type: 'article', ld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt || a.title, image: [absUrl(a.cover || content.logo)], datePublished: isoDate(a.date) || undefined, inLanguage: lang.code, author: { '@type': 'Organization', name: 'Kỹ Sư Thập Cẩm' }, publisher: { '@type': 'Organization', name: 'Kỹ Sư Thập Cẩm', logo: { '@type': 'ImageObject', url: absUrl(content.logo) } }, mainEntityOfPage: `${SITE_URL}${lang.base}/${lang.articles}/${encodeURIComponent(a.slug)}/` }] }) }), '../'.repeat(depth + 1)), 'utf8');
  }
  const thumb = (a) => (a.cover ? `<img class="thumb" src="${esc(a.cover)}" alt="" loading="lazy">` : `<div class="thumb ph"><img src="${esc(content.logo)}" alt=""></div>`);
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
  await writeFile(path.join(outDir, lang.articles, 'index.html'), relativizeHtml(shell(lang, content, { title: content.ui.blogTitle, description: content.ui.listDesc, body: listBody, alt, wide: true, seo: seoHead({ lang, content, title: `${content.ui.blogTitle} · Kỹ Sư Thập Cẩm`, description: content.ui.listDesc, path: `${lang.base}/${lang.articles}/`, image: content.logo }) }), '../'.repeat(depth)), 'utf8');
  }

  summary.push(`${lang.code}: ${articles.length} articles, ${cards.length} homepage cards`);
}

const sm = sitemap.map((e) => `  <url>
    <loc>${SITE_URL}${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}${e.alternates ? LANGS.map((l) => `\n    <xhtml:link rel="alternate" hreflang="${l.code}" href="${SITE_URL}${l.base}/"/>`).join('') : ''}
  </url>`).join('\n');
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sm}\n</urlset>\n`, 'utf8');
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');

console.log(`Built static site to ${path.relative(root, output)} (${summary.join(' | ')}).`);
