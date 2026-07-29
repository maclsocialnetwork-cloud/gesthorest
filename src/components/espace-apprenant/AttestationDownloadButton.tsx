"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function AttestationDownloadButton({
  inscriptionId,
  formationTitre,
}: {
  inscriptionId: string;
  formationTitre: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/espace-apprenant/attestation?inscriptionId=${inscriptionId}`);
      if (!res.ok) throw new Error("Erreur");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Attestation_${formationTitre.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors du téléchargement de l'attestation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="btn-primary flex items-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {loading ? "Génération…" : "Télécharger l'attestation"}
    </button>
  );
}
