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
    title: "Étudiant en BUT Science des données · Data & BI",
    headline: "Rigoureux et passionné par la valorisation de la donnée, je conçois des pipelines ETL fiables, des modèles relationnels solides et des tableaux de bord Power BI d'aide à la décision.",
    availabilityBadge: "Disponible pour un stage de 10 semaines à partir du 1er avril 2027",
    location: "Tout le territoire français",
    email: "samyhctpro@gmail.com",
    linkedin: "https://www.linkedin.com/in/samyhouchat",
    githubUser: "https://github.com/HouchatSamy?tab=repositories",
    githubOrg: "https://github.com/AVDAdz/avdaAuto",
    cvPdfPath: "assets/cv/CV_Samy_Houchat.pdf",
    photoPath: "assets/img/photo.png"
  },

  keyStats: [
    {
      id: "major",
      badge: "Major de Promotion",
      title: "BTS Informatique",
      subtitle: "Option Bases de données (IIM Béjaïa)",
      icon: "trophy"
    },
    {
      id: "exp",
      badge: "Expérience terrain",
      title: "Layer Data",
      subtitle: "Analyste de données & dev web",
      icon: "briefcase"
    },
    {
      id: "etl",
      badge: "Cycle Data complet",
      title: "ETL & Modélisation",
      subtitle: "Python, Star Schema & Power BI",
      icon: "database"
    },
    {
      id: "lang",
      badge: "Profil trilingue",
      title: "Anglais B2",
      subtitle: "Français & Arabe maternels",
      icon: "languages"
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
    title: "Business Intelligence Dashboard — Supply Chain Analytics",
    subtitle: "Architecture décisionnelle end-to-end pour l'industrie agroalimentaire",
    clientKey: "agrana",
    clientDetail: "Projet BI réalisé dans le secteur agroalimentaire",
    summary: "Conception d'une chaîne décisionnelle complète pour le pilotage de la logistique industrielle et commerciale : automatisation des flux via des pipelines ETL Python, modélisation relationnelle en schéma en étoile avec table de pont, et tableaux de bord Power BI interactifs axés sur le taux de service client (OTIF).",
    confidentialityNote: "Projet réalisé dans un contexte professionnel. Les données, noms d'entités et structures présentés ici ont été entièrement synthétisés et anonymisés à des fins de portfolio.",
    objective: "Automatiser le flux de données de la source au reporting, suivre en temps réel la conformité des livraisons (OTIF), analyser les écarts Prévisions vs Commandes et sécuriser la satisfaction client.",
    tags: ["Power BI", "DAX Avancé", "Python (ETL)", "Data Warehouse", "Star Schema (MPD)", "Table de Pont (Bridge)", "KPI OTIF"],
    tools: [
      "Python (Pipelines ETL & nettoyage)",
      "Architecture Bronze & Gold",
      "Power BI & Power Query",
      "DAX Avancé (Mesures & KPIs)",
      "Schéma en étoile & Table de pont (BRIDGE_ORDER_DELIVERY)"
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
        title: "Preuve 3 — Modèle de données & Table de pont BRIDGE",
        desc: "Architecture relationnelle en étoile multi-faits reliant FACT_ORDER, FACT_DELIVERY et FACT_FORECAST via une table de pont BRIDGE_ORDER_DELIVERY et des dimensions unifiées (DIM_CUSTOMER, DIM_PRODUCT, DIM_DATE, DIM_WAREHOUSE), évitant toute relation ambiguë."
      },
      {
        title: "Ingestion & transformation ETL en Python",
        desc: "Automatisation du traitement des flux de données sources brutes (couche Bronze) vers l'entrepôt consolidé pour l'analyse décisionnelle (couche Gold)."
      }
    ],
    result: "Chaîne de traitement 100% automatisée et fiable, visibilité exhaustive sur les performances de livraison et aide à la décision opérationnelle pour les équipes logistiques et commerciales.",
    image: "assets/img/bi-dashboard-commandes.png",
    gallery: [
      {
        id: "commandes",
        src: "assets/img/bi-dashboard-commandes.png",
        title: "1. Dashboard Commandes",
        subtitle: "KPIs OTIF, alertes & analyse clients",
        alt: "Dashboard Commandes — Suivi OTIF & Analyse Clients Power BI",
        caption: "Preuve 1 : Dashboard Commandes — Suivi du taux de service OTIF, alertes sur commandes à risque et analyse des volumes clients"
      },
      {
        id: "previsions",
        src: "assets/img/bi-dashboard-previsions.png",
        title: "2. Dashboard Prévisions",
        subtitle: "Prévision vs Commande & reliquats",
        alt: "Dashboard Prévisions — Analyse Prévisions vs Réalisé Power BI",
        caption: "Preuve 2 : Dashboard Prévisions — Comparatif Prévisions vs Réalisé, détection des reliquats et tendances"
      },
      {
        id: "modele",
        src: "assets/img/bi-modele-donnees.png",
        title: "3. Modèle de Données",
        subtitle: "Schéma en étoile & table de pont",
        alt: "Architecture Modèle de Données Power BI & Table de Pont",
        caption: "Preuve 3 : Architecture relationnelle Power BI — Modèle en étoile (DIM_CUSTOMER, DIM_PRODUCT, FACT_ORDER, FACT_DELIVERY) avec table de pont BRIDGE_ORDER_DELIVERY"
      }
    ],
    githubUrl: null // Projet d'entreprise confidentiel
  },

  otherProjects: [
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
    },
    {
      id: "facturapro-dz",
      tag: "Application Desktop · Facturation & Fiscalité",
      title: "FacturaPro DZ — Facturation Conforme Algérie",
      subtitle: "Logiciel desktop offline-first respectant la réglementation fiscale algérienne",
      summary: "Solution desktop ergonomique conçue pour simplifier la facturation des entreprises et commerces avec calcul automatisé de la TVA, du timbre fiscal et édition PDF.",
      status: "En cours de finalisation",
      stack: ["Electron", "React", "TypeScript", "SQLite", "IPC sécurisé", "i18n", "CSS Glassmorphism"],
      objective: "Simplifier et digitaliser la facturation des entreprises et commerces algériens en conformité stricte avec les règles fiscales locales.",
      highlights: [
        "Moteur fiscal algérien : automatisation des 3 taux de TVA (19%, 9%, 0%), calcul dynamique du timbre fiscal (1% plafonné entre 5 DA et 2 500 DA) et numérotation séquentielle légale.",
        "Gestion commerciale & tiers : répertoire clients intégrant NIF, RC, NIS et Article d'Imposition, catalogue produits/services avec suivi de stocks.",
        "Édition dynamique & Export : aperçu avant impression, personnalisation des entêtes d'entreprise et génération de factures aux normes au format PDF.",
        "Dashboard analytique temps réel : suivi des ventes journalières et mensuelles, volumétrie de facturation et historique récent.",
        "Internationalisation complète : interface bilingue Français / Arabe avec support ergonomique complet Right-to-Left (RTL)."
      ],
      result: "Production rapide de factures parfaitement conformes aux normes fiscales algériennes avec suivi de l'activité commerciale.",
      thumbnail: "assets/img/facturapro-preview.svg",
      gallery: [
        {
          src: "assets/img/facturapro-preview.svg",
          alt: "FacturaPro DZ - Dashboard et facturation conforme",
          caption: "Dashboard de facturation et conformité fiscale algérienne"
        }
      ]
    }
  ],

  skillCategories: [
    {
      name: "Data & Business Intelligence",
      icon: "chart-bar",
      skills: ["Power BI", "DAX Avancé", "Pipelines ETL", "Modélisation en Étoile", "KPIs & Reporting (OTIF)", "Data Warehouse"]
    },
    {
      name: "Bases de données & SGBD",
      icon: "database",
      skills: ["SQL", "DBeaver", "MySQL", "PostgreSQL", "SQLite", "Microsoft Access"]
    },
    {
      name: "Développement & Outils Data",
      icon: "code",
      skills: ["Python (Pandas, NumPy)", "JavaScript (ES6+)", "React 18", "Electron", "HTML5 / CSS3", "PHP"]
    },
    {
      name: "Outils & Versioning",
      icon: "table",
      skills: ["Microsoft Excel (TCD)", "Power Query", "Git / GitHub", "VS Code", "Suite Office"]
    },
    {
      name: "Systèmes & Support Informatique",
      icon: "cpu",
      skills: ["Windows", "Linux", "Support & Maintenance", "Dépannage réseau"]
    }
  ],

  experiences: [
    {
      period: "24/02/2026 – 05/08/2026",
      role: "Analyste de données & développeur web",
      company: "Layer Data",
      companySubtitle: "when humans meet Data",
      location: "Akbou, Algérie",
      missions: [
        {
          title: "Mission Data & BI — Client : {agrana}",
          bullets: [
            "Pipeline ETL & Data Warehouse : scripts Python pour l'ingestion, le nettoyage et la transformation des données brutes vers l'architecture Data Warehouse (couches Bronze et Gold).",
            "Modélisation MPD dans Power BI : conception et implémentation du schéma relationnel en étoile reliant dimensions et tables de faits (relations 1-N).",
            "Tableaux de bord Supply Chain : pilotage complet des commandes, livraisons effectives, prévisions de vente et reliquats.",
            "KPIs métiers clés : calcul et monitoring du taux de service OTIF (On-Time In-Full), analyse des commandes à risque et retards de livraison par client/produit.",
            "Automatisation des flux et actualisation des indicateurs de performance."
          ]
        },
        {
          title: "Mission Développement Web — Client : {sogral}",
          bullets: [
            "Conception et mise en ligne du module « Catalogue des Locaux Disponibles » pour la commercialisation des espaces commerciaux dans les gares routières nationales.",
            "Développement de filtres multi-critères : sélection par gare (localisation), type d'activité, superficie (m²) et tarification/loyer.",
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
      highlight: "Formation d'excellence en statistiques, data science, fouille de données et modélisation."
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
    duration: "10 semaines",
    startDate: "1er avril 2027",
    domain: "Analyse de données & Business Intelligence (Power BI, SQL, Python)",
    locationScope: "Aurillac / Mobilité France entière (Titulaire du Permis B)",
    callToAction: "Disponible pour échanger sur vos projets data et convenir d'un entretien."
  }
};
