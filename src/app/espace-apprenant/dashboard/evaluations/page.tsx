import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getApprenantId } from "@/lib/apprenant-session";
import { Star } from "lucide-react";
import EvaluationForm from "@/components/espace-apprenant/EvaluationForm";

type InscriptionToEvaluate = {
  id: string;
  sessions: {
    date_fin: string;
    formations: { titre: string; domaine: string };
  };
};

type EvaluationRow = {
  inscription_id: string;
  note: number;
  commentaire: string | null;
  created_at: string;
};

export default async function MesEvaluationsPage() {
  const apprenantId = getApprenantId();
  if (!apprenantId) redirect("/espace-apprenant/connexion");

  const supabase = createAdminClient();

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("id")
    .eq("id", apprenantId)
    .eq("statut", "actif")
    .single();

  if (!apprenant) redirect("/espace-apprenant/connexion");

  let formationsToEvaluate: InscriptionToEvaluate[] = [];
  let existingEvaluations: EvaluationRow[] = [];

  const now = new Date().toISOString();

  const { data: inscriptions } = await supabase
    .from("inscriptions")
    .select(`
      id,
      sessions (
        date_fin,
        formations (
          titre,
          domaine
        )
      )
    `)
    .eq("apprenant_id", apprenant.id)
    .eq("statut", "confirme");

  const { data: evals } = await supabase
    .from("evaluations")
    .select("inscription_id, note, commentaire, created_at");

  existingEvaluations = (evals ?? []) as unknown as EvaluationRow[];
  const evaluatedIds = new Set(existingEvaluations.map((e) => e.inscription_id));

  if (inscriptions) {
    formationsToEvaluate = (inscriptions as unknown as InscriptionToEvaluate[]).filter((ins) => {
      const dateFin = ins.sessions?.date_fin;
      return dateFin && new Date(dateFin) <= new Date(now) && !evaluatedIds.has(ins.id);
    });
  }

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-gesthorest-primary">
        Mes évaluations
      </h2>

      {formationsToEvaluate.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gesthorest-accent">
            Formations à évaluer
          </h3>
          <div className="space-y-4">
            {formationsToEvaluate.map((ins) => (
              <div key={ins.id} className="rounded-lg bg-white p-5 shadow-sm">
                <h4 className="mb-3 font-heading text-base font-semibold text-gesthorest-primary">
                  {ins.sessions?.formations?.titre || "Formation"}
                </h4>
                <EvaluationForm inscriptionId={ins.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {existingEvaluations.length > 0 ? (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gesthorest-text-light">
            Évaluations soumises
          </h3>
          <div className="space-y-3">
            {existingEvaluations.map((ev) => (
              <div key={ev.inscription_id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= ev.note
                          ? "fill-gesthorest-accent text-gesthorest-accent"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="ml-2 text-sm text-gesthorest-text-light">
                    {new Date(ev.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {ev.commentaire && (
                  <p className="mt-2 text-sm text-gesthorest-text">{ev.commentaire}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : formationsToEvaluate.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <Star size={40} className="mx-auto mb-3 text-gesthorest-text-light" />
          <p className="text-gesthorest-text-light">
            Aucune évaluation à effectuer pour le moment.
          </p>
        </div>
      ) : null}
    </div>
  );
}
