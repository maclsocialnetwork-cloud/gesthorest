'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 1. Vérification locale via API (cookie httpOnly) — prioritaire
    if (email.trim().toLowerCase() === 'admin@gesthorest.com') {
      try {
        const res = await fetch('/api/admin/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        })
        if (res.ok) {
          router.push('/admin')
          return
        }
        const data = await res.json()
        // Si 401 : mot de passe incorrect pour le compte admin local
        if (res.status === 401) {
          setError(data.error ?? 'Mot de passe incorrect.')
          setLoading(false)
          return
        }
      } catch {
        // réseau cassé → tenter Supabase en fallback
      }
    }

    // 2. Fallback Supabase (comptes autres qu'admin@gesthorest.com)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseReady =
      supabaseUrl &&
      !supabaseUrl.includes('REMPLACER') &&
      supabaseKey &&
      !supabaseKey.includes('REMPLACER')

    if (supabaseReady) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl!, supabaseKey!)
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) {
          setError('Email ou mot de passe incorrect.')
          setLoading(false)
          return
        }
        router.push('/admin')
        return
      } catch {
        setError('Erreur de connexion. Veuillez réessayer.')
        setLoading(false)
        return
      }
    }

    setError('Identifiants incorrects.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gesthorest-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gesthorest-primary rounded-lg flex items-center justify-center text-white font-heading font-bold text-xl">
              G
            </div>
            <div>
              <p className="font-heading font-bold text-gesthorest-primary text-xl leading-tight">
                Gesthorest
              </p>
              <p className="text-xs text-gesthorest-muted">Administration</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="font-heading text-2xl font-bold text-gesthorest-primary text-center mb-2">
            Accès Administration
          </h1>
          <p className="text-sm text-gesthorest-muted text-center mb-8">
            Connectez-vous pour gérer le site Gesthorest
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gesthorest-text mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gesthorest-accent focus:border-transparent transition-all"
                placeholder="admin@gesthorest.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gesthorest-text mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gesthorest-accent focus:border-transparent transition-all"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gesthorest-primary text-white font-semibold py-3 rounded-lg hover:bg-gesthorest-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          <a href="/" className="hover:text-gray-400 transition-colors">
            ← Retour au site
          </a>
        </p>
      </div>
    </div>
  )
}
