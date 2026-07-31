import type { Metadata } from 'next'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import TelechargementCard from '@/components/telechargements/TelechargementCard'

export const metadata: Metadata = {
  title: 'Téléchargements',
  description:
    'Téléchargez le catalogue des formations Gesthorest, calendrier, brochure, fiches techniques et guide financement FDFP.',
}

const DOCUMENTS = [
  {
    titre: 'Catalogue des formations 2025',
    description: "L'ensemble de nos formations pour l'année 2025, avec les objectifs, programmes et tarifs.",
    type: 'catalogue',
  },
  {
    titre: 'Calendrier des sessions',
    description: 'Le planning complet de toutes nos sessions de formation programmées pour 2025.',
    type: 'calendrier',
  },
  {
    titre: 'Brochure Gesthorest',
    description: 'Présentation complète du cabinet, de nos expertises, certifications et équipe.',
    type: 'brochure',
  },
  {
    titre: 'Guide financement FDFP',
    description: 'Tout ce que vous devez savoir pour mobiliser votre budget FDFP et financer vos formations.',
    type: 'guide',
  },
  {
    titre: 'Dossier administratif',
    description: "Documents requis pour l'inscription et la prise en charge de vos formations.",
    type: 'administratif',
  },
  {
    titre: 'Fiches techniques formations',
    description: 'Fiches détaillées par domaine : Management, RH, Finance, Qualité, Leadership, Digital.',
    type: 'fiche',
  },
]

export default function TelechargementsPage() {
  return (
    <>
      <PageHeader
        title="Ressources et documents"
        breadcrumb={[{ label: 'Accueil', href: '/' }, { label: 'Téléchargements' }]}
      />

      <section className="section-padding bg-white">
        <div className="container-gesthorest">
          <AnimatedSection className="text-center mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gesthorest-accent">
              Ressources gratuites
            </p>
            <h2 className="font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
              Nos documents à télécharger
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gesthorest-text-light">
              Catalogue, calendrier, guide FDFP… Tous nos documents sont disponibles
              gratuitement. Renseignez simplement votre email pour les recevoir.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTS.map((doc, i) => (
              <AnimatedSection key={doc.type} delay={i * 0.08}>
                <TelechargementCard doc={doc} />
              </AnimatedSection>
            ))}
          </div>

          {/* Note de bas de page */}
          <AnimatedSection delay={0.5} className="mt-14">
            <div className="rounded-2xl bg-gesthorest-light p-8 text-center">
              <p className="font-heading text-lg font-semibold text-gesthorest-primary">
                Vous avez besoin d&apos;un document spécifique ?
              </p>
              <p className="mt-2 text-sm text-gesthorest-text-light">
                Contactez-nous directement et nous vous préparerons un dossier sur mesure.
              </p>
              <a
                href="/contact"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-gesthorest-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gesthorest-accent-hover"
              >
                Nous contacter
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
