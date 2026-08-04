'use client'

import { useEffect, useRef, useState } from 'react'
import { ICON_MAP } from '@/lib/icon-map'
import AnimatedSection from '@/components/ui/AnimatedSection'

export type StatRow = {
  type: string
  valeur: number | null
  suffixe: string | null
  libelle: string
  sous_texte: string | null
  prefixe: string | null
  icone: string | null
}

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

function CounterItem({ stat, active }: { stat: StatRow; active: boolean }) {
  const count = useCountUp(stat.valeur ?? 0, active)
  return (
    <div className="text-center">
      <p className="font-heading text-4xl font-bold text-gesthorest-accent sm:text-5xl">
        {count.toLocaleString('fr-FR')}{stat.suffixe}
      </p>
      <p className="mt-2 text-sm font-medium text-gesthorest-primary">{stat.libelle}</p>
    </div>
  )
}

export default function StatsCounter({ stats }: { stats: StatRow[] }) {
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

  if (!stats.length) return null

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

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              {stat.type === 'counter' && <CounterItem stat={stat} active={active} />}
              {stat.type === 'badge' && (() => {
                const Icon = ICON_MAP[stat.icone ?? ''] ?? ICON_MAP.ShieldCheck
                return (
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gesthorest-accent/10">
                      <Icon size={28} className="text-gesthorest-accent" />
                    </div>
                    <p className="mt-3 font-heading text-lg font-bold text-gesthorest-primary">{stat.libelle}</p>
                    <p className="mt-1 text-xs text-gesthorest-text-light leading-tight">{stat.sous_texte}</p>
                  </div>
                )
              })()}
              {stat.type === 'text' && (
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-gesthorest-accent sm:text-3xl">{stat.prefixe}</p>
                  <p className="mt-1 font-heading text-base font-semibold text-gesthorest-primary">{stat.libelle}</p>
                  <p className="text-sm text-gesthorest-text-light">{stat.sous_texte}</p>
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
