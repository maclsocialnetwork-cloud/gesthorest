import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Award } from "lucide-react";
import AttestationDownloadButton from "@/components/espace-apprenant/AttestationDownloadButton";

type InscriptionAttestation = {
  id: string;
  sessions: {
    date_debut: string;
    date_fin: string;
    formations: { titre: string; duree: string };
  };
};

export default async function MesAttestationsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/espace-apprenant/connexion");

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("id, nom, prenom")
    .eq("user_id", user.id)
    .single();

  let completedFormations: InscriptionAttestation[] = [];

  if (apprenant) {
    const { data } = await supabase
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
      .eq("apprenant_id", apprenant.id)
      .eq("statut", "confirme");

    if (data) {
      const now = new Date();
      completedFormations = (data as unknown as InscriptionAttestation[]).filter((ins) => {
        const dateFin = ins.sessions?.date_fin;
        return dateFin && new Date(dateFin) <= now;
      });
    }
  }

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-gesthorest-primary">
        Mes attestations
      </h2>

      {completedFormations.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <Award size={40} className="mx-auto mb-3 text-gesthorest-text-light" />
          <p className="text-gesthorest-text-light">
            Vos attestations seront disponibles après la fin de vos formations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedFormations.map((ins) => {
            const session = ins.sessions;
            const formation = session?.formations;
            return (
              <div key={ins.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-5 shadow-sm">
                <div>
                  <h3 className="font-heading text-base font-semibold text-gesthorest-primary">
                    {formation?.titre || "Formation"}
                  </h3>
                  <p className="mt-1 text-sm text-gesthorest-text-light">
                    Du{" "}
                    {new Date(session.date_debut).toLocaleDateString("fr-FR")}
                    {" au "}
                    {new Date(session.date_fin).toLocaleDateString("fr-FR")}
                    {" · "}
                    {formation?.duree}
                  </p>
                </div>
                <AttestationDownloadButton
                  inscriptionId={ins.id}
                  formationTitre={formation?.titre || "Formation"}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
