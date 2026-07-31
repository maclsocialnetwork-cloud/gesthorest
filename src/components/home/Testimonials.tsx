import Image from 'next/image'
import { Star } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const TESTIMONIALS = [
  {
    name: 'Aïcha Kouamé',
    role: 'Directrice RH',
    company: 'Groupe Ivoire Distribution',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200&q=80',
    text: 'Une formation très pratique qui a permis à nos managers d\'améliorer leur performance opérationnelle en 3 mois. Le suivi post-formation est vraiment appréciable.',
    rating: 5,
  },
  {
    name: 'Kouassi Adjoua',
    role: 'Directeur Général',
    company: 'Sud Finance SA',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    text: 'Gesthorest a su monter un dossier FDFP impeccable pour nous. Nos équipes ont été formées sans débourser un centime de notre trésorerie. Très professionnel.',
    rating: 5,
  },
  {
    name: 'Fatou Diabaté',
    role: 'Manager RH',
    company: 'Atlantique Industries',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    text: 'Le programme sur mesure conçu pour nos équipes commerciales a dépassé nos attentes. Un retour sur investissement concret et mesurable dès les premières semaines.',
    rating: 5,
  },
]

export default function Testimonials() {
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
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.12}>
              <div className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm">
                {/* Étoiles */}
                <div className="flex gap-0.5 text-gesthorest-accent">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                {/* Texte */}
                <p className="mt-4 flex-1 text-sm leading-relaxed text-gesthorest-text">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Auteur */}
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-gesthorest-accent/20">
                    <Image
                      src={t.photo}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-gesthorest-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-gesthorest-text-light">
                      {t.role} — {t.company}
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
