import Image from 'next/image'
import { Star } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export type TemoignageRow = {
  nom: string
  poste: string | null
  entreprise: string | null
  photo_url: string | null
  texte: string
  note: number
}

export default function Testimonials({ testimonials }: { testimonials: TemoignageRow[] }) {
  if (!testimonials.length) return null

  return (
    <section className="section-padding bg-gesthorest-light">
      <div className="container-gesthorest">
        <AnimatedSection>
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gesthorest-accent">
            Témoignages
          </p>
          <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
            Ce que disent nos clients
          </h2>
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.nom} delay={i * 0.12}>
              <div className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 text-gesthorest-accent">
                  {Array.from({ length: t.note }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-gesthorest-text">
                  &ldquo;{t.texte}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  {t.photo_url && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-gesthorest-accent/20">
                      <Image src={t.photo_url} alt={t.nom} fill className="object-cover" sizes="48px" />
                    </div>
                  )}
                  <div>
                    <p className="font-heading text-sm font-semibold text-gesthorest-primary">{t.nom}</p>
                    <p className="text-xs text-gesthorest-text-light">
                      {t.poste}{t.entreprise ? ` — ${t.entreprise}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
