"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type ContentTab = "articles" | "evenements" | "temoignages" | "equipe";

type Props = {
  articles: Record<string, unknown>[];
  evenements: Record<string, unknown>[];
  temoignages: Record<string, unknown>[];
  equipe: Record<string, unknown>[];
};

const TABS: { id: ContentTab; label: string }[] = [
  { id: "articles", label: "Articles" },
  { id: "evenements", label: "Événements" },
  { id: "temoignages", label: "Témoignages" },
  { id: "equipe", label: "Équipe" },
];

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm text-gesthorest-text focus:border-gesthorest-accent focus:outline-none";

const FIELDS: Record<ContentTab, { key: string; label: string; type?: string }[]> = {
  articles: [
    { key: "titre", label: "Titre" },
    { key: "contenu", label: "Contenu", type: "textarea" },
    { key: "image_url", label: "URL Image" },
    { key: "categorie", label: "Catégorie" },
    { key: "statut", label: "Statut" },
  ],
  evenements: [
    { key: "titre", label: "Titre" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "date_evenement", label: "Date", type: "date" },
    { key: "lieu", label: "Lieu" },
    { key: "places", label: "Places", type: "number" },
    { key: "prix", label: "Prix", type: "number" },
  ],
  temoignages: [
    { key: "nom", label: "Nom" },
    { key: "entreprise", label: "Entreprise" },
    { key: "texte", label: "Texte", type: "textarea" },
    { key: "note", label: "Note (1-5)", type: "number" },
    { key: "photo_url", label: "URL Photo" },
  ],
  equipe: [
    { key: "nom", label: "Nom" },
    { key: "prenom", label: "Prénom" },
    { key: "titre", label: "Titre / Poste" },
    { key: "bio", label: "Bio", type: "textarea" },
    { key: "photo_url", label: "URL Photo" },
    { key: "ordre", label: "Ordre d'affichage", type: "number" },
  ],
};

const COLUMNS: Record<ContentTab, string[]> = {
  articles: ["titre", "categorie", "statut"],
  evenements: ["titre", "date_evenement", "lieu"],
  temoignages: ["nom", "entreprise", "note"],
  equipe: ["prenom", "nom", "titre"],
};

export default function ContenusAdmin({ articles, evenements, temoignages, equipe }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState<ContentTab>("articles");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  const dataMap: Record<ContentTab, Record<string, unknown>[]> = {
    articles,
    evenements,
    temoignages,
    equipe,
  };

  const current = dataMap[tab];

  function openNew() {
    setEditingId(null);
    setForm({});
    setShowModal(true);
  }

  function openEdit(item: Record<string, unknown>) {
    setEditingId(item.id as string);
    setForm({ ...item });
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const isNew = !editingId;
      const payload = { ...form, _table: tab, ...(editingId ? { _id: editingId } : {}) };
      const res = await fetch("/api/admin/contenus", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(isNew ? "Contenu créé" : "Contenu mis à jour");
      setShowModal(false);
      router.refresh();
    } catch {
      showToast("Erreur", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce contenu ?")) return;
    const res = await fetch(`/api/admin/contenus?table=${tab}&id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Contenu supprimé");
      router.refresh();
    } else {
      showToast("Erreur", "error");
    }
  }

  function formatCell(value: unknown): string {
    if (value === null || value === undefined) return "—";
    if (typeof value === "number") return String(value);
    return String(value);
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-white p-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-gesthorest-accent text-white" : "text-gesthorest-text hover:bg-gesthorest-light"
            }`}
          >
            {t.label}
            <span className="ml-1 text-xs opacity-70">({dataMap[t.id].length})</span>
          </button>
        ))}
      </div>

      <div className="mb-4 flex justify-end">
        <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gesthorest-light">
            <tr>
              {COLUMNS[tab].map((col) => (
                <th key={col} className="px-4 py-3 font-medium capitalize text-gesthorest-text">
                  {col.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-gesthorest-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {current.map((item) => (
              <tr key={item.id as string} className="hover:bg-gesthorest-light/50">
                {COLUMNS[tab].map((col) => (
                  <td key={col} className="px-4 py-3 text-gesthorest-text">
                    {formatCell(item[col])}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(item)} className="text-gesthorest-accent hover:underline">
                      <Pencil size={16} />
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id as string)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan={COLUMNS[tab].length + 1} className="px-4 py-8 text-center text-gesthorest-text-light">
                  Aucun contenu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 font-heading text-lg font-bold text-gesthorest-primary">
              {editingId ? "Modifier" : "Ajouter"} — {TABS.find((t) => t.id === tab)?.label}
            </h3>
            <div className="space-y-3">
              {FIELDS[tab].map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      className={INPUT}
                      rows={3}
                      value={(form[field.key] as string) || ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      className={INPUT}
                      type={field.type || "text"}
                      value={(form[field.key] as string) ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.key]: field.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-sm">Annuler</button>
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
