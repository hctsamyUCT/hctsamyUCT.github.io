# Présentation et outils de contrôle — 10 novembre 2026

Le premier écran présente une candidature à un stage Data / BI, avec un démarrage
en avril 2027 et une durée de 10 à 12 semaines. Les quatre contributions décrivent
des missions et leur utilité pour une équipe ; les outils apparaissent ensuite,
avec des liens vers les réalisations ou la formation correspondantes.

La finition conserve le portrait, le graphique interactif et les captures de vrais
projets. La hiérarchie du texte, la taille des descriptions et les espacements ont
été revus. Les textes français et anglais sont présents sans JavaScript.

## Références téléchargées

Les dépôts sont clonés dans `D:\Hub\portfolio-review-tools`, en dehors du dossier
publié sur GitHub Pages. Ils servent de références et d’outils de développement ;
aucun de leurs scripts n’est ajouté au chargement du portfolio.

| Référence | Version consultée | Usage |
| --- | --- | --- |
| [Unslop](https://github.com/heydamir/unslop) | `97daa3eb365670ea3f87ed85356cbfcee18105a5` | Principes de hiérarchie, de sobriété et de rédaction adaptés à cette finition. Créé par Damir Sokolovsky, licence [CC BY 4.0](https://github.com/heydamir/unslop/blob/main/LICENSE). |
| [axe-core](https://github.com/dequelabs/axe-core) | Clone `c50bf8e8933eba8cdb7a0d8e744a6c0ec691cdd6` ; moteur npm officiel `4.14.0` | Audit automatisé d’accessibilité avec Playwright, licence [MPL 2.0](https://github.com/dequelabs/axe-core/blob/develop/LICENSE). |

Le moteur axe est extrait d’un paquet npm distinct du clone de référence, sans
installation de dépendances ni exécution de scripts d’installation. Le contrôle
local couvre les versions FR/EN, les thèmes clair/sombre et les largeurs 390 et
1440 px, sur les règles WCAG 2 et 2.1 A/AA. Le rapport JSON et le script ponctuel
restent dans le dossier d’outillage. Les éléments qu’axe ne sait pas évaluer
automatiquement restent signalés comme incomplets dans ce rapport.

## Contrôles du dépôt

```sh
node scripts/build-cv.mjs --check
node scripts/render-seo.mjs --check
node scripts/build-en.mjs --check
python3 scripts/check_seo.py
python3 scripts/check_browser.py
python3 scripts/check_cv.py
```

Ces contrôles vérifient notamment le contenu HTML initial, les métadonnées FR/EN,
les interactions, les contrastes contrôlés et les mises en page de 320 à 1440 px.
Ils ne prouvent ni une publication sur GitHub Pages ni une indexation constatée.
La procédure de publication et de suivi reste dans [SEO.md](SEO.md).
