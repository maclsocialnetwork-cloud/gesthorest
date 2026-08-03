"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Ban, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Utilisateur = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  role: string;
  statut: string;
  created_at: string;
};

type Props = { utilisateurs: Utilisateur[] };

type StatutFilter = "tous" | "en_attente" | "actif" | "bloque";

const STATUT_BADGE: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-yellow-100 text-yellow-700" },
  actif: { label: "Actif", cls: "bg-green-100 text-green-700" },
  bloque: { label: "Bloqué", cls: "bg-red-100 text-red-700" },
};

export default function UtilisateursAdmin({ utilisateurs }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<StatutFilter>("tous");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered =
    filter === "tous"
      ? utilisateurs
      : utilisateurs.filter((u) => u.statut === filter);

  const counts = {
    tous: utilisateurs.length,
    en_attente: utilisateurs.filter((u) => u.statut === "en_attente").length,
    actif: utilisateurs.filter((u) => u.statut === "actif").length,
    bloque: utilisateurs.filter((u) => u.statut === "bloque").length,
  };

  async function changeStatut(id: string, statut: string) {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/apprenants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, statut }),
      });
      if (!res.ok) throw new Error();
      const labels: Record<string, string> = {
        actif: "Compte validé",
        bloque: "Compte bloqué",
        en_attente: "Remis en attente",
      };
      showToast(labels[statut] || "Mis à jour");
      router.refresh();
    } catch {
      showToast("Erreur", "error");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement ce compte ?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/apprenants?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Compte supprimé");
      router.refresh();
    } catch {
      showToast("Erreur", "error");
    } finally {
      setLoadingId(null);
    }
  }

  const TABS: { key: StatutFilter; label: string }[] = [
    { key: "tous", label: `Tous (${counts.tous})` },
    { key: "en_attente", label: `En attente (${counts.en_attente})` },
    { key: "actif", label: `Actifs (${counts.actif})` },
    { key: "bloque", label: `Bloqués (${counts.bloque})` },
  ];

  return (
    <div>
      {counts.en_attente > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <span className="font-semibold">{counts.en_attente}</span> compte(s) en attente de validation.
        </div>
      )}

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.key
                ? "bg-gesthorest-primary text-white"
                : "bg-white text-gesthorest-text shadow-sm hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gesthorest-light">
            <tr>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Nom</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Email</th>
              <th className="hidden px-4 py-3 font-medium text-gesthorest-text sm:table-cell">Téléphone</th>
              <th className="hidden px-4 py-3 font-medium text-gesthorest-text md:table-cell">Entreprise</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Statut</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Inscrit le</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((u) => {
              const badge = STATUT_BADGE[u.statut] ?? { label: u.statut, cls: "bg-gray-100 text-gray-600" };
              const isLoading = loadingId === u.id;
              return (
                <tr key={u.id} className="hover:bg-gesthorest-light/50">
                  <td className="px-4 py-3 font-medium text-gesthorest-primary">
                    {u.prenom} {u.nom}
                  </td>
                  <td className="px-4 py-3 text-gesthorest-text-light">{u.email}</td>
                  <td className="hidden px-4 py-3 text-gesthorest-text-light sm:table-cell">
                    {u.telephone || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-gesthorest-text-light md:table-cell">
                    {u.entreprise || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gesthorest-text-light">
                    {new Date(u.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {u.statut === "en_attente" && (
                        <>
                          <button
                            type="button"
                            title="Valider l'accès"
                            disabled={isLoading}
                            onClick={() => changeStatut(u.id, "actif")}
                            className="rounded p-1 text-green-600 hover:bg-green-50 disabled:opacity-40"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            type="button"
                            title="Rejeter la demande"
                            disabled={isLoading}
                            onClick={() => changeStatut(u.id, "bloque")}
                            className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-40"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {u.statut === "actif" && (
                        <button
                          type="button"
                          title="Bloquer"
                          disabled={isLoading}
                          onClick={() => changeStatut(u.id, "bloque")}
                          className="rounded p-1 text-orange-500 hover:bg-orange-50 disabled:opacity-40"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      {u.statut === "bloque" && (
                        <button
                          type="button"
                          title="Débloquer"
                          disabled={isLoading}
                          onClick={() => changeStatut(u.id, "actif")}
                          className="rounded p-1 text-green-600 hover:bg-green-50 disabled:opacity-40"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Supprimer définitivement"
                        disabled={isLoading}
                        onClick={() => handleDelete(u.id)}
                        className="rounded p-1 text-red-400 hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gesthorest-text-light">
                  Aucun apprenant dans cette catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
