import type { Metadata } from 'next'
import { CheckCircle2, FileText, Users, Clock, Award, HeartHandshake } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import FdfpForm from '@/components/fdfp/FdfpForm'

export const metadata: Metadata = {
  title: 'Financement FDFP',
  description:
    'Gesthorest vous accompagne dans la mobilisation de votre budget FDFP pour financer vos formations professionnelles en Côte d\'Ivoire.',
}

const ETAPES = [
  {
    num: 1,
    titre: 'Vérifier votre solde FDFP',
    desc: 'Contactez le FDFP ou votre gestionnaire RH pour connaître le montant disponible sur votre compte de cotisation.',
  },
  {
    num: 2,
    titre: 'Identifier la formation souhaitée',
    desc: 'Choisissez parmi notre catalogue la formation adaptée à vos besoins et objectifs de développement.',
  },
  {
    num: 3,
    titre: 'Constituer le dossier avec Gesthorest',
    desc: 'Nous préparons pour vous tous les documents nécessaires : devis, fiche descriptive, programme, liste des participants.',
  },
  {
    num: 4,
    titre: 'Soumettre la demande au FDFP',
    desc: 'Nous déposons le dossier complet auprès du FDFP et assurons le suivi de votre demande jusqu\'à validation.',
  },
  {
    num: 5,
    titre: 'Valider et planifier la formation',
    desc: 'Une fois la prise en charge accordée, nous planifions ensemble les sessions et assurons la formation dans les meilleures conditions.',
  },
]

const PIECES = [
  { icon: FileText, label: 'Copie de la carte de contribuable' },
  { icon: FileText, label: 'Relevé de compte de cotisation FDFP' },
  { icon: FileText, label: 'Fiche descriptive de la formation' },
  { icon: FileText, label: 'Devis signé par Gesthorest International' },
  { icon: Users, label: 'Liste nominative des participants' },
  { icon: FileText, label: 'Justificatif d\'inscription RCCM' },
]

const ACCOMPAGNEMENTS = [
  { icon: HeartHandshake, titre: 'Montage du dossier FDFP', desc: 'Nous gérons intégralement la constitution et le dépôt de votre dossier auprès du FDFP.' },
  { icon: Clock, titre: 'Suivi de la demande', desc: 'Notre équipe suit l\'avancement de votre demande et vous informe à chaque étape.' },
  { icon: Award, titre: 'Garantie de conformité', desc: 'Tous nos dossiers respectent les exigences du FDFP pour maximiser les chances d\'accord.' },
  { icon: CheckCircle2, titre: 'Formation 100% prise en charge', desc: 'Objectif : que vous n\'ayez aucun reste à charge sur vos formations éligibles.' },
]

export default function FdfpPage() {
  return (
    <>
      <PageHeader
        title="Finançez vos formations grâce au FDFP"
        breadcrumb={[{ label: 'Accueil', href: '/' }, { label: 'Accompagnement FDFP' }]}
      />

      {/* Qu'est-ce que le FDFP ? */}
      <section className="section-padding bg-white">
        <div className="container-gesthorest grid grid-cols-1 gap-12 lg:grid-cols-2">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-widest text-gesthorest-accent mb-3">
              Comprendre le dispositif
            </p>
            <h2 className="font-heading text-3xl font-bold text-gesthorest-primary">
              Qu&apos;est-ce que le FDFP ?
            </h2>
            <div className="mt-5 space-y-4 text-gesthorest-text leading-relaxed">
              <p>
                Le <strong>Fonds de Développement de la Formation Professionnelle (FDFP)</strong> est
                un organisme ivoirien qui collecte les cotisations des entreprises et les redistribue
                sous forme de financement pour les formations professionnelles.
              </p>
              <p>
                Chaque entreprise enregistrée en Côte d&apos;Ivoire verse une taxe mensuelle au FDFP
                (1,2% à 1,5% de la masse salariale). Ces cotisations constituent un <strong>crédit
                remboursable</strong> que vous pouvez mobiliser pour former vos collaborateurs.
              </p>
              <p>
                En tant que cabinet <strong>agréé FDFP</strong>, Gesthorest International est
                habilité à déposer des dossiers de prise en charge pour le compte de ses clients
                entreprises.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="rounded-2xl bg-gesthorest-primary p-8 text-white h-full flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gesthorest-accent mb-4">
                En chiffres
              </p>
              <div className="space-y-6">
                {[
                  { val: '1,5%', label: 'de la masse salariale versés au FDFP' },
                  { val: '100%', label: 'de prise en charge possible sur nos formations' },
                  { val: '0 FCFA', label: 'de reste à charge pour les formations éligibles' },
                ].map((item) => (
                  <div key={item.val} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                    <p className="font-heading text-3xl font-bold text-gesthorest-accent">{item.val}</p>
                    <p className="mt-1 text-sm text-white/75">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline mobilisation FDFP */}
      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gesthorest-accent mb-3">
              Processus
            </p>
            <h2 className="font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
              Comment mobiliser votre budget FDFP ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gesthorest-text-light">
              Un processus simple en 5 étapes, entièrement géré par nos équipes.
            </p>
          </AnimatedSection>

          <div className="relative mx-auto max-w-2xl">
            {/* Ligne verticale */}
            <div className="absolute left-6 top-0 h-full w-0.5 bg-gesthorest-accent/20 sm:left-8" />

            <div className="space-y-8">
              {ETAPES.map((etape, i) => (
                <AnimatedSection key={etape.num} delay={i * 0.1} className="relative flex gap-6 sm:gap-8">
                  {/* Numéro */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gesthorest-accent font-heading text-lg font-bold text-white shadow-lg">
                    {etape.num}
                  </div>
                  {/* Contenu */}
                  <div className="flex-1 rounded-xl bg-white p-5 shadow-sm">
                    <h3 className="font-heading font-semibold text-gesthorest-primary">
                      {etape.titre}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gesthorest-text-light">
                      {etape.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pièces à fournir */}
      <section className="section-padding bg-white">
        <div className="container-gesthorest">
          <AnimatedSection className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-gesthorest-primary">
              Pièces à fournir
            </h2>
            <p className="mt-3 text-gesthorest-text-light">
              Gesthorest vous guide dans la collecte de chaque document.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {PIECES.map((piece, i) => {
              const Icon = piece.icon
              return (
                <AnimatedSection key={piece.label} delay={i * 0.07}>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gesthorest-light px-5 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gesthorest-accent/10">
                      <Icon size={16} className="text-gesthorest-accent" />
                    </div>
                    <span className="text-sm font-medium text-gesthorest-text">{piece.label}</span>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Notre accompagnement */}
      <section className="section-padding bg-gesthorest-light">
        <div className="container-gesthorest">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gesthorest-accent mb-3">
              Notre valeur ajoutée
            </p>
            <h2 className="font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
              Notre accompagnement
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ACCOMPAGNEMENTS.map((item, i) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.titre} delay={i * 0.1}>
                  <div className="h-full rounded-xl bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gesthorest-accent/10">
                      <Icon size={22} className="text-gesthorest-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-gesthorest-primary">{item.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gesthorest-text-light">{item.desc}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Formulaire CTA */}
      <section className="section-padding bg-white" id="demande">
        <div className="container-gesthorest max-w-2xl mx-auto">
          <AnimatedSection className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gesthorest-accent mb-3">
              Démarrer maintenant
            </p>
            <h2 className="font-heading text-3xl font-bold text-gesthorest-primary">
              Demander un accompagnement FDFP
            </h2>
            <p className="mt-3 text-gesthorest-text-light">
              Remplissez ce formulaire et notre équipe vous contacte sous 24h ouvrées.
            </p>
          </AnimatedSection>
          <div className="rounded-2xl bg-gesthorest-light p-8">
            <FdfpForm />
          </div>
        </div>
      </section>
    </>
  )
}
