"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Archive } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Formation = {
  id: string;
  titre: string;
  domaine: string;
  format: string;
  duree: string;
  prix: number | null;
  devise: string;
  statut: string;
  description: string | null;
  programme: { titre: string; points: string[] }[] | null;
  objectifs: string[] | null;
  public_cible: string | null;
  prerequis: string | null;
};

type Props = {
  formations: Formation[];
  domainLabels: Record<string, string>;
};

const EMPTY: Formation = {
  id: "",
  titre: "",
  domaine: "management",
  format: "Présentiel",
  duree: "",
  prix: null,
  devise: "FCFA",
  statut: "brouillon",
  description: null,
  programme: null,
  objectifs: null,
  public_cible: null,
  prerequis: null,
};

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm text-gesthorest-text focus:border-gesthorest-accent focus:outline-none";

const statusBadge: Record<string, string> = {
  publiee: "bg-green-100 text-green-700",
  brouillon: "bg-gray-100 text-gray-600",
  archivee: "bg-red-100 text-red-600",
};

export default function FormationsAdmin({ formations, domainLabels }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Formation>(EMPTY);
  const [loading, setLoading] = useState(false);

  function openNew() {
    setEditing(EMPTY);
    setShowModal(true);
  }

  function openEdit(f: Formation) {
    setEditing(f);
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const isNew = !editing.id;
      const res = await fetch("/api/admin/formations", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      showToast(isNew ? "Formation créée" : "Formation mise à jour");
      setShowModal(false);
      router.refresh();
    } catch {
      showToast("Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleArchive(id: string) {
    const res = await fetch("/api/admin/formations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statut: "archivee" }),
    });
    if (res.ok) {
      showToast("Formation archivée");
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gesthorest-text-light">{formations.length} formation(s)</p>
        <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nouvelle formation
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gesthorest-light">
            <tr>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Titre</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Domaine</th>
              <th className="hidden px-4 py-3 font-medium text-gesthorest-text md:table-cell">Format</th>
              <th className="hidden px-4 py-3 font-medium text-gesthorest-text sm:table-cell">Prix</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Statut</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {formations.map((f) => (
              <tr key={f.id} className="hover:bg-gesthorest-light/50">
                <td className="px-4 py-3 font-medium text-gesthorest-primary">{f.titre}</td>
                <td className="px-4 py-3 text-gesthorest-text-light">{domainLabels[f.domaine] || f.domaine}</td>
                <td className="hidden px-4 py-3 text-gesthorest-text-light md:table-cell">{f.format}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {f.prix ? `${f.prix.toLocaleString("fr-FR")} ${f.devise}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[f.statut] || "bg-gray-100 text-gray-600"}`}>
                    {f.statut}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(f)} className="text-gesthorest-accent hover:underline" title="Modifier">
                      <Pencil size={16} />
                    </button>
                    {f.statut !== "archivee" && (
                      <button type="button" onClick={() => handleArchive(f.id)} className="text-red-400 hover:text-red-600" title="Archiver">
                        <Archive size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {formations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gesthorest-text-light">
                  Aucune formation enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 font-heading text-lg font-bold text-gesthorest-primary">
              {editing.id ? "Modifier la formation" : "Nouvelle formation"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Titre *</label>
                <input className={INPUT} value={editing.titre} onChange={(e) => setEditing({ ...editing, titre: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Domaine</label>
                  <select className={INPUT} value={editing.domaine} onChange={(e) => setEditing({ ...editing, domaine: e.target.value })}>
                    {Object.entries(domainLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Format</label>
                  <select className={INPUT} value={editing.format} onChange={(e) => setEditing({ ...editing, format: e.target.value })}>
                    <option>Présentiel</option>
                    <option>Distanciel</option>
                    <option>Blended</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Durée</label>
                  <input className={INPUT} value={editing.duree} onChange={(e) => setEditing({ ...editing, duree: e.target.value })} placeholder="3 jours" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Prix</label>
                  <input className={INPUT} type="number" value={editing.prix ?? ""} onChange={(e) => setEditing({ ...editing, prix: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Devise</label>
                  <input className={INPUT} value={editing.devise} onChange={(e) => setEditing({ ...editing, devise: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Statut</label>
                  <select className={INPUT} value={editing.statut} onChange={(e) => setEditing({ ...editing, statut: e.target.value })}>
                    <option value="brouillon">Brouillon</option>
                    <option value="publiee">Publiée</option>
                    <option value="archivee">Archivée</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea className={INPUT} rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Public cible</label>
                <input className={INPUT} value={editing.public_cible || ""} onChange={(e) => setEditing({ ...editing, public_cible: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Prérequis</label>
                <input className={INPUT} value={editing.prerequis || ""} onChange={(e) => setEditing({ ...editing, prerequis: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-sm">
                Annuler
              </button>
              <button type="button" onClick={handleSave} disabled={loading || !editing.titre} className="btn-primary text-sm disabled:opacity-60">
                {loading ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
