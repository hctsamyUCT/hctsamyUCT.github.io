/**
 * Portfolio Samy Houchat — Logique Vanilla JavaScript
 * Gestion du Thème (Clair/Sombre), Rendu dynamique, Modale & Lightbox tactile
 */

import { siteConfig } from '../data/projects.js';

// État global
const state = {
  currentTheme: 'dark',
  activeGallery: [],
  currentLightboxIndex: 0,
  touchStartX: 0,
  touchEndX: 0
};

/* --------------------------------------------------------------------------
   1. GESTION DU THÈME (CLAIR / SOMBRE)
   -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('samy_portfolio_theme');
  if (savedTheme) {
    state.currentTheme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    state.currentTheme = 'light';
  } else {
    state.currentTheme = 'dark';
  }

  applyTheme(state.currentTheme);

  // Écouteur sur le bouton de thème
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const nextTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Écouteur sur le changement de préférence système
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('samy_portfolio_theme')) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
}

function applyTheme(theme) {
  state.currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('samy_portfolio_theme', theme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
    toggleBtn.innerHTML = theme === 'dark'
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`
      : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`;
  }
}

/* --------------------------------------------------------------------------
   2. RENDU DES DONNÉES DU PORTFOLIO
   -------------------------------------------------------------------------- */
function renderPortfolio() {
  const p = siteConfig.profile;

  // Hero Profil
  document.getElementById('hero-name').textContent = p.name;
  document.getElementById('hero-title').textContent = p.title;
  document.getElementById('hero-headline').textContent = p.headline;
  document.getElementById('availability-text').textContent = p.availabilityBadge;
  document.getElementById('meta-location').textContent = p.location;
  document.getElementById('meta-email-text').textContent = p.email;
  document.getElementById('meta-email-link').href = `mailto:${p.email}`;
  document.getElementById('hero-photo').src = p.photoPath;
  document.getElementById('hero-photo').alt = `Photo de profil de ${p.name}`;
  document.getElementById('hero-contact-btn').href = `mailto:${p.email}`;
  document.getElementById('hero-linkedin-btn').href = p.linkedin;
  document.getElementById('hero-github-btn').href = p.githubUser;

  // CV Download action
  const cvBtn = document.getElementById('hero-cv-btn');
  if (cvBtn) {
    cvBtn.href = p.cvPdfPath;
    cvBtn.addEventListener('click', (e) => {
      // Détection gracieuse si fichier non encore déposé
      fetch(p.cvPdfPath, { method: 'HEAD' })
        .then(res => {
          if (!res.ok) {
            e.preventDefault();
            showToast("Le CV PDF complet sera téléchargé dès mise en ligne. Vous pouvez imprimer cette page en PDF (Ctrl+P) !");
            window.print();
          }
        })
        .catch(() => {
          // Si offline ou fetch local bloqué, laisser l'action naturelle
        });
    });
  }

  // Points Clés / Stats
  renderKeyStats();

  // Projet Vedette (AGRANA Supply Chain)
  renderFeaturedProject();

  // Autres Projets
  renderOtherProjects();

  // Compétences
  renderSkills();

  // Expérience
  renderExperiences();

  // Formation & Langues
  renderEducationAndLanguages();

  // Recherche de Stage & Contact
  renderContactSection();
}

function renderKeyStats() {
  const container = document.getElementById('stats-grid');
  if (!container) return;

  container.innerHTML = siteConfig.keyStats.map(stat => `
    <div class="stat-card" data-stat-id="${stat.id}">
      <span class="stat-badge">${stat.badge}</span>
      <h3 class="stat-title">${stat.title}</h3>
      <p class="stat-subtitle">${stat.subtitle}</p>
    </div>
  `).join('');
}

function renderFeaturedProject() {
  const fp = siteConfig.featuredProject;
  const container = document.getElementById('featured-project-container');
  if (!container) return;

  const clientName = siteConfig.getClientName(fp.clientKey);
  let activeProofIdx = 0;

  container.innerHTML = `
    <div class="featured-card">
      <div class="featured-grid">
        <div class="featured-preview-column">
          <!-- Aperçu principal zoomable -->
          <div class="featured-preview-box" id="featured-zoom-trigger" role="button" tabindex="0" aria-label="Agrandir la capture active en plein écran">
            <img src="${fp.gallery[0].src}" alt="${fp.gallery[0].alt}" class="featured-preview-img" id="featured-main-img" loading="eager" width="760" height="430">
            <div class="preview-overlay-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <span>Cliquer pour zoomer en plein écran</span>
            </div>
          </div>

          <!-- Sélecteur interactif des 3 preuves -->
          <div class="featured-proofs-tabs" role="tablist" aria-label="Choisir la capture à afficher">
            ${fp.gallery.map((item, idx) => `
              <button type="button" class="proof-tab-btn ${idx === 0 ? 'active' : ''}" data-proof-idx="${idx}" role="tab" aria-selected="${idx === 0}">
                <span class="proof-tab-num">${idx + 1}</span>
                <div class="proof-tab-text">
                  <span class="proof-tab-title">${item.title}</span>
                  <span class="proof-tab-sub">${item.subtitle}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="featured-content-column">
          <div class="featured-meta-row">
            <span class="featured-domain-badge">BI &amp; Décisionnel</span>
            <span class="featured-sector-badge">🏭 ${clientName}</span>
          </div>

          <h3 class="featured-title-compact">${fp.title}</h3>
          <p class="featured-desc-compact">${fp.subtitle}</p>

          <ul class="featured-points-list">
            <li>Pipelines ETL Python · Architecture Bronze → Gold</li>
            <li>Modélisation en étoile · Table de pont BRIDGE</li>
            <li>Dashboards Power BI · KPI OTIF temps réel</li>
          </ul>

          <div class="featured-tags-compact">
            ${fp.tags.slice(0, 5).map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Gestion des onglets de preuves
  const proofBtns = container.querySelectorAll('.proof-tab-btn');
  const mainImg = document.getElementById('featured-main-img');

  proofBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-proof-idx'), 10);
      activeProofIdx = idx;

      proofBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (mainImg && fp.gallery[idx]) {
        mainImg.src = fp.gallery[idx].src;
        mainImg.alt = fp.gallery[idx].alt;
      }
    });
  });

  // Événements zoom & modale
  const zoomTrigger = document.getElementById('featured-zoom-trigger');
  if (zoomTrigger) {
    zoomTrigger.addEventListener('click', () => {
      openLightbox(fp.gallery, activeProofIdx);
    });
    zoomTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(fp.gallery, activeProofIdx);
      }
    });
  }
}

function renderOtherProjects() {
  const container = document.getElementById('other-projects-grid');
  if (!container) return;

  container.innerHTML = siteConfig.otherProjects.map((p, idx) => `
    <article class="project-card" data-project-id="${p.id}">
      <div class="project-thumbnail-wrapper" role="button" tabindex="0" data-project-idx="${idx}" aria-label="Agrandir la capture de ${p.title}">
        <img src="${p.thumbnail}" alt="${p.title}" class="project-thumbnail-img" loading="lazy" width="600" height="375">
        <span class="project-badge-float">${p.status}</span>
        <div class="preview-overlay-hint">
          <span>${p.gallery.length} capture${p.gallery.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div class="project-body">
        <span class="stat-badge" style="margin-bottom:0.5rem;">${p.tag}</span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-subtitle">${p.subtitle}</p>
        <p class="project-summary">${p.summary}</p>

        <div class="tags-list">
          ${p.stack.slice(0, 5).map(tech => `<span class="tag-badge">${tech}</span>`).join('')}
        </div>

        <div class="project-footer">
          <button type="button" class="btn btn-secondary btn-detail-trigger" data-project-idx="${idx}">
            <span>Voir le détail</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </button>

          <a href="${p.githubOrg || p.githubPersonal}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="min-height:42px; padding:0.5rem 0.9rem;" title="Voir sur GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </article>
  `).join('');

  // Clics pour modale et zoom
  container.querySelectorAll('.btn-detail-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-project-idx'), 10);
      openProjectModal(siteConfig.otherProjects[idx]);
    });
  });

  container.querySelectorAll('.project-thumbnail-wrapper').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const idx = parseInt(wrap.getAttribute('data-project-idx'), 10);
      const proj = siteConfig.otherProjects[idx];
      openLightbox(proj.gallery, 0);
    });
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(wrap.getAttribute('data-project-idx'), 10);
        openLightbox(siteConfig.otherProjects[idx].gallery, 0);
      }
    });
  });
}

function getSkillCategoryIcon(type) {
  if (type === 'chart-bar') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>`;
  }
  if (type === 'database') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.73 1.23 6 1.23s4.39-.45 6-1.23V17zm0-4c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.73 1.23 6 1.23s4.39-.45 6-1.23V13z"/></svg>`;
  }
  if (type === 'code') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`;
  }
  if (type === 'table') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"/></svg>`;
  }
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 17H7V7h10v10zm2-14h-2V1h-2v2h-2V1h-2v2H9V1H7v2H5c-1.1 0-2 .9-2 2v2H1v2h2v2H1v2h2v2H1v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2V7h-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>`;
}

function renderSkills() {
  const container = document.getElementById('skills-categories-grid');
  if (!container) return;

  container.innerHTML = siteConfig.skillCategories.map(cat => `
    <div class="skill-category-card">
      <div class="category-header">
        <div class="category-icon">
          ${getSkillCategoryIcon(cat.icon)}
        </div>
        <h3 class="category-name">${cat.name}</h3>
      </div>

      <div class="skills-tags-wrap">
        ${cat.skills.map(s => {
          const name = typeof s === 'string' ? s : s.name;
          return `<span class="skill-tag">${name}</span>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function renderExperiences() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = siteConfig.experiences.map(exp => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${exp.role}</h3>
            <p class="timeline-company">${exp.company} ${exp.companySubtitle ? `· <em>${exp.companySubtitle}</em>` : ''} — 📍 ${exp.location}</p>
          </div>
          <span class="timeline-period">${exp.period}</span>
        </div>

        ${exp.missions.map(m => {
          let title = m.title;
          title = title.replace('{agrana}', siteConfig.getClientName('agrana'));
          title = title.replace('{sogral}', siteConfig.getClientName('sogral'));

          return `
            <div class="timeline-mission-block">
              <h4 class="timeline-mission-title">${title}</h4>
              <ul class="timeline-bullets">
                ${m.bullets.map(b => `<li class="timeline-bullet">${b}</li>`).join('')}
              </ul>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function renderEducationAndLanguages() {
  const eduContainer = document.getElementById('education-list');
  if (eduContainer) {
    eduContainer.innerHTML = siteConfig.education.map(edu => `
      <div class="education-item">
        <span class="education-period-badge">${edu.period}</span>
        <h3 class="education-degree">${edu.degree}</h3>
        <p class="education-institution">${edu.institution} · 📍 ${edu.location}</p>
        <p class="education-highlight">${edu.highlight}</p>
      </div>
    `).join('');
  }

  const langContainer = document.getElementById('languages-list');
  if (langContainer) {
    langContainer.innerHTML = siteConfig.languages.map(l => `
      <div class="language-item">
        <div class="lang-info">
          <span class="lang-flag">${l.flag}</span>
          <span class="lang-name">${l.name}</span>
        </div>
        <span class="lang-level">${l.level}</span>
      </div>
    `).join('');
  }
}

function renderContactSection() {
  const s = siteConfig.internshipSearch;
  const p = siteConfig.profile;

  const descEl = document.getElementById('contact-search-desc');
  if (descEl) {
    descEl.innerHTML = `
      Je suis activement à la recherche d'un stage de <strong>${s.duration}</strong> débutant le <strong>${s.startDate}</strong> dans le domaine <strong>${s.domain}</strong>. Basé à Aurillac avec mobilité France entière.
    `;
  }

  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) {
    emailLink.href = `mailto:${p.email}`;
    document.getElementById('contact-email-val').textContent = p.email;
  }

  const linkedinLink = document.getElementById('contact-linkedin-link');
  if (linkedinLink) {
    linkedinLink.href = p.linkedin;
    document.getElementById('contact-linkedin-val').textContent = "linkedin.com/in/samyhouchat";
  }

  const githubUserLink = document.getElementById('contact-github-user');
  if (githubUserLink) {
    githubUserLink.href = p.githubUser;
  }

  const githubOrgLink = document.getElementById('contact-github-org');
  if (githubOrgLink) {
    githubOrgLink.href = p.githubOrg;
  }
}

/* --------------------------------------------------------------------------
   3. MODALE DE PROJET DÉTAILLÉ
   -------------------------------------------------------------------------- */
function openProjectModal(project) {
  const overlay = document.getElementById('project-modal-overlay');
  const dialog = document.getElementById('project-modal-body');
  if (!overlay || !dialog) return;

  const clientName = project.clientKey ? siteConfig.getClientName(project.clientKey) : '';

  dialog.innerHTML = `
    <div class="modal-header">
      <span class="featured-tag">${project.tag}</span>
      <h2 class="featured-title" style="margin-top:0.5rem;">${project.title}</h2>
      ${clientName ? `<p class="featured-client">Client : <strong>${clientName}</strong></p>` : ''}
      ${project.subtitle ? `<p class="project-subtitle">${project.subtitle}</p>` : ''}
    </div>

    <div class="featured-summary">
      <strong>Objectif :</strong> ${project.objective || project.summary}
    </div>

    <h4 style="margin: 1.5rem 0 0.75rem; font-size: 1.1rem; color: var(--text-main);">Stack technique &amp; Environnement</h4>
    <div class="tags-list">
      ${(project.stack || project.tags || []).map(t => `<span class="tag-badge primary">${t}</span>`).join('')}
    </div>

    <h4 style="margin: 1.5rem 0 0.75rem; font-size: 1.1rem; color: var(--text-main);">Réalisations clés</h4>
    <div class="featured-points">
      ${(project.highlights || []).map(h => typeof h === 'string'
        ? `<div class="featured-point-item"><span class="point-icon">✓</span><div>${h}</div></div>`
        : `<div class="featured-point-item"><span class="point-icon">✓</span><div><strong>${h.title} :</strong> ${h.desc}</div></div>`
      ).join('')}
    </div>

    ${project.id === 'agrana-supply-chain' ? `
      <div style="background:var(--border-subtle); border-left:3.5px solid var(--accent-primary); padding:1.15rem; border-radius:0 var(--radius-md) var(--radius-md) 0; margin:1.35rem 0;">
        <h5 style="margin:0 0 0.5rem; font-size:1rem; color:var(--text-main); font-weight:800;">🧩 Architecture relationnelle en étoile (Modèle Power BI synthétisé)</h5>
        <p style="font-size:0.86rem; color:var(--text-muted); line-height:1.55; margin-bottom:0.65rem;">
          Conformément aux meilleures pratiques de confidentialité en entreprise, la modélisation a été entièrement anonymisée tout en conservant une structure hautement rigoureuse :
        </p>
        <ul style="font-size:0.84rem; color:var(--text-main); padding-left:1.25rem; line-height:1.6; margin-bottom:0.5rem;">
          <li><strong>Dimensions unifiées (Filtrage) :</strong> <code>DIM_CUSTOMER</code>, <code>DIM_PRODUCT</code>, <code>DIM_CATEGORY</code>, <code>DIM_DATE</code>, <code>DIM_WAREHOUSE</code>, <code>DIM_SALES_REP</code></li>
          <li><strong>Tables de faits (Transactions &amp; Cibles) :</strong> <code>FACT_ORDER</code> (Commandes clients), <code>FACT_DELIVERY</code> (Livraisons réelles), <code>FACT_FORECAST</code> (Prévisions de vente)</li>
          <li><strong>Table de pont essentielle (<code>BRIDGE_ORDER_DELIVERY</code>) :</strong> Découplage de la relation N-N entre commandes et livraisons fractionnées, garantissant l'exactitude des calculs de retards et reliquats sans relation directe ambiguë.</li>
          <li><strong>Table centralisée des mesures (<code>MEASURES</code>) :</strong> Mesures DAX avancées pour le KPI OTIF (Strict), le taux de service et les alertes de commandes à risque.</li>
        </ul>
        <div style="font-size:0.78rem; color:var(--text-subtle); font-style:italic;">
          🔒 Note déontologique : Aucune donnée confidentielle ou table propriétaire n'est exposée publiquement.
        </div>
      </div>
    ` : ''}

    ${project.result ? `
      <div class="featured-result-box" style="margin-top:1.25rem;">
        <strong>Résultat &amp; Valeur ajoutée :</strong> ${project.result}
      </div>
    ` : ''}

    ${project.gallery && project.gallery.length > 0 ? `
      <h4 style="margin: 1.5rem 0 0.75rem; font-size: 1.1rem; color: var(--text-main);">Galerie &amp; Captures d'écran (${project.gallery.length})</h4>
      <div class="modal-gallery-grid">
        ${project.gallery.map((img, i) => `
          <div class="modal-gallery-thumb" role="button" tabindex="0" data-gallery-idx="${i}" aria-label="Agrandir l'image ${i + 1}">
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
          </div>
        `).join('')}
      </div>
      <p style="font-size:0.8rem; color:var(--text-subtle); margin-top:-0.5rem;">Tapez ou cliquez sur une capture pour l'ouvrir en plein écran.</p>
    ` : ''}

    <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-top:2rem; padding-top:1rem; border-top:1px solid var(--border-subtle);">
      ${project.githubOrg ? `
        <a href="${project.githubOrg}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <span>${project.id === 'avda-auto' ? 'GitHub Logiciel (AVDA Auto)' : 'Dépôt GitHub Organisation (AVDA)'}</span>
        </a>
      ` : ''}
      ${project.githubPersonal ? `
        <a href="${project.githubPersonal}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <span>GitHub Personnel</span>
        </a>
      ` : ''}
    </div>
  `;

  // Attach gallery clicks
  dialog.querySelectorAll('.modal-gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const idx = parseInt(thumb.getAttribute('data-gallery-idx'), 10);
      openLightbox(project.gallery, idx);
    });
  });

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const overlay = document.getElementById('project-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   4. LIGHTBOX PLEIN ÉCRAN AVEC GESTES TACTILES & CLAVIER
   -------------------------------------------------------------------------- */
function openLightbox(gallery, startIndex = 0) {
  if (!gallery || gallery.length === 0) return;
  state.activeGallery = gallery;
  state.currentLightboxIndex = startIndex;

  const overlay = document.getElementById('lightbox-overlay');
  if (!overlay) return;

  updateLightboxContent();
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function updateLightboxContent() {
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  const cur = state.activeGallery[state.currentLightboxIndex];
  if (!cur) return;

  imgEl.src = cur.src;
  imgEl.alt = cur.alt || 'Capture plein écran';
  captionEl.textContent = `${cur.caption || cur.alt} (${state.currentLightboxIndex + 1} / ${state.activeGallery.length})`;

  // Masquer les flèches si une seule image
  const single = state.activeGallery.length <= 1;
  if (prevBtn) prevBtn.style.display = single ? 'none' : 'flex';
  if (nextBtn) nextBtn.style.display = single ? 'none' : 'flex';
}

function prevLightbox() {
  if (state.activeGallery.length <= 1) return;
  state.currentLightboxIndex = (state.currentLightboxIndex - 1 + state.activeGallery.length) % state.activeGallery.length;
  updateLightboxContent();
}

function nextLightbox() {
  if (state.activeGallery.length <= 1) return;
  state.currentLightboxIndex = (state.currentLightboxIndex + 1) % state.activeGallery.length;
  updateLightboxContent();
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');

  // Si la modale projet n'est pas ouverte, rétablir le scroll du body
  const projectOverlay = document.getElementById('project-modal-overlay');
  if (!projectOverlay || !projectOverlay.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   5. MENU MOBILE HAMBURGER & INTERFACE
   -------------------------------------------------------------------------- */
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      menuBtn.innerHTML = !isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`;
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`;
      });
    });
  }

  // Modale Close Triggers
  const modalOverlay = document.getElementById('project-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProjectModal();
    });
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  // Lightbox Triggers
  const lbOverlay = document.getElementById('lightbox-overlay');
  const lbCloseBtn = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');

  if (lbOverlay) {
    lbOverlay.addEventListener('click', (e) => {
      if (e.target === lbOverlay) closeLightbox();
    });

    // Gestes tactiles swipe sur mobile
    lbOverlay.addEventListener('touchstart', (e) => {
      state.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lbOverlay.addEventListener('touchend', (e) => {
      state.touchEndX = e.changedTouches[0].screenX;
      handleLightboxSwipe();
    }, { passive: true });
  }

  if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', prevLightbox);
  if (lbNext) lbNext.addEventListener('click', nextLightbox);

  // Clavier global (Échap, Flèches)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lbOverlay && lbOverlay.classList.contains('open')) {
        closeLightbox();
      } else if (modalOverlay && modalOverlay.classList.contains('open')) {
        closeProjectModal();
      }
    } else if (lbOverlay && lbOverlay.classList.contains('open')) {
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    }
  });
}

function handleLightboxSwipe() {
  const diff = state.touchEndX - state.touchStartX;
  const threshold = 50; // seuil de swipe en px
  if (diff > threshold) {
    prevLightbox();
  } else if (diff < -threshold) {
    nextLightbox();
  }
}

/* --------------------------------------------------------------------------
   6. TOAST NOTIFICATIONS
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#6366F1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  // Animation show
  requestAnimationFrame(() => toast.classList.add('show'));

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* --------------------------------------------------------------------------
   7. INITIALISATION
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderPortfolio();
  initNavigation();
});
