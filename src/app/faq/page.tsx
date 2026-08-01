import type { Metadata } from 'next'
import AnimatedSection from '@/components/ui/AnimatedSection'
import FaqAccordion from '@/components/faq/FaqAccordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ — Questions fréquentes',
  description:
    'Réponses aux questions les plus fréquentes sur nos formations, le financement FDFP, les inscriptions et nos services.',
}

const FAQ_CATEGORIES = [
  {
    id: 'formations',
    label: 'Nos formations',
    questions: [
      {
        q: "Quels types de formations proposez-vous ?",
        a: "Gesthorest International propose des formations en Management, Ressources Humaines, Finance & Comptabilité, Marketing & Communication, Informatique & Digital, et Langues. Nos programmes sont disponibles en présentiel, distanciel (e-learning) et format blended (mixte). Nous proposons également des formations sur mesure adaptées aux besoins spécifiques de votre entreprise.",
      },
      {
        q: "Quelle est la durée moyenne d'une formation ?",
        a: "La durée varie de 1 à 10 jours selon le programme choisi. Certains modules peuvent être condensés sur 1-2 jours pour les formations express, tandis que les certifications professionnelles peuvent s'étendre sur plusieurs semaines. Toutes les durées sont indiquées sur les fiches formation de notre catalogue.",
      },
      {
        q: "Vos formations sont-elles disponibles à Paris comme à Abidjan ?",
        a: "Oui. Gesthorest International opère depuis ses deux bureaux — Abidjan (Côte d'Ivoire) et Paris (France). La majorité de nos formations intra-entreprise peuvent être organisées dans vos locaux, partout en Afrique de l'Ouest et en Europe. Le distanciel permet également de former vos équipes sans contrainte géographique.",
      },
      {
        q: "Puis-je obtenir une attestation de formation à l'issue du programme ?",
        a: "Absolument. Chaque participant reçoit une attestation de fin de formation signée par Gesthorest International. Pour les formations certifiantes, un certificat officiel est délivré. Ces documents sont disponibles en format numérique depuis votre espace apprenant et en version papier sur demande.",
      },
    ],
  },
  {
    id: 'fdfp',
    label: 'Financement FDFP',
    questions: [
      {
        q: "Qu'est-ce que le FDFP et qui peut en bénéficier ?",
        a: "Le Fonds de Développement de la Formation Professionnelle (FDFP) est un organisme ivoirien qui finance la formation continue des salariés des entreprises du secteur privé formel en Côte d'Ivoire. Toute entreprise assujettie à la Taxe d'Apprentissage et à la Contribution Formation (versées via la CNPS) peut solliciter le remboursement de ses dépenses de formation.",
      },
      {
        q: "Gesthorest est-il agréé FDFP ?",
        a: "Oui, Gesthorest International est un cabinet agréé FDFP. Cet agrément garantit que nos formations sont éligibles au remboursement par le FDFP. Vous pouvez donc financer tout ou partie de vos inscriptions via ce dispositif, sous réserve de respecter les procédures de demande d'autorisation préalable.",
      },
      {
        q: "Comment fonctionne la procédure de financement FDFP ?",
        a: "La procédure comporte 5 étapes : (1) Demande d'autorisation préalable au FDFP avant la formation, (2) Validation par le FDFP, (3) Réalisation de la formation avec Gesthorest, (4) Constitution du dossier de remboursement (convocation, feuille de présence, facture), (5) Soumission et remboursement. Gesthorest vous accompagne à chaque étape. Consultez notre page FDFP ou remplissez le formulaire de demande.",
      },
      {
        q: "Quel pourcentage du coût de la formation peut être remboursé par le FDFP ?",
        a: "Le FDFP peut prendre en charge jusqu'à 100 % du coût de la formation selon le plan de formation soumis et les plafonds en vigueur. Le taux de prise en charge dépend du type de formation, de sa durée et du quota de remboursement restant pour votre entreprise. Notre équipe réalise une simulation gratuite avant votre engagement.",
      },
    ],
  },
  {
    id: 'inscription',
    label: 'Inscription & Paiement',
    questions: [
      {
        q: "Comment s'inscrire à une formation ?",
        a: "Vous pouvez vous inscrire directement depuis la fiche formation en cliquant sur « Réserver ». Deux options de paiement s'offrent à vous : en ligne via CinetPay (carte bancaire, Mobile Money) ou au cabinet (virement, chèque, espèces). Après inscription, vous recevez une confirmation par e-mail avec la convocation officielle.",
      },
      {
        q: "Puis-je annuler ou reporter mon inscription ?",
        a: "Oui, sous réserve de respecter un délai de prévenance de 5 jours ouvrés avant le début de la formation. En cas d'annulation tardive (moins de 5 jours), des frais peuvent s'appliquer. Un report sans frais est possible une fois par inscription. Contactez notre équipe par e-mail ou WhatsApp pour toute demande.",
      },
      {
        q: "Y a-t-il des facilités de paiement ?",
        a: "Oui. Nous proposons des facilités de paiement en 2 ou 3 fois sans frais pour les inscriptions individuelles et les groupes. Pour les entreprises, des conditions particulières sont négociables en fonction du volume de formations. Contactez notre équipe commerciale pour établir une proposition adaptée.",
      },
    ],
  },
  {
    id: 'surmesure',
    label: 'Formations sur mesure',
    questions: [
      {
        q: "Proposez-vous des formations intra-entreprise ?",
        a: "Oui, c'est l'une de nos spécialités. Les formations intra-entreprise sont organisées dans vos locaux (ou à distance) avec votre groupe de collaborateurs. Nous adaptons le contenu, le calendrier et la pédagogie à votre contexte métier. Une demande de devis en ligne suffit pour démarrer.",
      },
      {
        q: "Peut-on concevoir un programme totalement sur mesure ?",
        a: "Absolument. Notre équipe pédagogique réalise d'abord un audit des besoins (entretiens, questionnaires), puis conçoit un programme 100 % adapté à vos objectifs. Les formations sur mesure incluent des études de cas issus de votre secteur d'activité et des supports pédagogiques personnalisés.",
      },
      {
        q: "Quels sont vos délais pour organiser une formation intra-entreprise ?",
        a: "En général, 2 à 4 semaines suffisent pour organiser une formation intra standard. Pour un programme entièrement sur mesure avec conception pédagogique complète, comptez 4 à 8 semaines. En cas d'urgence, contactez-nous — nous faisons notre possible pour nous adapter à vos contraintes.",
      },
    ],
  },
  {
    id: 'pratique',
    label: 'Informations pratiques',
    questions: [
      {
        q: "Comment accéder à mon espace apprenant ?",
        a: "Après votre inscription, un e-mail d'activation est envoyé à l'adresse fournie. Cliquez sur le lien pour créer votre mot de passe et accéder à votre espace apprenant depuis le menu du site. Vous y trouverez vos convocations, supports de cours, feuilles d'évaluation et attestations.",
      },
      {
        q: "Vos formateurs ont-ils une expérience terrain ?",
        a: "Oui, tous nos formateurs sont des praticiens expérimentés dans leur domaine (DRH, DAF, directeurs marketing, ingénieurs…), certifiés en ingénierie pédagogique. Gesthorest est certifié ISO 9001:2015, ce qui atteste de notre système de management de la qualité sur l'ensemble de notre offre de formation.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gesthorest-primary py-16 text-white">
        <div className="container-gesthorest text-center">
          <AnimatedSection>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gesthorest-accent">
              Centre d&apos;aide
            </p>
            <h1 className="font-heading text-4xl font-bold md:text-5xl">
              Questions fréquentes
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/75">
              Retrouvez ici les réponses aux questions les plus courantes sur nos formations,
              le financement FDFP, les inscriptions et nos services.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Body */}
      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest max-w-3xl">
          {FAQ_CATEGORIES.map((cat, i) => (
            <AnimatedSection key={cat.id} delay={i * 0.05}>
              <div className="mb-10">
                <h2 className="mb-4 font-heading text-xl font-bold text-gesthorest-primary">
                  {cat.label}
                </h2>
                <FaqAccordion questions={cat.questions} />
              </div>
            </AnimatedSection>
          ))}

          {/* CTA */}
          <AnimatedSection delay={0.3}>
            <div className="mt-8 rounded-2xl bg-gesthorest-primary p-8 text-center text-white">
              <h3 className="font-heading text-xl font-bold">
                Vous n&apos;avez pas trouvé votre réponse ?
              </h3>
              <p className="mt-2 text-sm text-white/75">
                Notre équipe répond dans les 24 heures ouvrées.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="rounded-lg bg-gesthorest-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gesthorest-accent-hover"
                >
                  Nous contacter
                </Link>
                <a
                  href="https://wa.me/2250747123321?text=Bonjour%20Gesthorest%2C%20j%27ai%20une%20question%20:"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border-2 border-white px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
