'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Download } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'

type Document = {
  id: string; titre: string; description: string | null;
  type_document: string | null; url_fichier: string | null;
  actif: boolean | null; nb_telechargements: number | null; created_at: string;
}

const INPUT = 'w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none'
const TYPE_OPTIONS = ['catalogue', 'guide', 'brochure', 'formulaire', 'attestation', 'autre']

export default function TelechargementsCMS({ documents }: { documents: Document[] }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(false)

  function f(key: string) { return (form[key] as string) ?? '' }
  function set(key: string, v: unknown) { setForm((p) => ({ ...p, [key]: v })) }

  function openNew() { setEditingId(null); setForm({ actif: true }); setShowModal(true) }
  function openEdit(d: Document) { setEditingId(d.id); setForm({ ...d }); setShowModal(true) }

  async function handleSave() {
    setLoading(true)
    try {
      const payload = { ...form, _table: 'telechargements', ...(editingId ? { _id: editingId } : {}) }
      const res = await fetch('/api/admin/contenus', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      showToast(editingId ? 'Document mis à jour' : 'Document ajouté')
      setShowModal(false)
      router.refresh()
    } catch { showToast('Erreur', 'error') }
    finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce document ?')) return
    const res = await fetch(`/api/admin/contenus?table=telechargements&id=${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Supprimé'); router.refresh() }
    else showToast('Erreur', 'error')
  }

  const totalDownloads = documents.reduce((s, d) => s + (d.nb_telechargements ?? 0), 0)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gesthorest-text-light">
          {documents.length} documents · <Download className="inline mb-0.5" size={13} /> {totalDownloads} téléchargements au total
        </p>
        <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Ajouter un document
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gesthorest-light">
            <tr>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Téléchargements</th>
              <th className="px-4 py-3 font-medium">Actif</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents.map((d) => (
              <tr key={d.id} className="hover:bg-gesthorest-light/50">
                <td className="px-4 py-3 font-medium">{d.titre}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gesthorest-light px-2 py-0.5 text-xs text-gesthorest-primary capitalize">
                    {d.type_document ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-gesthorest-accent">{d.nb_telechargements ?? 0}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${d.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {d.actif ? 'Oui' : 'Non'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(d)} className="text-gesthorest-accent hover:opacity-70"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gesthorest-text-light">Aucun document.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 font-heading text-lg font-bold text-gesthorest-primary">
              {editingId ? 'Modifier le document' : 'Ajouter un document'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Titre *</label>
                <input className={INPUT} value={f('titre')} onChange={(e) => set('titre', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea className={INPUT} rows={2} value={f('description')} onChange={(e) => set('description', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Type</label>
                <select className={INPUT} value={f('type_document')} onChange={(e) => set('type_document', e.target.value)}>
                  <option value="">— Choisir —</option>
                  {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">URL du fichier</label>
                <input className={INPUT} placeholder="https://..." value={f('url_fichier')} onChange={(e) => set('url_fichier', e.target.value)} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="checkbox" checked={!!form.actif} onChange={(e) => set('actif', e.target.checked)} />
                  Actif (visible sur le site)
                </label>
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
