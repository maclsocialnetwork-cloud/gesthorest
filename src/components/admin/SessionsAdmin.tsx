"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Session = {
  id: string;
  formation_id: string;
  date_debut: string;
  date_fin: string;
  lieu: string | null;
  places_total: number | null;
  places_restantes: number | null;
  statut: string | null;
};

type Formation = { id: string; titre: string };

type Props = { sessions: Session[]; formations: Formation[] };

const STATUTS = ["ouverte", "complete", "annulee"];
const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none";

export default function SessionsAdmin({ sessions, formations }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  function f(key: string) { return String(form[key] ?? ""); }
  function set(key: string, v: unknown) { setForm((p) => ({ ...p, [key]: v })); }

  function openNew() {
    setEditingId(null);
    setForm({ statut: "ouverte", places_total: 20, places_restantes: 20, lieu: "Abidjan" });
    setShowModal(true);
  }

  function openEdit(s: Session) { setEditingId(s.id); setForm({ ...s }); setShowModal(true); }

  async function handleSave() {
    setLoading(true);
    try {
      const payload = { ...form, _table: "sessions", ...(editingId ? { _id: editingId } : {}) };
      const res = await fetch("/api/admin/contenus", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Session mise à jour" : "Session créée");
      setShowModal(false);
      router.refresh();
    } catch { showToast("Erreur", "error"); }
    finally { setLoading(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette session ?")) return;
    const res = await fetch(`/api/admin/contenus?table=sessions&id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Session supprimée"); router.refresh(); }
    else showToast("Erreur", "error");
  }

  function titreFormation(fid: string) {
    return formations.find((f) => f.id === fid)?.titre ?? "—";
  }

  function formatDate(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gesthorest-text-light">{sessions.length} session(s)</p>
        <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nouvelle session
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs text-gesthorest-text-light">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Formation</th>
              <th className="px-4 py-3 text-left font-medium">Début</th>
              <th className="px-4 py-3 text-left font-medium">Fin</th>
              <th className="px-4 py-3 text-left font-medium">Lieu</th>
              <th className="px-4 py-3 text-left font-medium">Places</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sessions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gesthorest-text-light">
                  Aucune session. Créez la première.
                </td>
              </tr>
            )}
            {sessions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-gesthorest-primary">{titreFormation(s.formation_id)}</td>
                <td className="px-4 py-3">{formatDate(s.date_debut)}</td>
                <td className="px-4 py-3">{formatDate(s.date_fin)}</td>
                <td className="px-4 py-3 text-gesthorest-text-light">{s.lieu ?? "—"}</td>
                <td className="px-4 py-3">
                  {s.places_restantes ?? 0}/{s.places_total ?? "?"}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.statut === "ouverte" ? "bg-green-100 text-green-700"
                    : s.statut === "complete" ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-600"
                  }`}>
                    {s.statut ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(s)} className="text-gesthorest-primary hover:text-gesthorest-accent">
                      <Pencil size={15} />
                    </button>
                    <button type="button" onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 font-heading text-lg font-semibold text-gesthorest-primary">
              {editingId ? "Modifier la session" : "Nouvelle session"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Formation</label>
                <select className={INPUT} value={f("formation_id")} onChange={(e) => set("formation_id", e.target.value)}>
                  <option value="">— Choisir —</option>
                  {formations.map((fo) => (
                    <option key={fo.id} value={fo.id}>{fo.titre}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Date début</label>
                  <input type="date" className={INPUT} value={f("date_debut")} onChange={(e) => set("date_debut", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Date fin</label>
                  <input type="date" className={INPUT} value={f("date_fin")} onChange={(e) => set("date_fin", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Lieu</label>
                <input type="text" className={INPUT} value={f("lieu")} onChange={(e) => set("lieu", e.target.value)} placeholder="Abidjan, Plateau" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Places total</label>
                  <input type="number" className={INPUT} value={f("places_total")} onChange={(e) => set("places_total", Number(e.target.value))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Places restantes</label>
                  <input type="number" className={INPUT} value={f("places_restantes")} onChange={(e) => set("places_restantes", Number(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Statut</label>
                <select className={INPUT} value={f("statut")} onChange={(e) => set("statut", e.target.value)}>
                  {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
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
