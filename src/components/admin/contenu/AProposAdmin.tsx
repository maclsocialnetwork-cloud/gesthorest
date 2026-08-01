"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Save, Users, FileText } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Membre = {
  id: string; nom: string; prenom: string; titre: string | null;
  bio: string | null; photo_url: string | null; ordre: number | null; actif: boolean | null;
};

type Props = { equipe: Membre[]; settings: Record<string, string> };

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-gesthorest-accent focus:outline-none";

const TEXTES_KEYS = [
  { cle: "mission", label: "Mission" },
  { cle: "vision", label: "Vision" },
  { cle: "valeurs", label: "Valeurs (une par ligne)" },
  { cle: "certifications_texte", label: "Certifications" },
];

export default function AProposAdmin({ equipe, settings }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState<"equipe" | "textes">("equipe");

  // Équipe state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loadingMembre, setLoadingMembre] = useState(false);

  // Textes state
  const [textes, setTextes] = useState<Record<string, string>>(settings);
  const [loadingTextes, setLoadingTextes] = useState(false);

  function f(key: string) { return String(form[key] ?? ""); }
  function setF(key: string, v: unknown) { setForm((p) => ({ ...p, [key]: v })); }

  function openNew() {
    setEditingId(null);
    setForm({ actif: true, ordre: equipe.length + 1 });
    setShowModal(true);
  }

  function openEdit(m: Membre) {
    setEditingId(m.id);
    setForm({ ...m });
    setShowModal(true);
  }

  async function handleSaveMembre() {
    setLoadingMembre(true);
    try {
      const payload = { ...form, _table: "equipe", ...(editingId ? { _id: editingId } : {}) };
      const res = await fetch("/api/admin/contenus", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Membre mis à jour" : "Membre ajouté");
      setShowModal(false);
      router.refresh();
    } catch { showToast("Erreur", "error"); }
    finally { setLoadingMembre(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce membre ?")) return;
    const res = await fetch(`/api/admin/contenus?table=equipe&id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Supprimé"); router.refresh(); }
    else showToast("Erreur", "error");
  }

  async function handleSaveTextes() {
    setLoadingTextes(true);
    try {
      const settings = TEXTES_KEYS.map((k) => ({ cle: k.cle, valeur: textes[k.cle] || "" }));
      const res = await fetch("/api/admin/parametres", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error();
      showToast("Textes enregistrés");
      router.refresh();
    } catch { showToast("Erreur", "error"); }
    finally { setLoadingTextes(false); }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("equipe")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "equipe" ? "bg-gesthorest-primary text-white" : "bg-white text-gesthorest-text shadow-sm hover:bg-gray-50"
          }`}
        >
          <Users size={15} /> Équipe
        </button>
        <button
          type="button"
          onClick={() => setTab("textes")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "textes" ? "bg-gesthorest-primary text-white" : "bg-white text-gesthorest-text shadow-sm hover:bg-gray-50"
          }`}
        >
          <FileText size={15} /> Mission / Vision / Valeurs
        </button>
      </div>

      {tab === "equipe" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gesthorest-text-light">{equipe.length} membre(s)</p>
            <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} /> Ajouter un membre
            </button>
          </div>

          <div className="space-y-3">
            {equipe.length === 0 && (
              <div className="rounded-lg bg-white p-8 text-center text-sm text-gesthorest-text-light shadow-sm">
                Aucun membre. Ajoutez le premier.
              </div>
            )}
            {equipe.map((m) => (
              <div key={m.id} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                {m.photo_url ? (
                  <img src={m.photo_url} alt="" className="h-12 w-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gesthorest-light flex items-center justify-center shrink-0 text-gesthorest-primary font-bold">
                    {m.prenom?.[0]}{m.nom?.[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gesthorest-primary">{m.prenom} {m.nom}</p>
                  <p className="text-xs text-gesthorest-text-light">{m.titre ?? "—"}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => openEdit(m)} className="text-gesthorest-primary hover:text-gesthorest-accent">
                    <Pencil size={15} />
                  </button>
                  <button type="button" onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "textes" && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {TEXTES_KEYS.map((key) => (
              <div key={key.cle}>
                <label className="mb-1 block text-sm font-medium text-gesthorest-text">{key.label}</label>
                <textarea
                  rows={key.cle === "valeurs" ? 4 : 3}
                  className={INPUT}
                  value={textes[key.cle] || ""}
                  onChange={(e) => setTextes((p) => ({ ...p, [key.cle]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSaveTextes}
              disabled={loadingTextes}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60"
            >
              <Save size={16} />
              {loadingTextes ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 font-heading text-lg font-semibold text-gesthorest-primary">
              {editingId ? "Modifier le membre" : "Nouveau membre"}
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Prénom</label>
                  <input type="text" className={INPUT} value={f("prenom")} onChange={(e) => setF("prenom", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Nom</label>
                  <input type="text" className={INPUT} value={f("nom")} onChange={(e) => setF("nom", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Titre / Poste</label>
                <input type="text" className={INPUT} value={f("titre")} onChange={(e) => setF("titre", e.target.value)} placeholder="Directeur Général" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">Biographie</label>
                <textarea rows={4} className={INPUT} value={f("bio")} onChange={(e) => setF("bio", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gesthorest-text">URL photo</label>
                <input type="url" className={INPUT} value={f("photo_url")} onChange={(e) => setF("photo_url", e.target.value)} placeholder="https://…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gesthorest-text">Ordre</label>
                  <input type="number" className={INPUT} value={f("ordre")} onChange={(e) => setF("ordre", Number(e.target.value))} />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="actif"
                    checked={Boolean(form.actif)}
                    onChange={(e) => setF("actif", e.target.checked)}
                    className="h-4 w-4 accent-gesthorest-accent"
                  />
                  <label htmlFor="actif" className="text-sm text-gesthorest-text">Afficher sur le site</label>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="rounded px-4 py-2 text-sm text-gesthorest-text hover:bg-gray-100">
                Annuler
              </button>
              <button type="button" onClick={handleSaveMembre} disabled={loadingMembre} className="btn-primary text-sm disabled:opacity-60">
                {loadingMembre ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
