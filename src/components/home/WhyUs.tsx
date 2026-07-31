import { Target, Users, FileText, Banknote, Trophy, RefreshCw } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const REASONS = [
  {
    icon: Target,
    title: 'Accompagnement personnalisé',
    desc: 'Chaque entreprise est unique. Nous adaptons nos formations à vos réalités terrain et à vos objectifs spécifiques.',
  },
  {
    icon: Users,
    title: 'Formateurs experts certifiés',
    desc: 'Tous nos formateurs sont des praticiens expérimentés avec des certifications reconnues dans leur domaine.',
  },
  {
    icon: FileText,
    title: 'Programmes adaptés à vos besoins',
    desc: 'Nos programmes sont co-construits avec vous pour garantir la pertinence et l\'efficacité de la formation.',
  },
  {
    icon: Banknote,
    title: 'Accompagnement FDFP complet',
    desc: 'Nous gérons pour vous le montage et le suivi de vos dossiers FDFP, de A à Z, sans frais supplémentaires.',
  },
  {
    icon: Trophy,
    title: 'Formations orientées résultats',
    desc: 'Des formations pratiques avec des mises en situation réelles pour garantir un transfert de compétences immédiat.',
  },
  {
    icon: RefreshCw,
    title: 'Suivi après formation',
    desc: 'Notre accompagnement ne s\'arrête pas à la fin de la session. Nous assurons un suivi post-formation personnalisé.',
  },
]

export default function WhyUs() {
  return (
    <section className="section-padding bg-gesthorest-light">
      <div className="container-gesthorest">
        <AnimatedSection>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gesthorest-accent mb-3">
            Notre différence
          </p>
          <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
            Pourquoi choisir Gesthorest ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gesthorest-text-light">
            Depuis plus de 12 ans, nous accompagnons les entreprises ivoiriennes et européennes
            dans le développement de leurs compétences humaines.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((item, i) => {
            const Icon = item.icon
            return (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="group h-full rounded-xl border border-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-l-4 hover:border-gesthorest-accent hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gesthorest-primary/5 text-gesthorest-primary transition-colors group-hover:bg-gesthorest-accent/10 group-hover:text-gesthorest-accent">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-gesthorest-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gesthorest-text-light">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
