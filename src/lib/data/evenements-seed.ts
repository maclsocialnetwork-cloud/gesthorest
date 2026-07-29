export type Evenement = {
  id: string;
  titre: string;
  description: string;
  dateEvenement: string;
  lieu: string;
  places: number;
  prix: number | null;
  devise: string;
  passe?: boolean;
};

export const SEED_EVENEMENTS: Evenement[] = [
  {
    id: "evt-1",
    titre: "Masterclass — Leadership au féminin",
    description:
      "Une rencontre exclusive avec des dirigeantes africaines pour échanger sur les clés du leadership et de la performance durable.",
    dateEvenement: "2026-09-25",
    lieu: "Abidjan — Sofitel Hôtel Ivoire",
    places: 80,
    prix: 25000,
    devise: "FCFA",
  },
  {
    id: "evt-2",
    titre: "Petit-déjeuner RH — L'IA au service des RH",
    description:
      "Un temps d'échange convivial sur les usages concrets de l'intelligence artificielle dans la fonction RH.",
    dateEvenement: "2026-10-15",
    lieu: "Abidjan — Gesthorest International",
    places: 40,
    prix: null,
    devise: "FCFA",
  },
  {
    id: "evt-3",
    titre: "Forum Emploi & Compétences Afrique-Europe",
    description:
      "Le rendez-vous annuel qui réunit entreprises, candidats et institutions autour de l'emploi et des compétences entre l'Afrique de l'Ouest et l'Europe.",
    dateEvenement: "2026-11-20",
    lieu: "Paris — Espace Congrès",
    places: 200,
    prix: 15000,
    devise: "FCFA",
  },
  {
    id: "evt-4",
    titre: "Conférence — Qualité et performance industrielle",
    description:
      "Retour d'expérience d'entreprises certifiées ISO 9001 sur leur démarche qualité.",
    dateEvenement: "2026-05-14",
    lieu: "Abidjan — CCIA",
    places: 60,
    prix: null,
    devise: "FCFA",
    passe: true,
  },
  {
    id: "evt-5",
    titre: "Atelier — Onboarding réussi",
    description:
      "Un atelier pratique sur la construction d'un parcours d'intégration efficace pour les nouvelles recrues.",
    dateEvenement: "2026-03-08",
    lieu: "Abidjan — Gesthorest International",
    places: 30,
    prix: 10000,
    devise: "FCFA",
    passe: true,
  },
];
