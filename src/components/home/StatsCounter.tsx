'use client'

import { useEffect, useRef, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

type Stat =
  | { type: 'counter'; value: number; suffix: string; label: string }
  | { type: 'badge'; icon: typeof ShieldCheck; label: string; sub: string }
  | { type: 'text'; prefix: string; label: string; sub: string }

const STATS: Stat[] = [
  { type: 'badge', icon: ShieldCheck, label: 'Agréé FDFP', sub: 'Fonds pour le Développement de la Formation Professionnelle' },
  { type: 'counter', value: 50, suffix: '+', label: 'formations au catalogue' },
  { type: 'counter', value: 200, suffix: '+', label: 'entreprises accompagnées' },
  { type: 'counter', value: 3500, suffix: '+', label: 'apprenants formés' },
  { type: 'counter', value: 94, suffix: '%', label: 'de satisfaction client' },
  { type: 'text', prefix: 'Partout', label: 'en Côte d\'Ivoire', sub: 'et en Europe' },
]

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    let frame: number
    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration])
  return value
}

function CounterItem({ stat, active }: { stat: Extract<Stat, { type: 'counter' }>; active: boolean }) {
  const count = useCountUp(stat.value, active)
  return (
    <div className="text-center">
      <p className="font-heading text-4xl font-bold text-gesthorest-accent sm:text-5xl">
        {count.toLocaleString('fr-FR')}{stat.suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-gesthorest-primary">{stat.label}</p>
    </div>
  )
}

export default function StatsCounter() {
  const [active, setActive] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="container-gesthorest">
        <AnimatedSection>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gesthorest-accent mb-3">
            Nos chiffres
          </p>
          <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
            Gesthorest en quelques chiffres
          </h2>
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-6">
          {STATS.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              {stat.type === 'counter' && (
                <CounterItem stat={stat} active={active} />
              )}
              {stat.type === 'badge' && (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gesthorest-accent/10">
                    <ShieldCheck size={28} className="text-gesthorest-accent" />
                  </div>
                  <p className="mt-3 font-heading text-lg font-bold text-gesthorest-primary">{stat.label}</p>
                  <p className="mt-1 text-xs text-gesthorest-text-light leading-tight">{stat.sub}</p>
                </div>
              )}
              {stat.type === 'text' && (
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-gesthorest-accent sm:text-3xl">{stat.prefix}</p>
                  <p className="mt-1 font-heading text-base font-semibold text-gesthorest-primary">{stat.label}</p>
                  <p className="text-sm text-gesthorest-text-light">{stat.sub}</p>
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
