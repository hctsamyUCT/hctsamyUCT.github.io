// Generate the English edition from the French page, using explicit, reviewed translations.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderPortfolioHTML } from './render-seo.mjs';

const root = new URL('../', import.meta.url);
const target = new URL('en/index.html', root);
const base = 'https://hctsamyuct.github.io/';
let html = readFileSync(new URL('index.html', root), 'utf8');
const translations = JSON.parse(readFileSync(new URL('data/en-translations.json', root), 'utf8'));

// The downloadable CV remains French; link to it explicitly rather than show a partial translation.
const cvStart = html.indexOf('  <div class="cv-overlay-backdrop"');
if (cvStart < 0) throw new Error('Missing French CV dialog boundary');
html = html.slice(0, cvStart) + '\n</body>\n</html>\n';
// Keep CV-specific styles and print overrides out of the English portfolio.
const cssMarker = html.indexOf('   CV OVERLAY PLEIN ÉCRAN');
const cssStart = html.lastIndexOf('/*', cssMarker);
const cssEnd = html.indexOf('/* Recruiter summary,', cssMarker);
if (cssMarker < 0 || cssEnd < 0) throw new Error('Missing CV stylesheet boundary');
html = html.slice(0, cssStart) + html.slice(cssEnd);
html = html.replace('id="hero-cv-view-btn"', 'id="hero-cv-fr-link"');
html = html.replace('<html lang="fr"', '<html lang="en"');

const variants = new Map();
for (const [french, english] of Object.entries(translations)) {
  variants.set(french, english);
  variants.set(french.replaceAll('&', '&amp;'), english.replaceAll('&', '&amp;'));
  variants.set(french.replaceAll("'", "\\'"), english.replaceAll("'", "\\'"));
}
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = new RegExp([...variants.keys()].sort((a, b) => b.length - a.length).map(escapeRegex).join('|'), 'g');
html = html.replace(pattern, match => variants.get(match));
html = html.replace(/(["'])assets\//g, '$1/assets/');
html = html.replace(/href="cv_samy_houchat.html"/g, 'href="/cv_samy_houchat.html"');
html = html.replace(/(<link rel="canonical" href=")[^"]+/, '$1' + base + 'en/');
html = html.replace(/(<meta property="og:url" content=")[^"]+/, '$1' + base + 'en/');
html = html.replace('content="fr_FR"', 'content="en_GB"');
html = html.replace('hreflang="fr" aria-current="page"', 'hreflang="fr"');
html = html.replace('lang="en" hreflang="en">EN', 'lang="en" hreflang="en" aria-current="page">EN');

html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
  (_, open, body, close) => {
    const schema = JSON.parse(body);
    for (const entity of schema['@graph']) {
      if (entity['@type'] === 'WebSite') entity.inLanguage = ['fr', 'en'];
      if (entity['@type'] === 'ProfilePage') {
        entity['@id'] = base + 'en/#webpage';
        entity.url = base + 'en/';
        entity.inLanguage = 'en';
      }
    }
    return open + '\n' + JSON.stringify(schema, null, 2) + '\n  ' + close;
  });

html = renderPortfolioHTML(html);
html = html.split(/\r?\n/).map(line => line.trimEnd()).join('\n');
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== html) {
    console.error('English edition is stale. Run: node scripts/build-en.mjs');
    process.exitCode = 1;
  } else console.log('PASS: English edition matches its French source and translations.');
} else {
  mkdirSync(fileURLToPath(new URL('en/', root)), { recursive: true });
  writeFileSync(target, html);
  console.log('Updated en/index.html with crawlable English content.');
}
