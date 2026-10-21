# CV pour la recherche de stage

Le CV vise un stage en Science des Données (Data, Statistiques & BI) de **10 semaines à
partir du 1er avril 2027**, avec mobilité France entière. Les compétences et dates
proviennent du parcours déjà décrit dans le dépôt ; aucun diplôme terminé,
résultat chiffré ou outil utilisé en mission n'a été ajouté sans source.

## Choix éditoriaux

- Noir pour le texte, bleu `#1e40af` pour les titres, sur papier blanc. La photo
  et le QR code du portfolio sont conservés à la demande du propriétaire. Le logo
  Layer Data est affiché en noir et blanc auprès du nom de l'entreprise. Aucun
  badge jaune ni étoile. La limite de couleurs concerne les encres du texte,
  pas les couleurs naturelles du portrait. Le logo utilise le noir et le blanc
  pour ne pas ajouter une troisième couleur à la mise en page.
- Mots-clés en gras : Power BI, Python, R, SQL, ETL, expérience chez Layer Data,
  projet AVDA Auto et major de promotion.
- Formation remontée pour situer la formation actuelle ; compétences techniques
  regroupées après les missions et le projet.
- Dates placées avant les intitulés des diplômes, postes et projet. Dans chaque
  expérience, une seconde ligne présente l'entreprise à gauche et le lieu à
  droite ; le petit logo Layer Data est placé à côté du nom de l'entreprise.
- L'option Bases de données figure directement dans le titre du BTS ; le parcours
  Exploration et Modélisation Statistique du BUT SD est mis en gras avec la mention
  explicite de formation actuellement en cours.
- En-tête inspiré de la présentation initiale : photo encadrée à gauche, identité
  et stage au centre, QR code à droite. Coordonnées avec pictogrammes monochromes
  en deux colonnes, sans longues lignes de liens. Filet bleu sous l'en-tête et
  repères verticaux bleus pour les rubriques ; le contenu garde une lecture linéaire.
- « Compétences & qualités », « Pourquoi me choisir ? » et centres d'intérêt
  retirés pour privilégier les réalisations. L'en-tête affiche « 25 ans » et
  « Permis B · Non véhiculé » à la demande du propriétaire. Le QR code cliquable
  remplace l'adresse écrite du portfolio.
- Clients anonymisés comme dans le portfolio. Les missions restent décrites sans
  les passages dont le retrait a déjà été demandé. Le rapport Supply Chain sous
  Power BI est présenté comme réalisé pour un client agroalimentaire.
- R a été confirmé comme utilisé en exercices ou projets. Pandas et NumPy sont
  conservés avec Python ; dplyr et ggplot2 restent des recommandations à explorer,
  sans être présentés comme des bibliothèques déjà maîtrisées.

## Lecture par un ATS : ce qui est vérifié

Une colonne permet un ordre de lecture direct. Les rubriques utilisent des
intitulés classiques. Les coordonnées restent du texte ; le lien du portfolio
est porté par le QR code et son libellé. Le PDF contient du texte sélectionnable, des polices avec correspondance
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

1. Modifier `templates/cv.html`, `templates/cv-en.html` et/ou `css/cv.css`.
2. Exécuter `node scripts/build-cv.mjs`, `node scripts/render-seo.mjs`, puis
   `node scripts/build-en.mjs`.
3. Installer au besoin `playwright==1.62.0` et `pypdf==6.10.0`, ainsi que Chromium
   avec `python3 -m playwright install chromium`.
4. Exécuter `python3 scripts/generate-cv.py`, puis `python3 scripts/check_cv.py`.
5. Inclure les PDFs générés (FR et EN) et `assets/cv/CV_Samy_Houchat.build.json` dans la modification.

La génération ne coupe jamais le texte pour respecter une page : elle échoue si
le contenu déborde. Le manifeste permet de détecter des PDFs qui n'ont pas été mis
à jour après une modification de leurs sources. La CI contrôle le CV web (FR et EN),
les PDFs distribués et l'impression de la fenêtre intégrée au portfolio.

L'impression A4 à 100 % est également testée à deux largeurs de navigateur,
avec les réglages par défaut, des marges de 15 et 20 mm et des en-têtes/pieds de
page du navigateur. Le bouton « Télécharger le PDF — 1 page A4 » fournit le fichier
déjà vérifié, sans dépendre des réglages d'impression de l'utilisateur. Les URLs
du CSS et du PDF portent une version liée aux sources pour limiter les caches
contenant une ancienne présentation.
