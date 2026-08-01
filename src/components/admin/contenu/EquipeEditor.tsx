'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/components/ui/ToastProvider'

type Membre = {
  id: string; nom: string; prenom: string; titre: string | null;
  bio: string | null; photo_url: string | null; ordre: number | null; actif: boolean | null;
}

const INPUT = 'w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none'

export default function EquipeEditor({ equipe }: { equipe: Membre[] }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(false)

  function f(key: string) { return (form[key] as string) ?? '' }
  function set(key: string, v: unknown) { setForm((p) => ({ ...p, [key]: v })) }

  function openNew() { setEditingId(null); setForm({ actif: true, ordre: equipe.length + 1 }); setShowModal(true) }
  function openEdit(m: Membre) { setEditingId(m.id); setForm({ ...m }); setShowModal(true) }

  async function handleSave() {
    setLoading(true)
    try {
      const payload = { ...form, _table: 'equipe', ...(editingId ? { _id: editingId } : {}) }
      const res = await fetch('/api/admin/contenus', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      showToast(editingId ? 'Membre mis à jour' : 'Membre ajouté')
      setShowModal(false)
      router.refresh()
    } catch { showToast('Erreur', 'error') }
    finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce membre ?')) return
    const res = await fetch(`/api/admin/contenus?table=equipe&id=${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Supprimé'); router.refresh() }
    else showToast('Erreur', 'error')
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gesthorest-text-light">{equipe.length} membres • ordre d&apos;affichage configurable</p>
        <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Ajouter un membre
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipe.map((m) => (
          <div key={m.id} className="relative rounded-lg bg-white p-4 shadow-sm">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-gray-300">
              <GripVertical size={16} />
            </div>
            <div className="flex items-start gap-3 pl-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gesthorest-light">
                {m.photo_url ? (
                  <Image src={m.photo_url} alt={m.prenom} fill className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-heading text-xl font-bold text-gesthorest-primary">
                    {m.prenom[0]}{m.nom[0]}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gesthorest-primary truncate">{m.prenom} {m.nom}</p>
                <p className="text-xs text-gesthorest-text-light truncate">{m.titre ?? '—'}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {m.actif ? 'Actif' : 'Masqué'}
                  </span>
                  <span className="text-xs text-gesthorest-text-light">#{m.ordre ?? '?'}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2 border-t border-gray-50 pt-3">
              <button onClick={() => openEdit(m)} className="flex items-center gap-1 text-xs font-medium text-gesthorest-accent hover:underline">
                <Pencil size={13} /> Modifier
              </button>
              <button onClick={() => handleDelete(m.id)} className="flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600">
                <Trash2 size={13} /> Supprimer
              </button>
            </div>
          </div>
        ))}
        {equipe.length === 0 && (
          <p className="col-span-3 py-12 text-center text-gesthorest-text-light text-sm">Aucun membre d&apos;équipe.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 font-heading text-lg font-bold text-gesthorest-primary">
              {editingId ? 'Modifier le membre' : 'Ajouter un membre'}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Prénom</label>
                  <input className={INPUT} value={f('prenom')} onChange={(e) => set('prenom', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Nom</label>
                  <input className={INPUT} value={f('nom')} onChange={(e) => set('nom', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Titre / Poste</label>
                <input className={INPUT} value={f('titre')} onChange={(e) => set('titre', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Bio</label>
                <textarea className={INPUT} rows={3} value={f('bio')} onChange={(e) => set('bio', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">URL Photo</label>
                <input className={INPUT} value={f('photo_url')} onChange={(e) => set('photo_url', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Ordre d&apos;affichage</label>
                  <input type="number" className={INPUT} value={(form.ordre as number) ?? ''}
                    onChange={(e) => set('ordre', Number(e.target.value))} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={!!form.actif} onChange={(e) => set('actif', e.target.checked)} />
                    Actif (visible)
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-sm">Annuler</button>
              <button type="button" onClick={handleSave} disabled={loading} className="btn-primary text-sm disabled:opacity-60">
                {loading ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
