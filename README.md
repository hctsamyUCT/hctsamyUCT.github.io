# 🚀 Portfolio de Samy Houchat — Data & Business Intelligence

Ce dossier contient l'ensemble des fichiers prêts pour le déploiement sur **GitHub Pages**.

🔗 **URL en ligne visée :** [https://hctsamyuct.github.io/](https://hctsamyuct.github.io/)

---

## 📁 Contenu du dossier

| Fichier / Dossier | Description |
| :--- | :--- |
| `index.html` | Page d'accueil complète (Portfolio interactif + CV modal intégré) |
| `cv_samy_houchat.html` | CV web responsive et imprimable format A4 (compatible ATS) |
| `assets/img/` | Toutes les captures, schémas, maquettes et logos |
| `assets/cv/` | CV au format PDF téléchargeable (`CV_Samy_Houchat.pdf`) |
| `css/`, `js/`, `data/` | Code source modulaire |
| `404.html` | Page d'erreur personnalisée |
| `.nojekyll` | Fichier indiquant à GitHub Pages de servir les assets sans traitement Jekyll |
| `robots.txt` & `sitemap.xml` | Référencement naturel (SEO) et indexation Google |

---

## 🌐 Comment mettre en ligne sur GitHub Pages ?

### Méthode 1 : En glisser-déposer (sans ligne de commande)
1. Allez sur votre dépôt GitHub : `https://github.com/hctsamyUCT/hctsamyUCT.github.io`
2. Glissez-déposez l'ensemble des fichiers de ce dossier dans le dépôt.
3. Cliquez sur **Commit changes**.
4. Allez dans **Settings** > **Pages** > Vérifiez que la branche est bien `main` et le dossier `/(root)`.
5. Votre site sera disponible en 1 à 2 minutes sur **https://hctsamyuct.github.io/** !

### Méthode 2 : En ligne de commande (Git)
```bash
git init
git add .
git commit -m "Mise en ligne portfolio Samy Houchat"
git branch -M main
git remote add origin https://github.com/hctsamyUCT/hctsamyUCT.github.io.git
git push -u origin main --force
```
