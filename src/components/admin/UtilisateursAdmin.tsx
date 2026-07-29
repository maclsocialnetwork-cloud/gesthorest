"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Shield, User, GraduationCap } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Utilisateur = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  role: string;
  created_at: string;
};

type Props = { utilisateurs: Utilisateur[] };

const INPUT = "w-full rounded border border-gray-200 px-3 py-2 text-sm text-gesthorest-text focus:border-gesthorest-accent focus:outline-none";

const ROLE_BADGE: Record<string, { label: string; cls: string; icon: typeof Shield }> = {
  admin: { label: "Admin", cls: "bg-red-100 text-red-700", icon: Shield },
  formateur: { label: "Formateur", cls: "bg-blue-100 text-blue-700", icon: GraduationCap },
  apprenant: { label: "Apprenant", cls: "bg-gray-100 text-gray-600", icon: User },
};

export default function UtilisateursAdmin({ utilisateurs }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", entreprise: "", role: "apprenant" });
  const [loading, setLoading] = useState(false);

  async function handleRoleChange(id: string, role: string) {
    const res = await fetch("/api/admin/utilisateurs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    if (res.ok) {
      showToast("Rôle mis à jour");
      router.refresh();
    } else {
      showToast("Erreur", "error");
    }
  }

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast("Utilisateur créé");
      setShowModal(false);
      setForm({ nom: "", prenom: "", email: "", telephone: "", entreprise: "", role: "apprenant" });
      router.refresh();
    } catch {
      showToast("Erreur lors de la création", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gesthorest-text-light">{utilisateurs.length} utilisateur(s)</p>
        <button type="button" onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Créer manuellement
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gesthorest-light">
            <tr>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Nom</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Email</th>
              <th className="hidden px-4 py-3 font-medium text-gesthorest-text sm:table-cell">Téléphone</th>
              <th className="hidden px-4 py-3 font-medium text-gesthorest-text md:table-cell">Entreprise</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Rôle</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {utilisateurs.map((u) => {
              const badge = ROLE_BADGE[u.role] || ROLE_BADGE.apprenant;
              return (
                <tr key={u.id} className="hover:bg-gesthorest-light/50">
                  <td className="px-4 py-3 font-medium text-gesthorest-primary">
                    {u.prenom} {u.nom}
                  </td>
                  <td className="px-4 py-3 text-gesthorest-text-light">{u.email}</td>
                  <td className="hidden px-4 py-3 text-gesthorest-text-light sm:table-cell">{u.telephone || "—"}</td>
                  <td className="hidden px-4 py-3 text-gesthorest-text-light md:table-cell">{u.entreprise || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls} cursor-pointer border-none outline-none`}
                    >
                      <option value="apprenant">Apprenant</option>
                      <option value="formateur">Formateur</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gesthorest-text-light">
                    {new Date(u.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              );
            })}
            {utilisateurs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gesthorest-text-light">
                  Aucun utilisateur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal création manuelle */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 font-heading text-lg font-bold text-gesthorest-primary">
              Créer un apprenant
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Nom *</label>
                  <input className={INPUT} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Prénom *</label>
                  <input className={INPUT} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email *</label>
                <input className={INPUT} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Téléphone</label>
                <input className={INPUT} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Entreprise</label>
                <input className={INPUT} value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Rôle</label>
                <select className={INPUT} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="apprenant">Apprenant</option>
                  <option value="formateur">Formateur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-sm">Annuler</button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={loading || !form.nom || !form.prenom || !form.email}
                className="btn-primary text-sm disabled:opacity-60"
              >
                {loading ? "Création…" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
