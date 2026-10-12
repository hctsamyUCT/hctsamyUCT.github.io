// Reuse the actual portfolio renderers: crawlers and visitors receive the same content.
// This script only evaluates the repository's own inline JavaScript, not external input.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

export function renderPortfolioHTML(html) {
  const script = html.match(/<script id="portfolio-script">([\s\S]*?)<\/script>/)?.[1];
  if (!script) throw new Error('Missing portfolio-script');
  const nodes = new Map();
  const document = {
    readyState: 'loading',
    addEventListener() {},
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, { innerHTML: '', addEventListener() {}, querySelectorAll: () => [] });
      return nodes.get(id);
    },
  };
  const context = vm.createContext({ document });
  vm.runInContext(script, context, { timeout: 1000 });
  vm.runInContext('renderPortfolio()', context, { timeout: 1000 });

  for (const id of ['stats-grid', 'featured-project-container', 'other-projects-grid',
    'skills-categories-grid', 'timeline-container', 'education-list',
    'contact-search-desc']) {
    const start = `<!-- seo:${id}:start -->`;
    const end = `<!-- seo:${id}:end -->`;
    const a = html.indexOf(start);
    const b = html.indexOf(end, a);
    if (a < 0 || b < 0) throw new Error(`Missing SEO markers for ${id}`);
    const content = nodes.get(id).innerHTML.split('\n').map(line => line.trimEnd()).join('\n');
    html = html.slice(0, a + start.length) + content + html.slice(b);
  }

  // Keep the hero's visible text in sync with the same data used after JS initialization.
  const escapeHTML = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  for (const id of ['hero-name', 'hero-title', 'hero-headline', 'availability-text', 'meta-location']) {
    const pattern = new RegExp(`(<(h1|p|span)\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`);
    if (!pattern.test(html)) throw new Error(`Missing visible element ${id}`);
    html = html.replace(pattern, (_, open, tag, close) => open + escapeHTML(nodes.get(id).textContent) + close);
  }

  return html;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pageIndex = process.argv.indexOf('--page');
  const pageName = pageIndex >= 0 ? process.argv[pageIndex + 1] : 'index.html';
  const page = fileURLToPath(new URL('../' + pageName, import.meta.url));
  const html = renderPortfolioHTML(readFileSync(page, 'utf8'));
  if (process.argv.includes('--check')) {
    if (html !== readFileSync(page, 'utf8')) {
      console.error('Static portfolio content is stale. Run: node scripts/render-seo.mjs');
      process.exitCode = 1;
    } else console.log('PASS: static HTML matches the JavaScript renderers.');
  } else {
    writeFileSync(page, html);
    console.log('Updated crawlable portfolio content in index.html.');
  }
}
