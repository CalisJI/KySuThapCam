import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'site');
const output = path.join(root, 'dist');
const contentPath = path.join(root, 'content', 'site.json');
const postsDir = path.join(root, 'content', 'posts');

const content = JSON.parse(await readFile(contentPath, 'utf8'));
for (const key of ['heroTitle', 'heroHighlight', 'heroDescription', 'contactEmail', 'phoneDisplay', 'phoneLink', 'fields', 'products', 'steps', 'posts', 'faqs']) {
  if (!(key in content)) throw new Error(`Missing required content field: ${key}`);
}
if (!Array.isArray(content.posts) || !Array.isArray(content.fields)) {
  throw new Error('Content schema error: posts and fields must be arrays.');
}

const esc = (v = '') => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const toDate = (d) => (d instanceof Date ? d : new Date(d));
const fmtDate = (d) => {
  const dt = toDate(d);
  return Number.isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('vi-VN', { timeZone: 'UTC' });
};
const isoDate = (d) => {
  const dt = toDate(d);
  return Number.isNaN(dt.getTime()) ? '' : dt.toISOString().slice(0, 10);
};
const safeColor = (c) => (/^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#e8590c');

// ---- Load articles from content/posts/*.md (Pages CMS collection) ----
const articles = [];
let files = [];
try { files = (await readdir(postsDir)).filter((f) => f.endsWith('.md')); } catch { /* no posts yet */ }
for (const file of files) {
  const { data, content: body } = matter(await readFile(path.join(postsDir, file), 'utf8'));
  if (data.draft) continue;
  if (!data.title) throw new Error(`Article ${file} is missing a title.`);
  articles.push({
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
articles.sort((a, b) => isoDate(b.date).localeCompare(isoDate(a.date)));
const href = (a) => `/bai-viet/${encodeURIComponent(a.slug)}/`;

// ---- Homepage cards: real articles first, teasers from site.json fill up to 3 ----
const cards = articles.slice(0, 6).map((a) => ({
  href: href(a), tag: a.tag, color: a.color, date: fmtDate(a.date), title: a.title, excerpt: a.excerpt, image: a.cover,
}));
for (const t of content.posts) { if (cards.length < 3) cards.push(t); }
const homeContent = { ...content, posts: cards, articleCount: articles.length };

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await writeFile(path.join(output, 'content.js'), `window.KSTC_CONTENT = ${JSON.stringify(homeContent, null, 2)};\n`, 'utf8');

// ---- Static article pages ----
const phoneLink = content.phoneLink || '';
const shell = ({ title, description, body }) => `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Kỹ Sư Thập Cẩm</title>
<meta name="description" content="${esc(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;background:#fafaf8;color:#141414;font-family:'Be Vietnam Pro',Helvetica,Arial,sans-serif}
a{color:#e8590c;text-decoration:none}a:hover{color:#1f9d4d}
header{background:rgba(250,250,248,.92);border-bottom:1px solid #ececE6}
.wrap{max-width:760px;margin:0 auto;padding:0 24px}.bar{max-width:1200px;margin:0 auto;padding:16px 24px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center}
.brand{font-weight:800;color:#141414;font-size:16px}
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
footer{padding:40px 0;color:#6a6a64;font-size:14px}
</style></head><body>
<header><div class="bar"><a class="brand" href="/">KỸ SƯ THẬP CẨM</a><nav style="display:flex;gap:20px;font-size:14px;font-weight:600"><a href="/#thiet-bi">Thiết bị</a><a href="/bai-viet/">Chia sẻ</a><a href="/#lien-he">Liên hệ</a></nav></div></header>
<main class="wrap">${body}
<div class="cta"><strong>Cần tư vấn thiết bị, cảm biến cho dây chuyền?</strong><br>
<a href="tel:${esc(phoneLink)}">${esc(content.phoneDisplay)}</a> · <a href="mailto:${esc(content.contactEmail)}">${esc(content.contactEmail)}</a></div>
</main><footer><div class="wrap"><a href="/">← Về trang chủ</a></div></footer></body></html>`;

for (const a of articles) {
  const body = `<article style="padding-top:40px">
<div class="meta"><span style="color:${a.color}">${esc(a.tag)}</span><span style="color:#8a8a84;font-weight:500">${esc(fmtDate(a.date))}</span></div>
<h1>${esc(a.title)}</h1>${a.cover ? `<img class="cover" src="${esc(a.cover)}" alt="${esc(a.title)}">` : ''}
<div class="prose">${a.html}</div></article>`;
  const dir = path.join(output, 'bai-viet', a.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), shell({ title: a.title, description: a.excerpt || a.title, body }), 'utf8');
}
const listBody = `<div style="padding-top:40px"><h1>Kinh nghiệm &amp; kiến thức</h1>
<div class="grid">${articles.length ? articles.map((a) => `<a class="card" href="${href(a)}">${a.cover ? `<img src="${esc(a.cover)}" alt="">` : ''}
<div class="meta"><span style="color:${a.color}">${esc(a.tag)}</span><span style="color:#8a8a84;font-weight:500">${esc(fmtDate(a.date))}</span></div>
<strong style="font-size:19px;line-height:1.35">${esc(a.title)}</strong><span style="color:#4a4a46;font-size:15px;line-height:1.6">${esc(a.excerpt)}</span></a>`).join('') : '<p>Bài viết đang được cập nhật.</p>'}</div></div>`;
await mkdir(path.join(output, 'bai-viet'), { recursive: true });
await writeFile(path.join(output, 'bai-viet', 'index.html'), shell({ title: 'Chia sẻ kỹ thuật', description: 'Kinh nghiệm và kiến thức về thiết bị, cảm biến, tự động hóa.', body: listBody }), 'utf8');

console.log(`Built static site to ${path.relative(root, output)} (${articles.length} articles, ${cards.length} homepage cards, ${content.fields.length} service categories).`);
