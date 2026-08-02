import { ICON_MAP } from '@/lib/icon-map'
import AnimatedSection from '@/components/ui/AnimatedSection'

export type AvantageRow = { icone: string; titre: string; description: string }

export default function WhyUs({ avantages }: { avantages: AvantageRow[] }) {
  if (!avantages.length) return null

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
          {avantages.map((item, i) => {
            const Icon = ICON_MAP[item.icone] ?? ICON_MAP.Target
            return (
              <AnimatedSection key={item.titre} delay={i * 0.1}>
                <div className="group h-full rounded-xl border border-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-l-4 hover:border-gesthorest-accent hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gesthorest-primary/5 text-gesthorest-primary transition-colors group-hover:bg-gesthorest-accent/10 group-hover:text-gesthorest-accent">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-gesthorest-primary">
                    {item.titre}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gesthorest-text-light">
                    {item.description}
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
