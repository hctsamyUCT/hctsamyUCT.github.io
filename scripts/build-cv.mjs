// One shared content template for the standalone CV and the portfolio's CV dialog.
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const content = readFileSync(new URL('templates/cv.html', root), 'utf8').trim();
const standalone = new URL('cv_samy_houchat.html', root);
const portfolio = new URL('index.html', root);
let head = readFileSync(standalone, 'utf8').match(/<head>([\s\S]*?)<\/head>/)[1];
head = head.replace(/\s*<style>[\s\S]*?<\/style>/g, '');
head = head.replace(/\s*<link[^>]*(?:fonts\.googleapis|fonts\.gstatic)[^>]*>/g, '');
head = head.replace(/\s*<!-- Google Fonts[^>]*-->/g, '');
if (!head.includes('href="/css/cv.css"')) head = head.trimEnd() + '\n  <link rel="stylesheet" href="/css/cv.css">\n';
const cv = `<!DOCTYPE html>
<html lang="fr">
<head>${head}</head>
<body class="cv-document">
  <aside class="cv-toolbar" aria-label="Actions du CV">
    <span>CV — Samy Houchat</span>
    <div class="cv-toolbar-actions">
      <a href="/">Retour au portfolio</a>
      <button type="button" onclick="window.print()" id="btn-print-cv">Imprimer / Enregistrer en PDF</button>
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
if (!home.includes('href="/css/cv.css"')) home = home.replace('</head>', '  <link rel="stylesheet" href="/css/cv.css">\n</head>');
const start = home.indexOf('  <div class="cv-overlay-backdrop"');
const end = home.lastIndexOf('</body>');
if (start < 0 || end < start) throw new Error('Missing CV dialog boundary');
const dialog = `  <div class="cv-overlay-backdrop" id="cv-modal-overlay" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="cv-dialog-title">
    <aside class="cv-toolbar" aria-label="Actions du CV">
      <span id="cv-dialog-title">CV — Samy Houchat</span>
      <div class="cv-toolbar-actions">
        <button type="button" id="btn-close-cv">Retour au portfolio</button>
        <button type="button" onclick="window.print()" id="btn-print-cv">Imprimer / Enregistrer en PDF</button>
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
for (const [path, output] of [[standalone, cv], [portfolio, home]]) {
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== output) {
      console.error('Shared CV content is stale. Run: node scripts/build-cv.mjs');
      process.exitCode = 1;
    }
  } else writeFileSync(path, output);
}
if (!process.exitCode) console.log(process.argv.includes('--check') ? 'PASS: web CV and dialog match their shared template.' : 'Updated web CV and portfolio dialog.');
