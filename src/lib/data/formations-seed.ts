export type Domaine =
  | "management"
  | "ressources-humaines"
  | "finance-comptabilite"
  | "bureautique-digital"
  | "qualite-process"
  | "leadership"
  | "communication"
  | "securite-travail";

export const DOMAIN_LABELS: Record<Domaine, string> = {
  management: "Management",
  "ressources-humaines": "Ressources Humaines",
  "finance-comptabilite": "Finance & Comptabilité",
  "bureautique-digital": "Bureautique & Digital",
  "qualite-process": "Qualité & Process",
  leadership: "Leadership",
  communication: "Communication",
  "securite-travail": "Sécurité au Travail",
};

export const DOMAIN_BADGE_CLASSES: Record<Domaine, string> = {
  management: "bg-blue-50 text-blue-700",
  "ressources-humaines": "bg-purple-50 text-purple-700",
  "finance-comptabilite": "bg-emerald-50 text-emerald-700",
  "bureautique-digital": "bg-cyan-50 text-cyan-700",
  "qualite-process": "bg-amber-50 text-amber-700",
  leadership: "bg-rose-50 text-rose-700",
  communication: "bg-indigo-50 text-indigo-700",
  "securite-travail": "bg-red-50 text-red-700",
};

export type FormatFormation = "Présentiel" | "Distanciel" | "Blended";

export type Session = {
  id: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  placesTotal: number;
  placesRestantes: number;
};

export type Formation = {
  id: string;
  slug: string;
  titre: string;
  domaine: Domaine;
  format: FormatFormation;
  dureeJours: number;
  dureeLabel: string;
  description: string;
  programme: { titre: string; points: string[] }[];
  objectifs: string[];
  competencesAcquises: string[];
  publicCible: string;
  prerequis: string;
  prix: number | null;
  devise: string;
  financementFdfp: boolean;
  formateur: { nom: string; titre: string };
  sessions: Session[];
};

export const SEED_FORMATIONS: Formation[] = [
  {
    id: "seed-1",
    slug: "manager-equipe-performante",
    titre: "Manager une équipe performante",
    domaine: "management",
    format: "Présentiel",
    dureeJours: 3,
    dureeLabel: "3 jours",
    financementFdfp: true,
    description:
      "Cette formation outille les managers pour piloter leur équipe avec assurance : fixer des objectifs clairs, déléguer efficacement, motiver au quotidien et gérer les situations difficiles. Un programme concret, riche en mises en situation et retours d'expérience.",
    programme: [
      {
        titre: "Module 1 — Les fondamentaux du management",
        points: [
          "Les styles de management et leur impact sur l'équipe",
          "Positionnement du manager vis-à-vis de son équipe",
        ],
      },
      {
        titre: "Module 2 — Piloter la performance",
        points: [
          "Fixer des objectifs SMART",
          "Suivre et évaluer la performance individuelle et collective",
        ],
      },
      {
        titre: "Module 3 — Motiver et déléguer",
        points: [
          "Les leviers de motivation en contexte africain",
          "Déléguer sans perdre le contrôle",
        ],
      },
    ],
    objectifs: [
      "Adopter une posture managériale adaptée à son équipe",
      "Fixer des objectifs clairs et mesurables",
      "Déléguer efficacement en conservant la maîtrise des résultats",
      "Gérer les situations de tension au sein de l'équipe",
    ],
    competencesAcquises: [
      "Maîtrise des styles de management situationnel",
      "Capacité à fixer et suivre des objectifs SMART",
      "Techniques de délégation et de motivation",
      "Gestion des conflits et situations difficiles",
      "Animation de réunions de pilotage efficaces",
    ],
    publicCible:
      "Managers, chefs d'équipe, responsables de service souhaitant renforcer leurs pratiques managériales.",
    prerequis: "Une première expérience d'encadrement d'équipe est recommandée.",
    prix: 250000,
    devise: "FCFA",
    formateur: { nom: "Jean-Marc Ouattara", titre: "Consultant senior en management" },
    sessions: [
      {
        id: "s1-1",
        dateDebut: "2026-09-14",
        dateFin: "2026-09-16",
        lieu: "Abidjan",
        placesTotal: 20,
        placesRestantes: 12,
      },
      {
        id: "s1-2",
        dateDebut: "2026-11-09",
        dateFin: "2026-11-11",
        lieu: "Abidjan",
        placesTotal: 20,
        placesRestantes: 20,
      },
    ],
  },
  {
    id: "seed-2",
    slug: "recrutement-gestion-talents",
    titre: "Recrutement et gestion des talents",
    domaine: "ressources-humaines",
    format: "Blended",
    dureeJours: 4,
    dureeLabel: "4 jours",
    financementFdfp: true,
    description:
      "Maîtrisez l'ensemble du processus de recrutement, du sourcing à l'intégration, ainsi que les fondamentaux de la gestion des talents pour fidéliser vos meilleurs collaborateurs.",
    programme: [
      {
        titre: "Module 1 — Sourcing et sélection",
        points: [
          "Définir un profil de poste et une fiche de recrutement",
          "Techniques de sourcing et d'entretien structuré",
        ],
      },
      {
        titre: "Module 2 — Gestion des talents",
        points: [
          "Identifier et cartographier les talents clés",
          "Construire des parcours de fidélisation",
        ],
      },
    ],
    objectifs: [
      "Structurer un processus de recrutement fiable",
      "Conduire des entretiens efficaces et non-discriminants",
      "Mettre en place une stratégie de gestion des talents",
    ],
    competencesAcquises: [
      "Rédaction de fiches de poste et d'annonces efficaces",
      "Conduite d'entretiens structurés",
      "Évaluation et sélection des candidats",
      "Intégration et fidélisation des collaborateurs",
      "Cartographie des talents internes",
    ],
    publicCible: "DRH, responsables RH, chargés de recrutement.",
    prerequis: "Aucun prérequis spécifique.",
    prix: 320000,
    devise: "FCFA",
    formateur: { nom: "Aminata Cissé", titre: "Consultante RH & Talent Management" },
    sessions: [
      {
        id: "s2-1",
        dateDebut: "2026-09-28",
        dateFin: "2026-10-01",
        lieu: "Abidjan",
        placesTotal: 18,
        placesRestantes: 5,
      },
      {
        id: "s2-2",
        dateDebut: "2026-12-07",
        dateFin: "2026-12-10",
        lieu: "Paris",
        placesTotal: 15,
        placesRestantes: 15,
      },
    ],
  },
  {
    id: "seed-3",
    slug: "finance-pour-non-financiers",
    titre: "Finance pour non-financiers",
    domaine: "finance-comptabilite",
    format: "Présentiel",
    dureeJours: 2,
    dureeLabel: "2 jours",
    financementFdfp: true,
    description:
      "Une formation pratique pour comprendre les états financiers, piloter un budget et dialoguer efficacement avec la direction financière, sans connaissances comptables préalables.",
    programme: [
      {
        titre: "Module 1 — Lire un bilan et un compte de résultat",
        points: ["Comprendre les grands équilibres financiers", "Analyser la rentabilité"],
      },
      {
        titre: "Module 2 — Piloter un budget",
        points: ["Construire et suivre un budget opérationnel", "Analyser les écarts"],
      },
    ],
    objectifs: [
      "Lire et interpréter les documents financiers de l'entreprise",
      "Participer activement à la construction budgétaire",
      "Dialoguer efficacement avec la fonction finance",
    ],
    competencesAcquises: [
      "Lecture et interprétation d'un bilan et compte de résultat",
      "Construction d'un budget opérationnel",
      "Analyse des écarts budgétaires",
      "Communication avec la direction financière",
    ],
    publicCible: "Managers opérationnels, chefs de projet, non-financiers.",
    prerequis: "Aucun prérequis.",
    prix: 180000,
    devise: "FCFA",
    formateur: { nom: "Serge Kouamé", titre: "Expert-comptable, formateur finance" },
    sessions: [
      {
        id: "s3-1",
        dateDebut: "2026-09-21",
        dateFin: "2026-09-22",
        lieu: "Abidjan",
        placesTotal: 25,
        placesRestantes: 18,
      },
      {
        id: "s3-2",
        dateDebut: "2026-10-19",
        dateFin: "2026-10-20",
        lieu: "Abidjan",
        placesTotal: 25,
        placesRestantes: 25,
      },
    ],
  },
  {
    id: "seed-4",
    slug: "excel-avance-reporting",
    titre: "Excel avancé & reporting",
    domaine: "bureautique-digital",
    format: "Distanciel",
    dureeJours: 2,
    dureeLabel: "2 jours",
    financementFdfp: false,
    description:
      "Passez à la vitesse supérieure sur Excel : tableaux croisés dynamiques, fonctions avancées et création de tableaux de bord automatisés pour vos reportings.",
    programme: [
      {
        titre: "Module 1 — Fonctions avancées",
        points: ["RECHERCHEX, INDEX/EQUIV", "Fonctions conditionnelles imbriquées"],
      },
      {
        titre: "Module 2 — Tableaux de bord",
        points: ["Tableaux croisés dynamiques", "Mise en forme et automatisation de reporting"],
      },
    ],
    objectifs: [
      "Maîtriser les fonctions avancées d'Excel",
      "Construire des tableaux de bord dynamiques",
      "Automatiser des rapports récurrents",
    ],
    competencesAcquises: [
      "Maîtrise des fonctions RECHERCHEX, INDEX/EQUIV",
      "Création de tableaux croisés dynamiques",
      "Conception de tableaux de bord automatisés",
      "Automatisation des rapports récurrents",
    ],
    publicCible: "Toute personne utilisant Excel au quotidien souhaitant se perfectionner.",
    prerequis: "Bonne maîtrise des fonctions de base d'Excel.",
    prix: 120000,
    devise: "FCFA",
    formateur: { nom: "Grâce Yao", titre: "Formatrice bureautique certifiée" },
    sessions: [
      {
        id: "s4-1",
        dateDebut: "2026-09-07",
        dateFin: "2026-09-08",
        lieu: "En ligne",
        placesTotal: 30,
        placesRestantes: 22,
      },
    ],
  },
  {
    id: "seed-5",
    slug: "leadership-conduite-du-changement",
    titre: "Leadership et conduite du changement",
    domaine: "leadership",
    format: "Présentiel",
    dureeJours: 3,
    dureeLabel: "3 jours",
    financementFdfp: true,
    description:
      "Développez votre posture de leader et acquérez les outils pour conduire le changement au sein de votre organisation avec impact et adhésion des équipes.",
    programme: [
      {
        titre: "Module 1 — Le leader face au changement",
        points: ["Diagnostiquer les résistances au changement", "Construire une vision partagée"],
      },
      {
        titre: "Module 2 — Conduire le changement",
        points: ["Plan de communication du changement", "Accompagner les équipes dans la transition"],
      },
    ],
    objectifs: [
      "Renforcer sa posture de leader",
      "Diagnostiquer et lever les résistances au changement",
      "Construire un plan de conduite du changement efficace",
    ],
    competencesAcquises: [
      "Posture et leadership situationnel",
      "Diagnostic des résistances au changement",
      "Construction d'une vision partagée",
      "Plan de communication du changement",
      "Accompagnement des équipes en transition",
    ],
    publicCible: "Cadres dirigeants, managers, chefs de projet transformation.",
    prerequis: "Expérience d'encadrement recommandée.",
    prix: null,
    devise: "FCFA",
    formateur: { nom: "Jean-Marc Ouattara", titre: "Consultant senior en management" },
    sessions: [
      {
        id: "s5-1",
        dateDebut: "2026-10-12",
        dateFin: "2026-10-14",
        lieu: "Abidjan",
        placesTotal: 16,
        placesRestantes: 9,
      },
    ],
  },
  {
    id: "seed-6",
    slug: "iso-9001-management-qualite",
    titre: "ISO 9001 : Management de la qualité",
    domaine: "qualite-process",
    format: "Blended",
    dureeJours: 5,
    dureeLabel: "1 semaine",
    financementFdfp: true,
    description:
      "Comprenez les exigences de la norme ISO 9001:2015 et acquérez les compétences nécessaires pour déployer ou maintenir un système de management de la qualité efficace.",
    programme: [
      {
        titre: "Module 1 — Les exigences de la norme",
        points: ["Structure et exigences de l'ISO 9001:2015", "Approche processus et gestion des risques"],
      },
      {
        titre: "Module 2 — Déploiement et audit",
        points: ["Mettre en place le SMQ", "Préparer un audit de certification"],
      },
    ],
    objectifs: [
      "Comprendre les exigences de la norme ISO 9001:2015",
      "Déployer un système de management de la qualité",
      "Préparer son organisation à un audit de certification",
    ],
    competencesAcquises: [
      "Compréhension de la structure ISO 9001:2015",
      "Approche processus et cartographie des processus",
      "Gestion des risques et opportunités",
      "Déploiement d'un SMQ",
      "Préparation et conduite d'un audit interne",
    ],
    publicCible: "Responsables qualité, auditeurs internes, chefs de projet certification.",
    prerequis: "Connaissance de base des processus d'entreprise.",
    prix: 450000,
    devise: "FCFA",
    formateur: { nom: "Serge Kouamé", titre: "Auditeur qualité certifié ISO 9001" },
    sessions: [
      {
        id: "s6-1",
        dateDebut: "2026-11-16",
        dateFin: "2026-11-20",
        lieu: "Abidjan",
        placesTotal: 15,
        placesRestantes: 15,
      },
    ],
  },
];

export function getFormationBySlug(slug: string): Formation | undefined {
  return SEED_FORMATIONS.find((f) => f.slug === slug);
}
