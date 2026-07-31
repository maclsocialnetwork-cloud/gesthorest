'use client'

import { useState, FormEvent } from 'react'
import { Mail, ArrowRight } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-gesthorest-primary py-16">
      <div className="container-gesthorest flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gesthorest-accent/20 text-gesthorest-accent">
          <Mail size={24} />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-bold text-white sm:text-3xl">
          Restez informé de nos nouvelles formations
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/70">
          Recevez en avant-première nos nouveaux programmes, calendriers de sessions et
          offres spéciales directement dans votre boîte mail.
        </p>

        {status === 'success' ? (
          <div className="mt-8 rounded-xl bg-white/10 px-8 py-4 text-white">
            ✅ Merci ! Vous êtes bien inscrit à notre newsletter.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="flex-1 rounded-lg bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none ring-1 ring-white/20 focus:ring-gesthorest-accent"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gesthorest-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gesthorest-accent-hover disabled:opacity-60"
            >
              {status === 'loading' ? 'Inscription…' : (
                <>S&apos;abonner <ArrowRight size={15} /></>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-300">
            Une erreur s&apos;est produite. Veuillez réessayer.
          </p>
        )}

        <p className="mt-4 text-xs text-white/40">
          Pas de spam. Désinscription en un clic.
        </p>
      </div>
    </section>
  )
}
