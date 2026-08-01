"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Evenement = {
  id: string;
  titre: string;
  description: string | null;
  date_evenement: string | null;
  lieu: string | null;
  places: number | null;
  prix: number | null;
  devise: string | null;
  statut: string | null;
};

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none";
const STATUTS = ["publie", "brouillon", "annule"];

export default function EvenementsAdmin({ evenements }: { evenements: Evenement[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  function f(key: string) { return String(form[key] ?? ""); }
  function set(key: string, v: unknown) { setForm((p) => ({ ...p, [key]: v })); }

  function openNew() { setEditingId(null); setForm({ statut: "publie", places: 50, devise: "FCFA" }); setShowModal(true); }
  function openEdit(e: Evenement) { setEditingId(e.id); setForm({ ...e }); setShowModal(true); }

  async function handleSave() {
    setLoading(true);
    try {
      const payload = { ...form, _table: "evenements", ...(editingId ? { _id: editingId } : {}) };
      const res = await fetch("/api/admin/contenus", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Événement mis à jour" : "Événement créé");
      setShowModal(false);
      router.refresh();
    } catch { showToast("Erreur", "error"); }
    finally { setLoading(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet événement ?")) return;
    const res = await fetch(`/api/admin/contenus?table=evenements&id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Supprimé"); router.refresh(); }
    else showToast("Erreur", "error");
  }

  function formatDate(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gesthorest-text-light">{evenements.length} événement(s)</p>
        <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nouvel événement
        </button>
      </div>

      <div className="space-y-3">
        {evenements.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center text-sm text-gesthorest-text-light shadow-sm">
            Aucun événement. Créez le premier.
          </div>
        )}
        {evenements.map((ev) => (
          <div key={ev.id} className="flex items-start justify-between rounded-lg bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold text-gesthorest-primary">{ev.titre}</p>
              <p className="mt-0.5 text-xs text-gesthorest-text-light">
                {formatDate(ev.date_evenement)} · {ev.lieu ?? "Lieu non défini"}
              </p>
              <div className="mt-1 flex gap-2">
                {ev.places && (
                  <span className="rounded-full bg-gesthorest-light px-2 py-0.5 text-xs text-gesthorest-primary">{ev.places} places</span>
                )}
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  ev.statut === "publie" ? "bg-green-100 text-green-700"
                  : ev.statut === "brouillon" ? "bg-gray-100 text-gray-500"
                  : "bg-red-100 text-red-600"
                }`}>{ev.statut ?? "—"}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button type="button" onClick={() => openEdit(ev)} className="text-gesthorest-primary hover:text-gesthorest-accent">
                <Pencil size={15} />
              </button>
              <button type="button" onClick={() => handleDelete(ev.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 font-heading text-lg font-semibold text-gesthorest-primary">
              {editingId ? "Modifier l'événement" : "Nouvel événement"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Titre</label>
                <input type="text" className={INPUT} value={f("titre")} onChange={(e) => set("titre", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Description</label>
                <textarea rows={3} className={INPUT} value={f("description")} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Date</label>
                <input type="date" className={INPUT} value={f("date_evenement")} onChange={(e) => set("date_evenement", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Lieu</label>
                <input type="text" className={INPUT} value={f("lieu")} onChange={(e) => set("lieu", e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Places</label>
                  <input type="number" className={INPUT} value={f("places")} onChange={(e) => set("places", Number(e.target.value))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Prix</label>
                  <input type="number" className={INPUT} value={f("prix")} onChange={(e) => set("prix", Number(e.target.value))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Devise</label>
                  <select className={INPUT} value={f("devise")} onChange={(e) => set("devise", e.target.value)}>
                    <option value="FCFA">FCFA</option>
                    <option value="EUR">EUR</option>
                  </select>
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
