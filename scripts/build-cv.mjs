// One shared content template for the standalone CV and the portfolio's CV dialog.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const content = readFileSync(new URL('templates/cv.html', root), 'utf8').trim();
const fingerprint = createHash('sha256');
for (const name of ['templates/cv.html', 'css/cv.css', 'assets/img/photo_opt.jpg', 'assets/img/qr-portfolio-cv.svg', 'assets/img/layer_data_logo_opt.png']) fingerprint.update(readFileSync(new URL(name, root)));
const version = fingerprint.digest('hex').slice(0, 12);
const pdfURL = `/assets/cv/CV_Samy_Houchat.pdf?v=${version}`;
const standalone = new URL('cv_samy_houchat.html', root);
const portfolio = new URL('index.html', root);
let head = readFileSync(standalone, 'utf8').match(/<head>([\s\S]*?)<\/head>/)[1];
head = head.replace(/\s*<style>[\s\S]*?<\/style>/g, '');
head = head.replace(/\s*<link[^>]*(?:fonts\.googleapis|fonts\.gstatic)[^>]*>/g, '');
head = head.replace(/\s*<!-- Google Fonts[^>]*-->/g, '');
head = head.replace(/\s*<link rel="stylesheet" href="\/css\/cv.css(?:\?v=[^"]+)?">/g, '');
head = head.trimEnd() + `\n  <link rel="stylesheet" href="/css/cv.css?v=${version}">\n`;
const cv = `<!DOCTYPE html>
<html lang="fr">
<head>${head}</head>
<body class="cv-document">
  <aside class="cv-toolbar" aria-label="Actions du CV">
    <span>CV — Samy Houchat</span>
    <div class="cv-toolbar-actions">
      <a href="/">Retour au portfolio</a>
      <a href="${pdfURL}" download="CV_Samy_Houchat.pdf" class="cv-download" id="cv-download-pdf">Télécharger le PDF — 1 page A4</a>
      <button type="button" onclick="window.print()" id="btn-print-cv">Imprimer</button>
    </div>
  </aside>
  <div class="cv-page-wrapper">
    <main class="cv-page" id="cv-content">
${content}
    </main>
  </div>
</body>
</html>
`;
let home = readFileSync(portfolio, 'utf8');
const legacyCSS = home.indexOf('   CV OVERLAY PLEIN ÉCRAN');
if (legacyCSS >= 0) {
  const cssStart = home.lastIndexOf('/*', legacyCSS);
  const cssEnd = home.indexOf('/* Recruiter summary,', legacyCSS);
  if (cssEnd < 0) throw new Error('Missing legacy CV stylesheet boundary');
  home = home.slice(0, cssStart) + home.slice(cssEnd);
}
home = home.replace(/\s*<link rel="stylesheet" href="\/css\/cv.css(?:\?v=[^"]+)?">/g, '');
home = home.replace('</head>', `  <link rel="stylesheet" href="/css/cv.css?v=${version}">\n</head>`);
const start = home.indexOf('  <div class="cv-overlay-backdrop"');
const end = home.lastIndexOf('</body>');
if (start < 0 || end < start) throw new Error('Missing CV dialog boundary');
const dialog = `  <div class="cv-overlay-backdrop" id="cv-modal-overlay" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="cv-dialog-title">
    <aside class="cv-toolbar" aria-label="Actions du CV">
      <span id="cv-dialog-title">CV — Samy Houchat</span>
      <div class="cv-toolbar-actions">
        <button type="button" id="btn-close-cv">Retour au portfolio</button>
        <a href="${pdfURL}" download="CV_Samy_Houchat.pdf" class="cv-download" id="cv-download-pdf">Télécharger le PDF — 1 page A4</a>
        <button type="button" onclick="window.print()" id="btn-print-cv">Imprimer</button>
      </div>
    </aside>
    <div class="cv-page-wrapper">
      <div class="cv-page" id="cv-content">
${content.replace('<h1 class="cv-name">', '<h2 class="cv-name">').replace('</h1>', '</h2>')}
      </div>
    </div>
  </div>

`;
home = home.slice(0, start) + dialog + home.slice(end);
const versionPDF = source => source.replace(/(assets\/cv\/CV_Samy_Houchat\.pdf)(?:\?v=[a-f0-9]+)?(?=["'])/g, `$1?v=${version}`);
const modular = new URL('data/projects.js', root);
const modularContent = versionPDF(readFileSync(modular, 'utf8'));
for (const [path, output] of [[standalone, cv], [portfolio, versionPDF(home)], [modular, modularContent]]) {
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== output) {
      console.error('Shared CV content is stale. Run: node scripts/build-cv.mjs');
      process.exitCode = 1;
    }
  } else writeFileSync(path, output);
}
if (!process.exitCode) console.log(process.argv.includes('--check') ? 'PASS: web CV and dialog match their shared template.' : 'Updated web CV and portfolio dialog.');
