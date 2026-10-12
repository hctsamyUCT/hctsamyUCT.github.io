# Consignes durables — portfolio de Samy Houchat

Toute modification doit préserver le référencement naturel et la lisibilité pour
les moteurs de recherche et les assistants IA (GEO). Ces règles s'appliquent au
HTML réellement publié sur GitHub Pages, pas seulement à un aperçu JavaScript.

- Domaine de référence : `https://hctsamyuct.github.io/`. Employer cette origine
  dans les URL canoniques, le sitemap, les données structurées et le partage social.
- Identité : **Samy Houchat**, prénom Samy, nom Houchat. L'ordre **Houchat Samy**
  est un nom alternatif. Ne pas inventer de variantes phonétiques, d'expérience,
  de diplômes, de témoignages ou de résultats chiffrés pour cibler des recherches.
- Chaque page indexable doit avoir un titre et une description distincts, une
  canonique absolue, une langue correcte et des métadonnées de partage cohérentes.
  La page d'erreur reste `noindex, follow` et doit renvoyer HTTP 404 en production.
- Le texte utile, les projets, les compétences, les liens et les contacts doivent
  être présents dans le HTML initial, même sans JavaScript. Conserver les
  fonctionnalités interactives comme amélioration progressive. Les marqueurs
  `seo:*` sont alimentés par les vrais renderers du script `portfolio-script`.
  Après modification des données ou des renderers, exécuter
  `node scripts/render-seo.mjs`, puis `node scripts/build-en.mjs`, et inclure
  les deux pages HTML régénérées dans la modification.
- Le portfolio existe en français à `/` et en anglais à `/en/`. Conserver le
  sélecteur FR / EN, les canoniques propres à chaque page, les liens `hreflang`
  réciproques et les deux URL dans le sitemap. Ne pas rediriger automatiquement
  les visiteurs selon leur navigateur. Mettre à jour `data/en-translations.json`
  dès qu'un texte français évolue ; ne pas éditer `en/index.html` directement.
  Le CV et son PDF restent en français, avec des liens explicitement étiquetés
  sur la version anglaise. Ne pas traduire approximativement un diplôme en un
  diplôme étranger différent, ni présenter une formation en cours comme terminée.
- Le script intégré à `index.html` est celui actuellement exécuté par le site.
  Les fichiers `data/projects.js` et `js/main.js` sont des sources modulaires
  historiques ; les modifier seuls ne modifie pas le portfolio publié.
- Le CV a une seule source de contenu : `templates/cv.html`. Modifier ce fichier,
  puis exécuter `node scripts/build-cv.mjs` pour synchroniser le CV web et la
  fenêtre intégrée. Les styles sont dans `css/cv.css`, limités au CV. Conserver
  une lecture sur une colonne, deux encres (noir et bleu de titres) sur papier
  blanc, le texte sélectionnable et des mots-clés en gras. La formation précède
  l'expérience et les compétences techniques. Ne pas réintroduire les étoiles,
  couleurs de badges, listes de qualités génériques ou clients non anonymisés.
- Après toute modification du contenu, des styles ou des métadonnées du CV,
  régénérer le PDF avec `python3 scripts/generate-cv.py` (Playwright 1.62.0,
  Chromium et pypdf 6.10.0). Inclure le PDF et son manifeste de construction dans
  le commit. Exécuter `python3 scripts/check_cv.py` : une page A4 sans texte coupé,
  ordre d'extraction, mots-clés, coordonnées, liens et cohérence web/PDF. Ne pas
  réduire les caractères à l'excès ni masquer un débordement pour tenir sur une
  page. Les tests d'extraction ne prouvent pas une compatibilité avec tous les ATS.
- Conserver un titre H1 principal par page, des sections explicites, des liens
  descriptifs réellement explorables et des textes alternatifs utiles. Ne pas
  masquer du texte ni répéter artificiellement des mots-clés.
- Les données JSON-LD doivent décrire le contenu visible et rester cohérentes
  entre le portfolio et le CV. Ne pas exposer de clients anonymisés dans le HTML,
  les données structurées, les images de partage ou les fichiers destinés aux IA.
- Préserver les performances mobiles : images externes réutilisables plutôt que
  dupliquées en base64, dimensions explicites, chargement différé hors écran et
  priorité au portrait principal. Mesurer avant d'ajouter des bibliothèques ou
  des scripts tiers. Ne pas inventer de résultats Core Web Vitals.
- Maintenir `robots.txt` et `sitemap.xml`. Le sitemap contient seulement des URL
  canoniques publiques indexables. Modifier `lastmod` uniquement lors d'un vrai
  changement de contenu de la page concernée, avec la date réelle de ce changement.
- Avant livraison : `node scripts/build-cv.mjs --check`, `node scripts/render-seo.mjs --check`,
  `node scripts/build-en.mjs --check`, `python3 scripts/check_seo.py`, puis
  `python3 scripts/check_browser.py` (Playwright 1.62.0 et Chromium nécessaires).
  Vérifier les onglets des captures à 320–1440 px : aucun texte tronqué, les trois
  boutons restent dans leur colonne, sélection souris et clavier fonctionnelle.
  Conserver l'isolation des styles du CV dans `.cv-overlay-backdrop`, pour éviter
  qu'ils modifient les titres ou les couleurs du portfolio. Le thème sombre doit
  garder un fond anthracite neutre et des textes secondaires lisibles. Le contrôle
  navigateur mesure le contraste des textes et boutons sur leurs fonds composés
  dans les deux thèmes : ratio minimal 4,5:1 pour les éléments contrôlés. Ce test
  ne couvre pas les textes dans les captures d'écran ou sur des images/gradients.
  Séparer la couleur des accents textuels de celle des boutons à texte blanc.
  Le workflow CI SEO
  doit passer. Ne pas contourner les contrôles pour
  faire passer une modification qui casse le référencement.
- Les bonnes pratiques évoluent : consulter les recommandations officielles
  Google Search Central et Bing pour toute nouvelle technique. Ne pas présenter
  une astuce comme une « règle SEO 2026 » universelle. Les balises keywords, un
  fichier llms.txt et des données structurées ne garantissent aucun classement.
- Ne jamais inventer de jeton de vérification Search Console, Bing ou IndexNow.
  Ne pas intégrer de suivi sans demande explicite. Distinguer préparation locale,
  publication, soumission du sitemap et indexation constatée.

Voir [docs/SEO.md](docs/SEO.md) pour la procédure d'indexation et de suivi.
