# Référencement du portfolio — octobre 2026

Le site doit permettre d'identifier clairement **Samy Houchat / Houchat Samy**,
étudiant en Science des données, et de découvrir ses projets Data et Business
Intelligence. Le référencement concerne Google, Bing et les autres moteurs ;
la lisibilité pour les assistants IA est souvent appelée GEO. Aucun classement,
extrait enrichi ou citation par une IA ne peut être garanti.

## Modifications mises en place

- URL de référence unique : `https://hctsamyuct.github.io/`.
- Métadonnées propres au portfolio et au CV, images de partage PNG/JPEG avec
  URL absolue, identité JSON-LD `Person`, `WebSite` et `ProfilePage` / `WebPage`.
- Projets, compétences, expérience et formation directement dans le HTML,
  générés avec les mêmes fonctions que le rendu interactif.
- Section de contact accessible et lien vers le CV HTML.
- Images auparavant dupliquées en base64 remplacées par les fichiers existants.
- QR codes des pages web régénérés vers le domaine officiel, à la place de
  l'ancienne adresse de portfolio.
- Versions française `/` et anglaise `/en/` avec canoniques propres et liens
  `hreflang` réciproques. Sitemap des trois pages indexables (FR, EN, CV) ; erreur
  404 exclue de l'indexation.
- Consignes `AGENTS.md` et vérification automatique sur chaque push et PR.

`robots.txt` permet l'exploration publique. Cela autorise les robots qui respectent
ce fichier ; cela ne prouve pas qu'ils ont exploré ou indexé le site. Un fichier
spécial pour l'IA ou une multiplication des mots-clés n'est pas nécessaire pour
rendre ces pages compréhensibles.

## Publier et déclarer le site aux moteurs

Ces opérations nécessitent le compte propriétaire. Ne jamais communiquer ses
mots de passe ou clés privées dans un chat.

1. Publier les modifications sur la branche utilisée par GitHub Pages. Vérifier
   dans Settings → Pages que la source est `main` et `/(root)` si le site utilise
   le déploiement depuis une branche. Le workflow SEO est un contrôle, pas un
   déploiement GitHub Pages.
2. Vérifier en production : accueil et CV HTTP 200, URL inexistante HTTP 404,
   `robots.txt`, `sitemap.xml`, canonique et disponibilité des images de partage.
3. Ouvrir [Google Search Console](https://search.google.com/search-console).
   Ajouter une propriété **Préfixe de l'URL** `https://hctsamyuct.github.io/`.
   La propriété Domaine demanderait un accès DNS que GitHub Pages ne fournit
   pas pour le domaine `github.io`.
4. Vérifier la propriété avec le fichier HTML ou la balise fournis par Google.
   Ajouter uniquement le fichier ou la balise réellement attribués à ce site,
   puis publier. Ces jetons de vérification sont publics ; ils ne sont pas des
   mots de passe et ne doivent pas être inventés. Ne pas les supprimer ensuite.
5. Dans Sitemaps, soumettre `sitemap.xml`. Inspecter les URL de l'accueil et du CV,
   lancer le test de l'URL publiée et demander leur indexation si disponible.
6. Ouvrir [Bing Webmaster Tools](https://www.bing.com/webmasters/). Importer la
   propriété Search Console si proposé, ou vérifier le site avec les instructions
   de Bing, puis soumettre le même sitemap. Bing peut aussi alimenter des services
   partenaires ; cela ne constitue pas une soumission universelle à tous les outils.

Les anciens endpoints « ping sitemap » et l'API Google Indexing pour un portfolio
ne remplacent pas cette procédure. L'API Google Indexing est réservée aux types
de contenus qu'elle prend officiellement en charge. IndexNow peut être étudié
ultérieurement avec une vraie clé de propriété et un site déjà publié ; ne pas
ajouter un endpoint non fonctionnel ou une clé fictive.

## Renforcer et suivre la visibilité

Mettre le lien du portfolio dans les profils LinkedIn et GitHub personnels et
garder la même orthographe du nom. Les liens depuis des profils et publications
réels aident la découverte ; éviter l'achat de liens et les annuaires automatisés.
Les projets doivent décrire des réalisations vérifiables, sans divulguer de données
professionnelles confidentielles.

Dans Search Console, suivre les pages indexées, les erreurs d'exploration et les
impressions/clics pour « Samy Houchat » et « Houchat Samy ». Utiliser les rapports
Core Web Vitals quand des données réelles sont disponibles. Une recherche manuelle
varie selon le pays, la personnalisation et la date ; elle ne suffit pas à mesurer
le classement. L'indexation et l'évolution des positions peuvent prendre du temps.

## Modifier le site sans régression

Depuis la racine du dépôt :

```sh
node scripts/render-seo.mjs
node scripts/build-en.mjs
node scripts/render-seo.mjs --check
node scripts/build-en.mjs --check
python3 scripts/check_seo.py
```

Les deux premières commandes mettent à jour les blocs statiques de `index.html`
et la page anglaise `en/index.html`. Mettre à jour les traductions explicites dans
`data/en-translations.json` lorsque les textes évoluent. Les autres commandes
contrôlent leur cohérence et le référencement technique. Aucune dépendance npm
ou Python supplémentaire n'est requise. Après un changement de contenu, mettre
à jour seulement le `lastmod` correspondant dans le sitemap. Vérifier également
les interactions modifiées dans un navigateur et le rendu sans JavaScript.

`python3 scripts/check_browser.py` vérifie les deux langues, les liens entre
versions, les contenus sans JavaScript, les onglets des trois captures et les
interactions à 320, 390, 768, 1024 et 1440 px. Ce contrôle optionnel en local,
exécuté systématiquement en CI, utilise Playwright 1.62.0 et Chromium. Il ne
mesure pas les Core Web Vitals en production. Le CV téléchargeable reste français.

En cas de changement de domaine, régénérer aussi les QR codes web avec
`scripts/update_qr.py` (dépendance optionnelle `qrcode==8.2`), et vérifier les
éventuels QR codes déjà présents dans le PDF et les CV imprimés. Le PDF existant
n'est pas régénéré par ce script.

## Sources officielles à consulter

- [Guide SEO Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Fonctionnalités IA de Google Search](https://developers.google.com/search/docs/appearance/ai-features)
- [Données structurées ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Créer et soumettre un sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Recommandations Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)

Lors de cette intervention, l'accès réseau aux sites Google, Bing et au portfolio
public a renvoyé un refus du proxy de l'environnement. La consultation en direct
des recommandations d'octobre 2026 et la vérification du site publié restent donc
à effectuer. Les contrôles locaux ne prouvent ni publication ni indexation.
