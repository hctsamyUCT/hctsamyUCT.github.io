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
  `node scripts/render-seo.mjs` et inclure le HTML régénéré dans la modification.
- Le script intégré à `index.html` est celui actuellement exécuté par le site.
  Les fichiers `data/projects.js` et `js/main.js` sont des sources modulaires
  historiques ; les modifier seuls ne modifie pas le portfolio publié.
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
- Avant livraison : `node scripts/render-seo.mjs --check`,
  `python3 scripts/check_seo.py`, puis un contrôle du rendu et des interactions
  touchées. Le workflow CI SEO doit passer. Ne pas contourner les contrôles pour
  faire passer une modification qui casse le référencement.
- Les bonnes pratiques évoluent : consulter les recommandations officielles
  Google Search Central et Bing pour toute nouvelle technique. Ne pas présenter
  une astuce comme une « règle SEO 2026 » universelle. Les balises keywords, un
  fichier llms.txt et des données structurées ne garantissent aucun classement.
- Ne jamais inventer de jeton de vérification Search Console, Bing ou IndexNow.
  Ne pas intégrer de suivi sans demande explicite. Distinguer préparation locale,
  publication, soumission du sitemap et indexation constatée.

Voir [docs/SEO.md](docs/SEO.md) pour la procédure d'indexation et de suivi.
