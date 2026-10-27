/**
 * Données du Portfolio de Samy Houchat
 * Source de vérité : cv_samy_houchat_final.md
 * Aucune donnée inventée. Respect strict de la confidentialité et des faits réels.
 */

export const siteConfig = {
  // Interrupteur de confidentialité : anonymisation des clients industriels conformément aux recommandations
  showClientNames: false,

  profile: {
    name: "Samy Houchat",
    title: "Étudiant en science des données · Stage Data / BI",
    headline: "Chaque entreprise accumule des données, mais rares sont celles qui en tirent tout le potentiel : c'est là que j'interviens. Je transforme vos flux d'activité en tableaux de bord BI clairs pour piloter vos objectifs en temps réel, et j'applique la modélisation statistique pour anticiper vos tendances futures. Mon objectif ? Vous apporter de la clarté grâce à un stage opérationnel de 10 à 12 semaines dès avril 2027.",
    availabilityBadge: "Stage Data / BI · 10 à 12 semaines · dès avril 2027",
    location: "France, Luxembourg, Suisse, Canada, Allemagne",
    email: "samyhctpro@gmail.com",
    linkedin: "https://www.linkedin.com/in/samyhouchat",
    githubUser: "https://github.com/HouchatSamy?tab=repositories",
    githubOrg: "https://github.com/AVDAdz/avdaAuto",
    cvPdfPath: "assets/cv/CV_Samy_Houchat.pdf?v=6194d7030709",
    photoPath: "assets/img/photo.png"
  },

  keyStats: [
    {
      id: "reliable-data",
      badge: "Fiabiliser vos données",
      title: "Python & SQL",
      subtitle: "Collecter, nettoyer et structurer les données pour limiter les traitements manuels.",
      href: "#projets", action: "Voir le projet Data"
    },
    {
      id: "clear-decisions",
      badge: "Rendre les chiffres utiles",
      title: "Tableaux de bord Power BI",
      subtitle: "Suivre les commandes, comparer les prévisions et rendre les indicateurs lisibles.",
      href: "#projets", action: "Explorer les tableaux de bord"
    },
    {
      id: "real-experience",
      badge: "Passer de l'idée à l'outil",
      title: "Expérience Data en entreprise",
      subtitle: "Des missions Data et web menées en entreprise chez Layer Data, complétées par le développement d'AVDA Auto.",
      href: "#experience", action: "Découvrir mon expérience"
    },
    {
      id: "dba-foundation",
      badge: "Concevoir des bases solides",
      title: "Socle DBA (Administrateur BDD)",
      subtitle: "Modéliser des bases robustes, optimiser le SQL et garantir la qualité de la donnée à la source.",
      href: "#formation", action: "Découvrir mon socle DBA"
    }
  ],

  // Fonction helper pour adapter les noms des clients selon showClientNames
  getClientName(type) {
    if (this.showClientNames) {
      if (type === "agrana") return "AGRANA Fruit";
      if (type === "sogral") return "SOGRAL";
      if (type === "soummam") return "Laiterie Soummam";
    }
    if (type === "agrana") return "Client industriel agroalimentaire";
    if (type === "sogral") return "Société de gestion des gares routières";
    if (type === "soummam") return "Grand compte agroalimentaire laitier";
    return "";
  },

  featuredProject: {
    id: "agrana-supply-chain",
    tag: "Projet Vedette · Décisionnel & Supply Chain Analytics",
    title: "Power BI — Pilotage des commandes et des prévisions",
    subtitle: "De la préparation des données au suivi de l'activité",
    clientKey: "agrana",
    clientDetail: "Projet BI réalisé dans le secteur agroalimentaire",
    summary: "Un projet réalisé chez Layer Data pour un client industriel agroalimentaire : préparer les données avec Python, construire le modèle d'analyse et créer des tableaux de bord Power BI pour suivre les commandes, les livraisons et les écarts avec les prévisions.",
    confidentialityNote: "Projet réalisé dans un contexte professionnel. Les données, noms d'entités et structures présentés ici ont été entièrement synthétisés et anonymisés à des fins de portfolio.",
    objective: "Automatiser le flux de données de la source au reporting, suivre en temps réel la conformité des livraisons (OTIF), analyser les écarts Prévisions vs Commandes et sécuriser la satisfaction client.",
    tags: ["Power BI", "DAX Avancé", "Python (ETL)", "Data Warehouse", "Star Schema (MPD)", "KPI OTIF"],
    tools: [
      "Python (Pipelines ETL & nettoyage)",
      "Architecture Bronze & Gold",
      "Power BI & Power Query",
      "DAX Avancé (Mesures & KPIs)",
      "Schéma en étoile"
    ],
    highlights: [
      {
        title: "Preuve 1 — Dashboard Commandes (OTIF & Clients)",
        desc: "Suivi en temps réel du taux de service client OTIF (On-Time In-Full Strict), alertes sur commandes à risque, analyse des reliquats et segmentation par typologie de clients."
      },
      {
        title: "Preuve 2 — Dashboard Prévisions (Prévision vs Commande)",
        desc: "Comparatif dynamique entre prévisions commerciales et livraisons effectives, détection des tendances de consommation et recalibrage des besoins d'approvisionnement."
      },
      {
        title: "Preuve 3 — Modèle de données",
        desc: "Architecture relationnelle en étoile multi-faits reliant FACT_ORDER, FACT_DELIVERY et FACT_FORECAST et des dimensions unifiées (DIM_CUSTOMER, DIM_PRODUCT, DIM_DATE, DIM_WAREHOUSE), évitant toute relation ambiguë."
      },
      {
        title: "Ingestion & transformation ETL en Python",
        desc: "Automatisation du traitement des flux de données sources brutes (couche Bronze) vers l'entrepôt consolidé pour l'analyse décisionnelle (couche Gold)."
      }
    ],
    result: "Une chaîne de traitement automatisée et des indicateurs pour aider les équipes logistiques et commerciales à suivre leur activité.",
    image: "assets/img/bi-dashboard-commandes.png",
    gallery: [
      {
        id: "commandes",
        src: "assets/img/bi-dashboard-commandes.png",
        title: "Commandes",
        subtitle: "Suivi clients et livraisons",
        alt: "Dashboard Commandes — Suivi OTIF & Analyse Clients Power BI",
        caption: "Preuve 1 : Dashboard Commandes — Suivi du taux de service OTIF, alertes sur commandes à risque et analyse des volumes clients"
      },
      {
        id: "previsions",
        src: "assets/img/bi-dashboard-previsions.png",
        title: "Prévisions",
        subtitle: "Comparaison des volumes",
        alt: "Dashboard Prévisions — Analyse Prévisions vs Réalisé Power BI",
        caption: "Preuve 2 : Dashboard Prévisions — Comparatif Prévisions vs Réalisé, détection des reliquats et tendances"
      },
      {
        id: "modele",
        src: "assets/img/bi-modele-donnees.png",
        title: "Modèle de données",
        subtitle: "Structure des données",
        alt: "Architecture Modèle de Données Power BI",
        caption: "Preuve 3 : Architecture relationnelle Power BI — Modèle en étoile (DIM_CUSTOMER, DIM_PRODUCT, FACT_ORDER, FACT_DELIVERY)"
      }
    ],
    githubUrl: "https://github.com/HouchatSamy/POWERBI_files"
  },

  otherProjects: [
    {
      id: "powerbi-sales-supplychain",
      tag: "Projet Décisionnel · Supply Chain Analytics",
      title: "Power BI — Sales & Supply Chain Analytics",
      subtitle: "Pilotage de la performance commerciale et de l'efficacité logistique",
      summary: "Projet décisionnel complet sous Microsoft Power BI (cas NOVA COMMERCE) permettant de piloter simultanément la performance commerciale (13 M€ CA), l'analyse client et l'efficacité logistique Supply Chain via l'indicateur international OTIF (On-Time In-Full).",
      status: "Production / Portfolio",
      category: "Data & BI",
      period: "2026 – 2027",
      stack: ["Power BI Desktop", "DAX Avancé", "Power Query (ETL)", "Star Schema", "Supply Chain Analytics (OTIF)", "Time Intelligence", "What-If Simulation"],
      objective: "Piloter simultanément la performance commerciale (13 M€ CA), la rentabilité financière (marge brute 4 M€ / 30,3%), le suivi des objectifs et l'efficacité logistique Supply Chain (OTIF).",
      highlights: [
        "Architecture en étoile multi-faits : 3 tables de faits (Ventes, Livraisons, Objectifs commerciaux), 5 dimensions et paramètre What-If de sensibilité aux remises commerciales",
        "Mesures DAX avancées structurées en 7 Display Folders : CALCULATE, USERELATIONSHIP, Time Intelligence (YTD, SAMEPERIODLASTYEAR), ratios N vs N-1, rangs dynamiques et analyse ABC/Pareto",
        "Tableaux de bord d'aide à la décision : 3 vues interactives couvrant la Synthèse Direction (CA, marges, atteinte budgétaire), l'analyse Clients & Commandes (180 clients actifs) et le pilotage des Livraisons",
        "ETL & Qualité de service : pipeline Power Query (nettoyage, typage, fusion) et suivi rigoureux des taux OTIF (64,8%), On-Time (70%), In-Full (89,3%), Fill Rate (94,9%) et diagnostic des 2 530 retards"
      ],
      result: "Tableau de bord unifié d'aide à la décision permettant d'isoler les causes racines d'anomalies logistiques et d'optimiser le taux de service client tout en sécurisant la rentabilité.",
      thumbnail: "assets/img/bi-dashboard-commandes.png",
      gallery: [
        {
          src: "assets/img/bi-dashboard-commandes.png",
          alt: "Power BI Sales & Supply Chain Analytics — Tableau de bord OTIF",
          caption: "Tableau de bord de pilotage du taux de service OTIF, retards et anomalies de livraison"
        },
        {
          src: "assets/img/bi-dashboard-previsions.png",
          alt: "Power BI — Analyse des ventes et prévisions",
          caption: "Analyse comparative Ventes vs Objectifs et simulation What-If"
        },
        {
          src: "assets/img/bi-modele-donnees.png",
          alt: "Power BI — Modèle relationnel en constellation multi-faits",
          caption: "Architecture en étoile multi-faits (FactVentes, FactLivraisons, FactObjectifs et 5 dimensions)"
        }
      ],
      githubPersonal: "https://github.com/HouchatSamy/powerbi-sales-supplychain-analytics"
    },
    {
      id: "sae-series-temporelles",
      tag: "Projet Académique · Statistique & Séries Temporelles",
      title: "SAÉ — Analyse Statistique & Prévision de Séries Temporelles",
      subtitle: "Modélisation prédictive de la demande mensuelle et quantification d'incertitude",
      summary: "Étude statistique approfondie menée en 2e année de BUT Science des Données (parcours EMS) : modélisation de la demande mensuelle (2018–2025), comparaison d'approches prédictives (saisonnier naïf, régression harmonique de Fourier, Holt-Winters) et projection 2026 avec bandes d'incertitude empiriques.",
      status: "Académique / Validé",
      category: "Statistiques & Data Science",
      period: "2026 – 2027",
      stack: ["Python 3.12+", "R 4.3+ (RStudio)", "Séries Temporelles (STL)", "Holt-Winters Additif", "Régression Harmonique", "Tests d'Hypothèses", "Validation Croisée"],
      objective: "Anticiper la demande mensuelle à horizon 12 mois (exercice 2026) tout en fournissant une quantification rigoureuse de l'incertitude prédictive selon un protocole statistique causal strict (zéro fuite d'information future).",
      highlights: [
        "Audit qualité & Imputation causale : assainissement d'une chronique de 96 mois, traitement des doublons et imputation rétrospective (t-12) sanctuarisant le jeu de test final 2025",
        "Modélisation concurrentielle & Décomposition : décomposition STL robuste (Loess), lissage mobile 12 mois, lissage exponentiel Holt-Winters et régression harmonique paramétrique (Fourier à 2 harmoniques)",
        "Protocole de validation croisée Rolling-Origin : 3 fenêtres temporelles successives (2022-2024), sélection du modèle optimal (MAE 30.89, RMSE 36.37, sMAPE 2.27%, MASE 0.41 surpassant la référence de 61%)",
        "Inférence statistique & Diagnostic résiduel : tests ADF (racine unitaire), Wald (saisonnalité conjointe), Ljung-Box (indépendance résiduelle), Shapiro-Wilk et covariance robuste HAC Newey-West",
        "Quantification du risque & Reproductibilité : bandes d'incertitude empiriques à 80% et 95% validées sur échantillon test (couvertures 83.3% et 91.7%), pipeline Python testé (unittest) et script R autonome"
      ],
      result: "Modèle harmonique optimal validé sur le jeu de test 2025 (MAE 32.07, sMAPE 2.12%) et prévisions opérationnelles 2026 livrées avec intervalles de confiance calibrés et code source 100% reproductible.",
      thumbnail: "assets/img/sae/05_forecast.png",
      gallery: [
        {
          src: "assets/img/sae/05_forecast.png",
          alt: "Prévision de la demande mensuelle 2026 avec intervalles de confiance",
          caption: "Prévision opérationnelle 2026 et bandes d'incertitude empiriques à 80% et 95%"
        },
        {
          src: "assets/img/sae/02_decomposition.png",
          alt: "Décomposition STL de la série temporelle",
          caption: "Décomposition STL robuste isolant la tendance fondamentale, la saisonnalité et les résidus"
        },
        {
          src: "assets/img/sae/03_comparison.png",
          alt: "Comparaison des modèles prédictifs en validation croisée",
          caption: "Benchmark des modèles en rolling-origin : régression harmonique vs Holt-Winters vs référence"
        },
        {
          src: "assets/img/sae/04_test.png",
          alt: "Évaluation sur l'échantillon test 2025",
          caption: "Validation impartiale sur l'année de test 2025 sanctuarisée et taux de couverture des bandes"
        },
        {
          src: "assets/img/sae/06_diagnostics.png",
          alt: "Diagnostics statistiques des résidus",
          caption: "Diagnostics résiduels : autocorrélation Ljung-Box, normalité Shapiro-Wilk et matrice HAC"
        },
        {
          src: "assets/img/sae/01_overview.png",
          alt: "Vue d'ensemble de la série brute et nettoyée",
          caption: "Audit qualité et assainissement causal de la série chronologique 2018–2025"
        }
      ],
      githubPersonal: "https://github.com/HouchatSamy/-Analyse-statistique-pr-vision-de-s-ries-temporelles"
    },
    {
      id: "avda-auto",
      tag: "Application Desktop · Gestion Commerciale",
      title: "AVDA Auto — Gestion de Showroom Automobile",
      subtitle: "Logiciel offline-first pour concessionnaires et parcs automobiles",
      summary: "Application desktop complète conçue pour digitaliser et centraliser l'activité de concessionnaires (stock de véhicules, transactions, CRM, trésorerie et facturation).",
      status: "Production / Opérationnel",
      stack: ["Electron", "React 18", "SQLite", "Vite", "TypeScript/JS", "Vanilla CSS", "jsPDF", "XLSX"],
      objective: "Centraliser et digitaliser l'ensemble des opérations du showroom automobile sans aucune dépendance au cloud (gestion de stock, cycle commercial, CRM et trésorerie).",
      highlights: [
        "Gestion intégrale du parc automobile : suivi du stock en temps réel, statuts d'atelier, traçabilité des coûts et des marges bénéficiaires.",
        "Cycle commercial complet : achats, ventes, dépôts-ventes, échanges et véhicules d'importation.",
        "Module CRM & Finances : suivi des paiements, échéanciers, génération dynamique de devis, factures et bordereaux avec exports PDF et Excel.",
        "Localisation & Ergonomie : multilingue (Français, Arabe, Anglais avec support RTL), devises locales (DZD) et intégration administrative des 58 wilayas.",
        "Sécurité & Résilience offline : licence machine-bound, authentification multi-rôles et sauvegardes automatiques de la base SQLite."
      ],
      result: "Outil robuste et fluide permettant une maîtrise complète des marges et des stocks de véhicules sans latence réseau.",
      thumbnail: "assets/img/avda-1.jpg",
      gallery: [
        {
          src: "assets/img/avda-1.jpg",
          alt: "AVDA Auto - Interface principale et gestion du showroom",
          caption: "Module Showroom & Parc de véhicules en stock"
        },
        {
          src: "assets/img/avda-2.jpg",
          alt: "AVDA Auto - Gestion des fiches véhicules et contrôle technique",
          caption: "Détail véhicule, traçabilité et historique d'entretien"
        },
        {
          src: "assets/img/avda-3.jpg",
          alt: "AVDA Auto - Suivi financier, ventes et transactions",
          caption: "Module transactions commerciales, facturation et finances"
        }
      ],
      githubPersonal: "https://github.com/HouchatSamy?tab=repositories",
      githubOrg: "https://github.com/AVDAdz/avdaAuto"
    }
  ],

  skillCategories: [
    {
      name: "Data & Business Intelligence",
      icon: "chart-bar",
      skills: ["Power BI", "DAX Avancé", "Pipelines ETL", "Modélisation en Étoile", "KPIs & Reporting", "Data Warehouse"]
    },
    {
      name: "Bases de données & SGBD",
      icon: "database",
      skills: ["SQL", "DBeaver", "MySQL", "PostgreSQL", "SQLite", "Microsoft Access"]
    },
    {
      name: "Développement & Outils Data",
      icon: "code",
      skills: ["Python (Pandas, NumPy)", "R", "JavaScript (ES6+)", "React 18", "Electron", "HTML5 / CSS3", "PHP"]
    },
    {
      name: "Outils & Versioning",
      icon: "table",
      skills: ["Microsoft Excel (TCD)", "Power Query", "Git / GitHub", "VS Code", "Suite Office"]
    },
    {
      name: "Systèmes & Support Informatique",
      icon: "cpu",
      skills: ["Windows", "Linux", "Support & Maintenance"]
    }
  ],

  experiences: [
    {
      period: "24/02/2026 – 05/08/2026",
      role: "Analyste de données & BI",
      company: "Layer Data",
      companySubtitle: "when humans meet Data",
      location: "Akbou, Algérie",
      missions: [
        {
          title: "Mission Data & BI — Client : {agrana}",
          bullets: [
            "Pipeline ETL & Data Warehouse : scripts Python pour l'ingestion, le nettoyage et la transformation des données brutes vers l'architecture Data Warehouse (couches Bronze et Gold).",
            "Modélisation MPD dans Power BI : conception et implémentation du schéma relationnel en étoile reliant dimensions et tables de faits (relations 1-N).",
            "Rapport Supply Chain sous Power BI pour un client agroalimentaire : suivi des commandes, livraisons, prévisions de vente et reliquats.",
            "KPIs métiers clés : calcul et monitoring du taux de service OTIF (On-Time In-Full), analyse des commandes à risque et retards de livraison par client/produit.",
          ]
        },
        {
          title: "Mission Développement Web — Client : {sogral}",
          bullets: [
            "Conception et mise en ligne du module « Catalogue des Locaux Disponibles » pour la commercialisation des espaces commerciaux dans les gares routières nationales.",
            "Interface d'administration pour la mise à jour des offres par les gestionnaires de gares routières et fiches détaillées en temps réel.",
            "Maintenance corrective et évolutive du site web."
          ]
        }
      ]
    },
    {
      period: "01/09/2025 – 23/02/2026",
      role: "Technicien informatique & gérant",
      company: "Cyber Café Khatri Khelaf",
      location: "El Kseur, Algérie",
      missions: [
        {
          title: "Gestion opérationnelle & maintenance",
          bullets: [
            "Maintenance, assistance et dépannage informatique (postes de travail, OS et logiciels).",
            "Gestion administrative et financière : suivi des factures, états comptables et rapports sous Excel.",
            "Rédaction de documents professionnels et supports de présentation (Word, PowerPoint).",
            "Gestion de la relation client et coordination avec les fournisseurs."
          ]
        }
      ]
    }
  ],

  education: [
    {
      period: "09/2026 – En cours",
      degree: "BUT Science des données (Niveau 6 CEC)",
      field: "Parcours Exploration et Modélisation Statistique",
      institution: "IUT Clermont Auvergne, site d'Aurillac",
      location: "Aurillac, France",
      highlight: "Formation en statistiques, programmation, analyse et modélisation des données."
    },
    {
      period: "10/2022 – 01/2026",
      degree: "BTS Informatique, option Bases de données (Niveau 5 CEC)",
      field: "Major de promotion 🥇",
      institution: "Institut International de Management Béjaïa",
      location: "Béjaïa, Algérie",
      highlight: "Major de promotion avec spécialisation en conception de bases de données, SQL et développement d'applications."
    },
    {
      period: "2021",
      degree: "Baccalauréat, spécialité Mathématiques (Niveau 4 CEC)",
      field: "Série Scientifique / Mathématiques",
      institution: "Lycée de Béjaïa",
      location: "Béjaïa, Algérie",
      highlight: "Bases solides en mathématiques, logique et raisonnement quantitatif."
    }
  ],

  languages: [
    { name: "Français", level: "Langue maternelle", flag: "🇫🇷" },
    { name: "Arabe", level: "Langue maternelle", flag: "🇩🇿" },
    { name: "Anglais", level: "Niveau B2 (Compréhension & expression fluide)", flag: "🇬🇧" }
  ],

  internshipSearch: {
    duration: "10 à 12 semaines",
    startDate: "Avril 2027",
    domain: "Analyse de données & Business Intelligence (Power BI, SQL, Python)",
    locationScope: "Aurillac / Mobilité : France, Luxembourg, Suisse, Canada, Allemagne (Titulaire du Permis B)",
    callToAction: "Disponible pour échanger sur vos projets data et convenir d'un entretien."
  }
};
