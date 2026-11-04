import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'site');
const output = path.join(root, 'dist');
const contentPath = path.join(root, 'content', 'site.json');

const content = JSON.parse(await readFile(contentPath, 'utf8'));
for (const key of ['heroTitle', 'heroHighlight', 'heroDescription', 'contactEmail', 'phoneDisplay', 'phoneLink', 'fields', 'products', 'steps', 'posts', 'faqs']) {
  if (!(key in content)) throw new Error(`Missing required content field: ${key}`);
}
if (!Array.isArray(content.posts) || !Array.isArray(content.fields)) {
  throw new Error('Content schema error: posts and fields must be arrays.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await writeFile(
  path.join(output, 'content.js'),
  `window.KSTC_CONTENT = ${JSON.stringify(content, null, 2)};\n`,
  'utf8'
);
console.log(`Built static site to ${path.relative(root, output)} (${content.posts.length} homepage posts, ${content.fields.length} service categories).`);
