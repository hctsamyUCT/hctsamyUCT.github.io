// Generate the English edition from the French page, using explicit, reviewed translations.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { renderPortfolioHTML } from './render-seo.mjs';

const root = new URL('../', import.meta.url);
const target = new URL('en/index.html', root);
const base = 'https://hctsamyuct.github.io/';
let html = readFileSync(new URL('index.html', root), 'utf8');
const translations = JSON.parse(readFileSync(new URL('data/en-translations.json', root), 'utf8'));

// Fingerprint sources for versioning
const contentEN = readFileSync(new URL('templates/cv-en.html', root), 'utf8').trim();
const fingerprint = createHash('sha256');
for (const name of ['templates/cv.html', 'templates/cv-en.html', 'css/cv.css', 'assets/img/photo_opt.jpg', 'assets/img/qr-portfolio-cv.svg', 'assets/img/layer_data_logo_opt.png']) {
  let buf = readFileSync(new URL(name, root));
  if (name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.svg')) {
    buf = Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  }
  fingerprint.update(buf);
}
const version = fingerprint.digest('hex').slice(0, 12);
const pdfURLEn = `/assets/cv/CV_Samy_Houchat_EN.pdf?v=${version}`;

// Embed the English CV dialog in the English portfolio
const cvStart = html.indexOf('  <div class="cv-overlay-backdrop"');
const cvEnd = html.lastIndexOf('</body>');
if (cvStart < 0 || cvEnd < cvStart) throw new Error('Missing French CV dialog boundary');
const dialogEN = `  <div class="cv-overlay-backdrop" id="cv-modal-overlay" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="cv-dialog-title">
    <aside class="cv-toolbar" aria-label="CV Actions">
      <span id="cv-dialog-title">CV — Samy Houchat</span>
      <div class="cv-toolbar-actions">
        <button type="button" id="btn-close-cv">Back to portfolio</button>
        <a href="${pdfURLEn}" download="CV_Samy_Houchat_Internship_Data_Analyst_BI.pdf" class="cv-download" id="cv-download-pdf">Download PDF — 1 A4 page</a>
        <button type="button" onclick="window.print()" id="btn-print-cv">Print</button>
      </div>
    </aside>
    <div class="cv-page-wrapper">
      <div class="cv-page" id="cv-content">
${contentEN.replace('<h1 class="cv-name">', '<h2 class="cv-name">').replace('</h1>', '</h2>')}
      </div>
    </div>
  </div>

`;
html = html.slice(0, cvStart) + dialogEN + html.slice(cvEnd);
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
html = html.replace(/href="cv_samy_houchat\.html"/g, 'href="/cv_samy_houchat_en.html"');
html = html.replace(/href="\/cv_samy_houchat\.html"/g, 'href="/cv_samy_houchat_en.html"');
html = html.replace(/href=["'](?:\/)?assets\/cv\/CV_Samy_Houchat\.pdf(?:\?v=[^"']*)?["']/g, `href="${pdfURLEn}"`);
html = html.replace(/download=["']CV_Samy_Houchat_Stage_Data_Analyst_BI\.pdf["']/g, 'download="CV_Samy_Houchat_Internship_Data_Analyst_BI.pdf"');
html = html.replace(/cvPdfPath:\s*["'][^"']+["']/g, `cvPdfPath: "${pdfURLEn}"`);
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
