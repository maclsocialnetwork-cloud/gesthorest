'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'

type Tab = 'temoignages' | 'articles'

type Temoignage = {
  id: string; nom: string; entreprise: string; texte: string;
  note: number | null; photo_url: string | null; actif: boolean | null;
}
type Article = {
  id: string; titre: string; categorie: string | null;
  statut: string | null; image_url: string | null; contenu: string | null;
}

const INPUT = 'w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none'

export default function AccueilEditor({
  temoignages, articles,
}: { temoignages: Temoignage[]; articles: Article[] }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [tab, setTab] = useState<Tab>('temoignages')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(false)

  const table = tab === 'temoignages' ? 'temoignages' : 'articles'

  function openNew() { setEditingId(null); setForm({}); setShowModal(true) }
  function openEdit(item: Record<string, unknown>) {
    setEditingId(item.id as string); setForm({ ...item }); setShowModal(true)
  }

  async function handleSave() {
    setLoading(true)
    try {
      const payload = { ...form, _table: table, ...(editingId ? { _id: editingId } : {}) }
      const res = await fetch('/api/admin/contenus', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      showToast(editingId ? 'Mis à jour' : 'Créé')
      setShowModal(false)
      router.refresh()
    } catch { showToast('Erreur', 'error') }
    finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ?')) return
    const res = await fetch(`/api/admin/contenus?table=${table}&id=${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Supprimé'); router.refresh() }
    else showToast('Erreur', 'error')
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-white p-1 shadow-sm">
          {(['temoignages', 'articles'] as Tab[]).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`rounded px-4 py-2 text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-gesthorest-accent text-white' : 'text-gesthorest-text hover:bg-gesthorest-light'}`}>
              {t === 'temoignages' ? 'Témoignages' : 'Articles'}
            </button>
          ))}
        </div>
        <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {tab === 'temoignages' && (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gesthorest-light">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Entreprise</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Actif</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {temoignages.map((t) => (
                <tr key={t.id} className="hover:bg-gesthorest-light/50">
                  <td className="px-4 py-3 font-medium">{t.nom}</td>
                  <td className="px-4 py-3 text-gesthorest-text-light">{t.entreprise}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <Star size={13} className="fill-yellow-400 text-yellow-400" />{t.note ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {t.actif ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t as unknown as Record<string, unknown>)} className="text-gesthorest-accent hover:opacity-70"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {temoignages.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gesthorest-text-light">Aucun témoignage.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'articles' && (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gesthorest-light">
              <tr>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gesthorest-light/50">
                  <td className="px-4 py-3 font-medium">{a.titre}</td>
                  <td className="px-4 py-3 text-gesthorest-text-light">{a.categorie ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${a.statut === 'publié' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {a.statut ?? 'brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(a as unknown as Record<string, unknown>)} className="text-gesthorest-accent hover:opacity-70"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gesthorest-text-light">Aucun article.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 font-heading text-lg font-bold text-gesthorest-primary">
              {editingId ? 'Modifier' : 'Ajouter'} — {tab === 'temoignages' ? 'Témoignage' : 'Article'}
            </h3>
            <div className="space-y-3">
              {tab === 'temoignages' ? (
                <>
                  {[
                    { key: 'nom', label: 'Nom complet' },
                    { key: 'entreprise', label: 'Entreprise' },
                    { key: 'photo_url', label: 'URL Photo' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="mb-1 block text-sm font-medium">{label}</label>
                      <input className={INPUT} value={(form[key] as string) ?? ''}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block text-sm font-medium">Texte</label>
                    <textarea className={INPUT} rows={3} value={(form.texte as string) ?? ''}
                      onChange={(e) => setForm({ ...form, texte: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Note (1-5)</label>
                    <input type="number" min={1} max={5} className={INPUT}
                      value={(form.note as number) ?? ''}
                      onChange={(e) => setForm({ ...form, note: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input type="checkbox" checked={!!form.actif}
                        onChange={(e) => setForm({ ...form, actif: e.target.checked })} />
                      Actif (visible sur le site)
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Titre</label>
                    <input className={INPUT} value={(form.titre as string) ?? ''}
                      onChange={(e) => setForm({ ...form, titre: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Catégorie</label>
                    <input className={INPUT} value={(form.categorie as string) ?? ''}
                      onChange={(e) => setForm({ ...form, categorie: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">URL Image</label>
                    <input className={INPUT} value={(form.image_url as string) ?? ''}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Contenu</label>
                    <textarea className={INPUT} rows={5} value={(form.contenu as string) ?? ''}
                      onChange={(e) => setForm({ ...form, contenu: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Statut</label>
                    <select className={INPUT} value={(form.statut as string) ?? 'brouillon'}
                      onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                      <option value="brouillon">Brouillon</option>
                      <option value="publié">Publié</option>
                    </select>
                  </div>
                </>
              )}
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
