'use client'

import { useState, FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function FdfpForm() {
  const [form, setForm] = useState({
    entreprise: '', nom: '', email: '', telephone: '', formation_souhaitee: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/fdfp/demande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ entreprise: '', nom: '', email: '', telephone: '', formation_souhaitee: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-green-50 p-10 text-center">
        <CheckCircle2 size={48} className="text-green-500" />
        <h3 className="font-heading text-xl font-bold text-green-800">
          Demande envoyée avec succès !
        </h3>
        <p className="text-sm text-green-700">
          Notre équipe vous contactera sous 24h ouvrées pour démarrer
          votre accompagnement FDFP.
        </p>
      </div>
    )
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gesthorest-accent focus:outline-none focus:ring-2 focus:ring-gesthorest-accent/20 transition-all'
  const labelCls = 'block text-sm font-medium text-gesthorest-text mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Nom *</label>
          <input name="nom" required value={form.nom} onChange={handleChange} className={inputCls} placeholder="Votre nom" />
        </div>
        <div>
          <label className={labelCls}>Entreprise *</label>
          <input name="entreprise" required value={form.entreprise} onChange={handleChange} className={inputCls} placeholder="Nom de votre entreprise" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputCls} placeholder="votre@email.com" />
        </div>
        <div>
          <label className={labelCls}>Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} className={inputCls} placeholder="+225 07 00 00 00 00" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Formation souhaitée</label>
        <input name="formation_souhaitee" value={form.formation_souhaitee} onChange={handleChange} className={inputCls} placeholder="Ex : Manager une équipe performante" />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
          Une erreur s&apos;est produite. Veuillez réessayer ou nous appeler.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-gesthorest-accent px-6 py-3.5 font-bold text-white transition-colors hover:bg-gesthorest-accent-hover disabled:opacity-60"
      >
        {status === 'loading' ? 'Envoi en cours…' : 'Demander un accompagnement FDFP'}
      </button>
    </form>
  )
}
