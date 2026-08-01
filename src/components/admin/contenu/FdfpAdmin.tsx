'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Clock, XCircle, Mail, Phone, Building2 } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'

type Demande = {
  id: string; nom: string; entreprise: string; email: string;
  telephone: string | null; formation_souhaitee: string | null;
  statut: string | null; created_at: string;
}

const STATUTS: { value: string; label: string; color: string; icon: typeof Clock }[] = [
  { value: 'nouveau', label: 'Nouveau', color: 'bg-blue-100 text-blue-700', icon: Clock },
  { value: 'en_cours', label: 'En cours', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'validé', label: 'Validé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'refusé', label: 'Refusé', color: 'bg-red-100 text-red-500', icon: XCircle },
]

function StatusBadge({ statut }: { statut: string | null }) {
  const s = STATUTS.find((st) => st.value === statut) ?? STATUTS[0]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${s.color}`}>
      <s.icon size={11} />
      {s.label}
    </span>
  )
}

export default function FdfpAdmin({ demandes }: { demandes: Demande[] }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<string>('tous')
  const [updating, setUpdating] = useState<string | null>(null)

  const filtered = filter === 'tous' ? demandes : demandes.filter((d) => d.statut === filter)

  async function updateStatut(id: string, statut: string) {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/contenus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _table: 'fdfp_demandes', _id: id, statut }),
      })
      if (!res.ok) throw new Error()
      showToast('Statut mis à jour')
      router.refresh()
    } catch { showToast('Erreur', 'error') }
    finally { setUpdating(null) }
  }

  const counts: Record<string, number> = { tous: demandes.length }
  for (const s of STATUTS) {
    counts[s.value] = demandes.filter((d) => d.statut === s.value || (!d.statut && s.value === 'nouveau')).length
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-white p-1 shadow-sm">
        <button onClick={() => setFilter('tous')}
          className={`rounded px-3 py-2 text-sm font-medium transition-colors ${filter === 'tous' ? 'bg-gesthorest-primary text-white' : 'text-gesthorest-text hover:bg-gesthorest-light'}`}>
          Toutes ({counts.tous})
        </button>
        {STATUTS.map((s) => (
          <button key={s.value} onClick={() => setFilter(s.value)}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${filter === s.value ? 'bg-gesthorest-accent text-white' : 'text-gesthorest-text hover:bg-gesthorest-light'}`}>
            {s.label} ({counts[s.value] ?? 0})
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <div key={d.id} className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gesthorest-primary">{d.nom}</p>
                <p className="flex items-center gap-1 text-xs text-gesthorest-text-light">
                  <Building2 size={11} /> {d.entreprise}
                </p>
              </div>
              <StatusBadge statut={d.statut} />
            </div>

            {d.formation_souhaitee && (
              <p className="mb-2 rounded bg-gesthorest-light px-2 py-1 text-xs text-gesthorest-primary">
                Formation : {d.formation_souhaitee}
              </p>
            )}

            <div className="space-y-1 text-xs text-gesthorest-text-light">
              <a href={`mailto:${d.email}`} className="flex items-center gap-1 hover:text-gesthorest-accent">
                <Mail size={11} /> {d.email}
              </a>
              {d.telephone && (
                <a href={`tel:${d.telephone}`} className="flex items-center gap-1 hover:text-gesthorest-accent">
                  <Phone size={11} /> {d.telephone}
                </a>
              )}
              <p className="pt-1 text-gray-400">
                {new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            {/* Statut update */}
            <div className="mt-3 border-t border-gray-50 pt-3">
              <label className="mb-1 block text-xs font-medium text-gesthorest-text-light">Changer le statut</label>
              <select
                disabled={updating === d.id}
                value={d.statut ?? 'nouveau'}
                onChange={(e) => updateStatut(d.id, e.target.value)}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-gesthorest-accent focus:outline-none disabled:opacity-50"
              >
                {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 py-12 text-center text-gesthorest-text-light text-sm">Aucune demande.</p>
        )}
      </div>
    </div>
  )
}
