"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Globe, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Article = {
  id: string;
  titre: string;
  slug: string | null;
  contenu: string | null;
  image_url: string | null;
  categorie: string | null;
  statut: string | null;
  created_at: string;
};

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none";

export default function ArticlesAdmin({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  function f(key: string) { return String(form[key] ?? ""); }
  function set(key: string, v: unknown) { setForm((p) => ({ ...p, [key]: v })); }

  function openNew() { setEditingId(null); setForm({ statut: "brouillon" }); setShowModal(true); }
  function openEdit(a: Article) { setEditingId(a.id); setForm({ ...a }); setShowModal(true); }

  async function handleSave() {
    setLoading(true);
    try {
      const payload = { ...form, _table: "articles", ...(editingId ? { _id: editingId } : {}) };
      const res = await fetch("/api/admin/contenus", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Article mis à jour" : "Article créé");
      setShowModal(false);
      router.refresh();
    } catch { showToast("Erreur", "error"); }
    finally { setLoading(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    const res = await fetch(`/api/admin/contenus?table=articles&id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Article supprimé"); router.refresh(); }
    else showToast("Erreur", "error");
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gesthorest-text-light">{articles.length} article(s)</p>
        <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nouvel article
        </button>
      </div>

      <div className="space-y-3">
        {articles.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center text-sm text-gesthorest-text-light shadow-sm">
            Aucun article. Créez le premier.
          </div>
        )}
        {articles.map((a) => (
          <div key={a.id} className="flex items-start justify-between rounded-lg bg-white p-4 shadow-sm">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gesthorest-primary truncate">{a.titre}</p>
                {a.statut === "publie" ? (
                  <Globe size={13} className="shrink-0 text-green-500" />
                ) : (
                  <EyeOff size={13} className="shrink-0 text-gray-400" />
                )}
              </div>
              <p className="mt-0.5 text-xs text-gesthorest-text-light">
                {new Date(a.created_at).toLocaleDateString("fr-FR")}
                {a.categorie && ` · ${a.categorie}`}
                {" · "}{a.statut ?? "brouillon"}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button type="button" onClick={() => openEdit(a)} className="text-gesthorest-primary hover:text-gesthorest-accent">
                <Pencil size={15} />
              </button>
              <button type="button" onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 font-heading text-lg font-semibold text-gesthorest-primary">
              {editingId ? "Modifier l'article" : "Nouvel article"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Titre</label>
                <input type="text" className={INPUT} value={f("titre")} onChange={(e) => set("titre", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Catégorie</label>
                <input type="text" className={INPUT} value={f("categorie")} onChange={(e) => set("categorie", e.target.value)} placeholder="Actualités, Formation, RH…" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Contenu</label>
                <textarea rows={8} className={INPUT} value={f("contenu")} onChange={(e) => set("contenu", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">URL image</label>
                <input type="url" className={INPUT} value={f("image_url")} onChange={(e) => set("image_url", e.target.value)} placeholder="https://…" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Statut</label>
                <select className={INPUT} value={f("statut")} onChange={(e) => set("statut", e.target.value)}>
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">Publié</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="rounded px-4 py-2 text-sm text-gesthorest-text hover:bg-gray-100">
                Annuler
              </button>
              <button type="button" onClick={handleSave} disabled={loading} className="btn-primary text-sm disabled:opacity-60">
                {loading ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
