"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Mail } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Inscription = {
  id: string;
  statut: string;
  type_paiement: string;
  montant: number | null;
  devise: string;
  numero_bon: string | null;
  created_at: string;
  confirmed_at: string | null;
  apprenants: { nom: string; prenom: string; email: string };
  sessions: { date_debut: string; formations: { titre: string } };
};

type Props = { inscriptions: Inscription[] };

export default function InscriptionsAdmin({ inscriptions }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState<"confirmed" | "pending">("pending");
  const [loading, setLoading] = useState<string | null>(null);

  const confirmed = inscriptions.filter((i) => i.statut === "confirme");
  const pending = inscriptions.filter((i) => i.statut === "en_attente");

  async function handleAction(id: string, action: "confirmer" | "annuler") {
    setLoading(id);
    try {
      const res = await fetch("/api/admin/inscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error();
      showToast(action === "confirmer" ? "Inscription confirmée" : "Inscription annulée");
      router.refresh();
    } catch {
      showToast("Erreur", "error");
    } finally {
      setLoading(null);
    }
  }

  function isOverdue(createdAt: string) {
    return Date.now() - new Date(createdAt).getTime() > 48 * 60 * 60 * 1000;
  }

  const current = tab === "pending" ? pending : confirmed;

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors ${
            tab === "pending" ? "bg-gesthorest-accent text-white" : "text-gesthorest-text hover:bg-gesthorest-light"
          }`}
        >
          En attente
          {pending.length > 0 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{pending.length}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("confirmed")}
          className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors ${
            tab === "confirmed" ? "bg-gesthorest-accent text-white" : "text-gesthorest-text hover:bg-gesthorest-light"
          }`}
        >
          Confirmées
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{confirmed.length}</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gesthorest-light">
            <tr>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Apprenant</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Formation</th>
              <th className="hidden px-4 py-3 font-medium text-gesthorest-text sm:table-cell">Montant</th>
              {tab === "pending" && (
                <th className="hidden px-4 py-3 font-medium text-gesthorest-text md:table-cell">N° Bon</th>
              )}
              <th className="px-4 py-3 font-medium text-gesthorest-text">Date</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {current.map((ins) => (
              <tr key={ins.id} className={`hover:bg-gesthorest-light/50 ${tab === "pending" && isOverdue(ins.created_at) ? "bg-red-50/50" : ""}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-gesthorest-primary">
                    {ins.apprenants.prenom} {ins.apprenants.nom}
                  </p>
                  <p className="text-xs text-gesthorest-text-light">{ins.apprenants.email}</p>
                </td>
                <td className="px-4 py-3 text-gesthorest-text">{ins.sessions?.formations?.titre}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {ins.montant ? `${ins.montant.toLocaleString("fr-FR")} ${ins.devise}` : "—"}
                </td>
                {tab === "pending" && (
                  <td className="hidden px-4 py-3 font-mono text-xs md:table-cell">{ins.numero_bon || "—"}</td>
                )}
                <td className="px-4 py-3 text-gesthorest-text-light">
                  {new Date(ins.created_at).toLocaleDateString("fr-FR")}
                  {tab === "pending" && isOverdue(ins.created_at) && (
                    <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-red-500" title="> 48h sans action" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {tab === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(ins.id, "confirmer")}
                        disabled={loading === ins.id}
                        className="rounded bg-green-100 p-1.5 text-green-700 hover:bg-green-200"
                        title="Confirmer"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        className="rounded bg-blue-100 p-1.5 text-blue-700 hover:bg-blue-200"
                        title="Relancer par email"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(ins.id, "annuler")}
                        disabled={loading === ins.id}
                        className="rounded bg-red-100 p-1.5 text-red-700 hover:bg-red-200"
                        title="Annuler"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gesthorest-text-light">
                      {ins.type_paiement === "en_ligne" ? "En ligne" : "Cabinet"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gesthorest-text-light">
                  Aucune inscription {tab === "pending" ? "en attente" : "confirmée"}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
