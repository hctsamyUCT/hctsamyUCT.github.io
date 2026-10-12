# CV pour la recherche de stage

Le CV vise un stage Data Analyst / Business Intelligence de **10 semaines à
partir du 1er avril 2027**, avec mobilité France entière. Les compétences et dates
proviennent du parcours déjà décrit dans le dépôt ; aucun diplôme terminé,
résultat chiffré ou outil utilisé en mission n'a été ajouté sans source.

## Choix éditoriaux

- Noir pour le texte, bleu `#1e40af` pour les titres, sur papier blanc. La photo
  et le QR code du portfolio sont conservés à la demande du propriétaire. Aucun
  badge jaune ni étoile. La limite de couleurs concerne les encres du texte,
  pas les couleurs naturelles du portrait.
- Mots-clés en gras : Power BI, Python, SQL, ETL, expérience chez Layer Data,
  projet AVDA Auto et major de promotion.
- Formation remontée pour situer la formation actuelle ; compétences techniques
  regroupées après les missions et le projet.
- L'option Bases de données figure directement dans le titre du BTS ; le parcours
  Exploration et Modélisation Statistique du BUT SD est mis en gras avec la mention
  explicite de formation actuellement en cours.
- « Compétences & qualités », « Pourquoi me choisir ? » et centres d'intérêt
  retirés pour privilégier les réalisations. Âge et statut de véhicule retirés
  de l'en-tête ; ville, mobilité et permis sont conservés.
- Clients anonymisés comme dans le portfolio. Les missions restent décrites sans
  les passages dont le retrait a déjà été demandé.

## Lecture par un ATS : ce qui est vérifié

Une colonne permet un ordre de lecture direct. Les rubriques utilisent des
intitulés classiques. Les coordonnées et l'URL du portfolio restent du texte,
en complément de la photo et du QR code. Le PDF contient du texte sélectionnable, des polices avec correspondance
Unicode, des balises de structure et des liens cliquables ; il n'est pas une image.

Les contrôles portent sur : une page A4 sans troncature, contenu extrait complet
et dans le bon ordre, coordonnées, disponibilité, diplômes, employeur, compétences,
langues et liens. La taille des caractères va de 9 points pour les coordonnées
à 10 points pour le corps, avec des titres plus grands.

Le texte a été extrait avec pypdf et pdftotext et comparé au CV affiché. Ces
contrôles ne permettent pas de promettre une compatibilité à 100 % avec tous les
logiciels de recrutement. Pour une candidature, employer le format demandé dans
l'annonce et adapter les mots-clés aux compétences réellement détenues.

## Maintenir les versions

1. Modifier `templates/cv.html` et/ou `css/cv.css`.
2. Exécuter `node scripts/build-cv.mjs`, `node scripts/render-seo.mjs`, puis
   `node scripts/build-en.mjs`.
3. Installer au besoin `playwright==1.62.0` et `pypdf==6.10.0`, ainsi que Chromium
   avec `python3 -m playwright install chromium`.
4. Exécuter `python3 scripts/generate-cv.py`, puis `python3 scripts/check_cv.py`.
5. Inclure le PDF et `assets/cv/CV_Samy_Houchat.build.json` dans la modification.

La génération ne coupe jamais le texte pour respecter une page : elle échoue si
le contenu déborde. Le manifeste permet de détecter un PDF qui n'a pas été mis
à jour après une modification de ses sources. La CI contrôle le CV web, le PDF
distribué et une impression de la fenêtre intégrée au portfolio.
