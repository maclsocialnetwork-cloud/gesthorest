import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen, Calendar, MapPin, User as UserIcon } from "lucide-react";

type InscriptionRow = {
  id: string;
  statut: string;
  montant: number | null;
  devise: string;
  created_at: string;
  confirmed_at: string | null;
  sessions: {
    id: string;
    date_debut: string;
    date_fin: string;
    lieu: string;
    formations: { titre: string; domaine: string; format: string; duree: string };
    formateurs: { nom: string; prenom: string; titre: string } | null;
  };
};

export default async function MesFormationsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/espace-apprenant/connexion");

  const { data: apprenant } = await supabase
    .from("apprenants")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let inscriptions: InscriptionRow[] = [];

  if (apprenant) {
    const { data } = await supabase
      .from("inscriptions")
      .select(`
        id,
        statut,
        montant,
        devise,
        created_at,
        confirmed_at,
        sessions (
          id,
          date_debut,
          date_fin,
          lieu,
          formations (
            titre,
            domaine,
            format,
            duree
          ),
          formateurs (
            nom,
            prenom,
            titre
          )
        )
      `)
      .eq("apprenant_id", apprenant.id)
      .eq("statut", "confirme")
      .order("created_at", { ascending: false });

    inscriptions = (data ?? []) as unknown as InscriptionRow[];
  }

  const statusLabel: Record<string, string> = {
    confirme: "Confirmée",
    en_attente: "En attente",
    annule: "Annulée",
  };

  const statusColor: Record<string, string> = {
    confirme: "bg-green-100 text-green-700",
    en_attente: "bg-yellow-100 text-yellow-700",
    annule: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-gesthorest-primary">
        Mes formations
      </h2>

      {inscriptions.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <BookOpen size={40} className="mx-auto mb-3 text-gesthorest-text-light" />
          <p className="text-gesthorest-text-light">
            Vous n&apos;avez aucune formation confirmée pour le moment.
          </p>
          <a href="/catalogue" className="btn-primary mt-4 inline-flex text-sm">
            Voir le catalogue
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {inscriptions.map((ins) => {
            const session = ins.sessions;
            const formation = session?.formations;
            const formateur = session?.formateurs;
            return (
              <div key={ins.id} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
                      {formation?.titre || "Formation"}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-gesthorest-primary/10 px-2 py-0.5 text-xs font-medium text-gesthorest-primary">
                        {formation?.domaine}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-gesthorest-light px-2 py-0.5 text-xs text-gesthorest-text-light">
                        {formation?.format} · {formation?.duree}
                      </span>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[ins.statut] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabel[ins.statut] || ins.statut}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gesthorest-text-light">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {session?.date_debut
                      ? new Date(session.date_debut).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                    {session?.date_fin && (
                      <>
                        {" → "}
                        {new Date(session.date_fin).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </>
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {session?.lieu || "—"}
                  </span>
                  {formateur && (
                    <span className="flex items-center gap-1">
                      <UserIcon size={14} />
                      {formateur.prenom} {formateur.nom}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
