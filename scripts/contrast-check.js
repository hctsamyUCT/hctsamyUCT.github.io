// Measure rendered text against the composed solid background of its ancestors.
// Excludes screenshots and gradient text; this is not a complete accessibility audit.
() => {
  const rgba = value => {
    const parts = value.match(/[\d.]+/g).map(Number);
    return [...parts.slice(0, 3), parts[3] ?? 1];
  };
  const blend = (top, bottom) => top.slice(0, 3).map((value, i) => value * top[3] + bottom[i] * (1 - top[3]));
  const background = element => {
    const parent = element.parentElement ? background(element.parentElement) : [255, 255, 255];
    return blend(rgba(getComputedStyle(element).backgroundColor), parent);
  };
  const luminance = color => color.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
  const selectors = [
    '.nav-link', '.language-switch a', '.hero-title', '.hero-headline', '.availability-badge',
    '.hero-status-pill', '.meta-item', '.value-intro', '.stat-badge', '.stat-title', '.stat-subtitle',
    '.stat-proof-link', '.section-label', '.section-description', '.featured-domain-badge',
    '.featured-sector-badge', '.featured-desc-compact', '.featured-overview',
    '.featured-confidentiality-note', '.featured-points-list li', '.skill-tag',
    '.proof-tab-title', '.proof-tab-sub', '.proof-tab-num', '.project-title', '.project-subtitle',
    '.project-summary', '.tag-badge', '.category-name', '.timeline-role', '.timeline-company',
    '.timeline-period', '.timeline-mission-title', '.timeline-bullet', '.education-period-badge',
    '.education-degree', '.education-institution', '.education-highlight', '.btn',
    '#contact-search-desc', '#project-modal-body .featured-summary',
    '#project-modal-body .featured-point-item', '#project-modal-body .featured-result-box'
  ];
  let checked = 0;
  let minimum = Infinity;
  const failures = [];
  for (const element of document.querySelectorAll(selectors.join(','))) {
    if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    if (element.closest('#cv-modal-overlay')) continue;
    const style = getComputedStyle(element);
    const bg = background(element);
    const text = blend(rgba(style.color), bg);
    const light = luminance(text), dark = luminance(bg);
    const ratio = (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
    checked += 1;
    minimum = Math.min(minimum, ratio);
    if (ratio < 4.5) failures.push({ element: element.className || element.id,
      text: element.textContent.trim().slice(0, 70), ratio: Number(ratio.toFixed(2)) });
  }
  return { checked, minimum: Number(minimum.toFixed(2)), failures };
};
