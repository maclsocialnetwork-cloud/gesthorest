import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Leaf } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import FormationSidebar from '@/components/catalogue/FormationSidebar'
import ProgrammeAccordion from '@/components/catalogue/ProgrammeAccordion'
import { getFormationBySlug } from '@/lib/data/formations'
import { DOMAIN_LABELS, DOMAIN_BADGE_CLASSES } from '@/lib/data/formations-seed'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const formation = await getFormationBySlug(params.slug)
  if (!formation) return { title: 'Formation introuvable' }
  return {
    title: formation.titre,
    description: formation.description.slice(0, 155),
  }
}

export default async function FormationPage({ params }: Props) {
  const formation = await getFormationBySlug(params.slug)
  if (!formation) notFound()

  return (
    <>
      <PageHeader
        title={formation.titre}
        breadcrumb={[
          { label: 'Accueil', href: '/' },
          { label: 'Catalogue', href: '/catalogue' },
          { label: formation.titre },
        ]}
      />

      <div className="container-gesthorest section-padding grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        {/* Contenu principal */}
        <div>
          {/* Badges domaine + format */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${DOMAIN_BADGE_CLASSES[formation.domaine]}`}>
              {DOMAIN_LABELS[formation.domaine]}
            </span>
            <span className="inline-flex items-center rounded-full bg-gesthorest-light px-3 py-1 text-xs font-semibold text-gesthorest-primary">
              {formation.format}
            </span>
            {formation.financementFdfp && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <Leaf size={12} /> Financement FDFP possible
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 leading-relaxed text-gesthorest-text">
            {formation.description}
          </p>

          {/* Encart FDFP */}
          {formation.financementFdfp && (
            <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-600" />
                <div>
                  <p className="font-heading font-semibold text-green-800">
                    Cette formation est éligible au financement FDFP
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    Gesthorest vous accompagne dans le montage de votre dossier FDFP, de A à Z,
                    sans frais supplémentaires.
                  </p>
                  <Link
                    href="/fdfp"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 underline underline-offset-2 hover:text-green-900"
                  >
                    En savoir plus sur le financement FDFP →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Programme */}
          <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
              Programme de la formation
            </h2>
            <div className="mt-5">
              <ProgrammeAccordion modules={formation.programme} />
            </div>
          </div>

          {/* Objectifs pédagogiques */}
          <div className="mt-10">
            <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
              Objectifs pédagogiques
            </h2>
            <ul className="mt-4 space-y-2">
              {formation.objectifs.map((objectif) => (
                <li key={objectif} className="flex items-start gap-2 text-sm text-gesthorest-text">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                  {objectif}
                </li>
              ))}
            </ul>
          </div>

          {/* Compétences acquises */}
          {formation.competencesAcquises.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading text-2xl font-bold text-gesthorest-primary">
                Compétences acquises
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {formation.competencesAcquises.map((competence) => (
                  <div key={competence} className="flex items-start gap-2 rounded-lg bg-gesthorest-light px-4 py-3 text-sm text-gesthorest-text">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                    {competence}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Public cible + Prérequis */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
                Public cible
              </h3>
              <p className="mt-2 text-sm text-gesthorest-text-light">{formation.publicCible}</p>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
                Prérequis
              </h3>
              <p className="mt-2 text-sm text-gesthorest-text-light">{formation.prerequis}</p>
            </div>
          </div>

          {/* Formateur */}
          <div className="mt-10 flex items-center gap-4 rounded-xl bg-gesthorest-light p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gesthorest-primary font-heading text-lg font-bold text-white">
              {formation.formateur.nom.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gesthorest-text-light">
                Formateur responsable
              </p>
              <p className="mt-0.5 font-heading font-semibold text-gesthorest-primary">
                {formation.formateur.nom}
              </p>
              <p className="text-sm text-gesthorest-text-light">{formation.formateur.titre}</p>
            </div>
          </div>
        </div>

        {/* Sidebar sticky */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <FormationSidebar formation={formation} />
        </div>
      </div>
    </>
  )
}
