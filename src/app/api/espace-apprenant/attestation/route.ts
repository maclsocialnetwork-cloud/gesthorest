import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getApprenantId } from "@/lib/apprenant-session";
import { generateAttestationPdf } from "@/lib/pdf/attestation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inscriptionId = searchParams.get("inscriptionId");

  if (!inscriptionId) {
    return NextResponse.json({ error: "inscriptionId requis" }, { status: 400 });
  }

  const apprenantId = getApprenantId();
  if (!apprenantId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("id, nom, prenom")
    .eq("id", apprenantId)
    .eq("statut", "actif")
    .single();

  if (!apprenant) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  const { data: inscription } = await supabase
    .from("inscriptions")
    .select(`
      id,
      sessions (
        date_debut,
        date_fin,
        formations (
          titre,
          duree
        )
      )
    `)
    .eq("id", inscriptionId)
    .eq("apprenant_id", apprenant.id)
    .eq("statut", "confirme")
    .single();

  if (!inscription) {
    return NextResponse.json({ error: "Inscription non trouvée" }, { status: 404 });
  }

  const row = inscription as unknown as {
    id: string;
    sessions: {
      date_debut: string;
      date_fin: string;
      formations: { titre: string; duree: string };
    };
  };
  const session = row.sessions;
  const formation = session?.formations;

  const pdfBytes = await generateAttestationPdf({
    nom: apprenant.nom,
    prenom: apprenant.prenom,
    formationTitre: formation?.titre || "Formation",
    dateDebut: new Date(session.date_debut).toLocaleDateString("fr-FR"),
    dateFin: new Date(session.date_fin).toLocaleDateString("fr-FR"),
    duree: formation?.duree || "",
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Attestation_${apprenant.prenom}_${apprenant.nom}.pdf"`,
    },
  });
}
