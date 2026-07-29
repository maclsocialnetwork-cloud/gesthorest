export type CategorieArticle =
  | "Tendances RH"
  | "Témoignages"
  | "Actualités cabinet"
  | "Conseils formation";

export type Article = {
  id: string;
  slug: string;
  titre: string;
  extrait: string;
  contenu: string[];
  imageUrl: string;
  categorie: CategorieArticle;
  createdAt: string;
};

export const SEED_ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "5-tendances-rh-2026-afrique-ouest",
    titre: "5 tendances RH à suivre en 2026 en Afrique de l'Ouest",
    extrait:
      "Digitalisation des processus RH, marque employeur, flexibilité : tour d'horizon des tendances qui redessinent la fonction RH.",
    contenu: [
      "La fonction RH connaît une transformation profonde en Afrique de l'Ouest, portée par la digitalisation des processus et l'évolution des attentes des collaborateurs.",
      "Parmi les tendances marquantes : le développement du recrutement digital, la montée en puissance de la marque employeur, et une attention croissante portée à la qualité de vie au travail.",
      "Les entreprises qui sauront anticiper ces évolutions prendront une longueur d'avance dans l'attraction et la fidélisation des talents.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
    categorie: "Tendances RH",
    createdAt: "2026-06-02",
  },
  {
    id: "art-2",
    slug: "temoignage-groupe-ivoire-distribution",
    titre: "Témoignage : comment le Groupe Ivoire Distribution a transformé son management",
    extrait:
      "Retour d'expérience sur l'accompagnement managérial mené par Gesthorest auprès des équipes du Groupe Ivoire Distribution.",
    contenu: [
      "Le Groupe Ivoire Distribution a fait appel à Gesthorest International pour renforcer les compétences managériales de ses équipes encadrantes.",
      "Sur trois mois, un programme sur mesure a été déployé, combinant formation présentielle et suivi individualisé.",
      "Résultat : une nette amélioration de la cohésion d'équipe et de la performance opérationnelle, saluée par la direction générale.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80",
    categorie: "Témoignages",
    createdAt: "2026-05-20",
  },
  {
    id: "art-3",
    slug: "gesthorest-renouvelle-certification-iso-9001",
    titre: "Gesthorest International renouvelle sa certification ISO 9001:2015",
    extrait:
      "Notre cabinet confirme son engagement qualité en renouvelant sa certification ISO 9001:2015 pour trois nouvelles années.",
    contenu: [
      "Gesthorest International est fier d'annoncer le renouvellement de sa certification ISO 9001:2015, gage de la qualité de ses prestations de formation et de recrutement.",
      "Cette certification récompense les efforts continus du cabinet en matière d'amélioration de ses processus internes et de satisfaction client.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    categorie: "Actualités cabinet",
    createdAt: "2026-04-15",
  },
  {
    id: "art-4",
    slug: "reussir-integration-formation-intra-entreprise",
    titre: "Comment réussir l'intégration d'une formation intra-entreprise ?",
    extrait:
      "Nos conseils pratiques pour maximiser l'impact d'une formation sur mesure déployée en entreprise.",
    contenu: [
      "Une formation intra-entreprise réussie repose sur un diagnostic préalable précis des besoins de l'organisation.",
      "Il est essentiel d'impliquer les managers en amont, de personnaliser les contenus, et de prévoir un suivi post-formation pour ancrer durablement les nouvelles compétences.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    categorie: "Conseils formation",
    createdAt: "2026-03-30",
  },
  {
    id: "art-5",
    slug: "attirer-talents-marche-concurrentiel",
    titre: "Comment attirer les meilleurs talents dans un marché concurrentiel",
    extrait:
      "Les leviers RH à activer pour renforcer l'attractivité de votre entreprise auprès des candidats à haut potentiel.",
    contenu: [
      "Dans un marché de l'emploi de plus en plus concurrentiel, l'attractivité employeur devient un enjeu stratégique majeur.",
      "Rémunération, culture d'entreprise, perspectives d'évolution et processus de recrutement fluide sont autant de leviers à activer.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    categorie: "Tendances RH",
    createdAt: "2026-03-10",
  },
  {
    id: "art-6",
    slug: "temoignage-directeur-general-sud-finance",
    titre: "Témoignage : le regard du Directeur Général de Sud Finance SA",
    extrait:
      "Un dirigeant partage son expérience de collaboration avec Gesthorest International sur l'accompagnement de ses cadres.",
    contenu: [
      "Kouassi Adjoua, Directeur Général de Sud Finance SA, revient sur les bénéfices concrets de son partenariat avec Gesthorest International.",
      "Un accompagnement jugé rigoureux, avec un vrai suivi post-formation qui fait la différence selon lui.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",
    categorie: "Témoignages",
    createdAt: "2026-02-18",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return SEED_ARTICLES.find((a) => a.slug === slug);
}
