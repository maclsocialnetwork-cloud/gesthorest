'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const PARTICLES = [
  { top: '10%', left: '5%', size: 60, rotate: 45, color: 'border-gesthorest-accent/20', delay: 0 },
  { top: '70%', left: '3%', size: 40, rotate: 20, color: 'border-white/10', delay: 0.5 },
  { top: '20%', right: '8%', size: 80, rotate: 12, color: 'border-white/10', delay: 0.3 },
  { top: '60%', right: '5%', size: 50, rotate: 45, color: 'border-gesthorest-accent/15', delay: 0.8 },
  { top: '40%', left: '50%', size: 30, rotate: 30, color: 'border-white/5', delay: 0.2 },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gesthorest-primary to-[#243752]">
      {/* Particules géométriques */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none absolute border-2 ${p.color} rounded-sm`}
          style={{
            top: p.top,
            left: 'left' in p ? p.left : undefined,
            right: 'right' in p ? (p as { right: string }).right : undefined,
            width: p.size,
            height: p.size,
            rotate: p.rotate,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full border border-white/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full border border-white/5"
      />

      <div className="container-gesthorest relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        {/* Contenu texte */}
        <div>
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm"
          >
            <ShieldCheck size={15} className="text-gesthorest-accent" />
            Agréé FDFP · ISO 9001:2015
          </motion.span>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl"
          >
            Développez les compétences{' '}
            <span className="text-gesthorest-accent">de vos équipes</span>{' '}
            avec un cabinet agréé FDFP
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/80"
          >
            Des formations professionnelles sur mesure, adaptées aux besoins réels de votre
            entreprise — partout en Côte d&apos;Ivoire et en Europe.
          </motion.p>

          {/* Boutons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded bg-gesthorest-accent px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-gesthorest-accent-hover hover:shadow-gesthorest-accent/30 hover:shadow-xl"
            >
              Demander un devis
            </Link>
            <Link
              href="/telechargements"
              className="inline-flex items-center justify-center rounded border-2 border-white/70 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-white hover:text-gesthorest-primary"
            >
              Télécharger le catalogue
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              Nous contacter
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>

        {/* Image hero */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
              alt="Formation professionnelle en entreprise — Gesthorest International"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gesthorest-primary/50 via-transparent to-transparent" />
          </div>
          {/* Floating badge sur l'image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute -bottom-4 -left-4 rounded-xl bg-white px-5 py-3 shadow-xl sm:-left-6"
          >
            <p className="text-xs font-medium text-gesthorest-text-light">Apprenants formés</p>
            <p className="font-heading text-2xl font-bold text-gesthorest-primary">3 500+</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
