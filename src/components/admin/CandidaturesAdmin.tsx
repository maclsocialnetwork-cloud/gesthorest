"use client";

import { useRouter } from "next/navigation";
import { FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Candidature = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste_souhaite: string;
  secteur: string | null;
  cv_url: string | null;
  statut: string;
  created_at: string;
};

type Props = { candidatures: Candidature[] };

const STATUS_OPTIONS = [
  { value: "recu", label: "Reçu", cls: "bg-gray-100 text-gray-600" },
  { value: "en_examen", label: "En examen", cls: "bg-blue-100 text-blue-700" },
  { value: "retenu", label: "Retenu", cls: "bg-green-100 text-green-700" },
  { value: "non_retenu", label: "Non retenu", cls: "bg-red-100 text-red-600" },
];

export default function CandidaturesAdmin({ candidatures }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleStatusChange(id: string, statut: string) {
    const res = await fetch("/api/admin/candidatures", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statut }),
    });
    if (res.ok) {
      showToast("Statut mis à jour");
      router.refresh();
    } else {
      showToast("Erreur", "error");
    }
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gesthorest-text-light">{candidatures.length} candidature(s)</p>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gesthorest-light">
            <tr>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Candidat</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Poste souhaité</th>
              <th className="hidden px-4 py-3 font-medium text-gesthorest-text sm:table-cell">Date</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">CV</th>
              <th className="px-4 py-3 font-medium text-gesthorest-text">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {candidatures.map((c) => {
              const status = STATUS_OPTIONS.find((s) => s.value === c.statut) || STATUS_OPTIONS[0];
              return (
                <tr key={c.id} className="hover:bg-gesthorest-light/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gesthorest-primary">{c.prenom} {c.nom}</p>
                    <p className="text-xs text-gesthorest-text-light">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gesthorest-text">{c.poste_souhaite}</td>
                  <td className="hidden px-4 py-3 text-gesthorest-text-light sm:table-cell">
                    {new Date(c.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    {c.cv_url ? (
                      <a
                        href={c.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gesthorest-accent hover:underline"
                      >
                        <FileText size={16} />
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-gesthorest-text-light">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={c.statut}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.cls} cursor-pointer border-none outline-none`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {candidatures.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gesthorest-text-light">
                  Aucune candidature.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
