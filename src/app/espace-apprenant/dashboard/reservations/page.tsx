import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { getApprenantId } from "@/lib/apprenant-session";
import { Clock, Phone, Mail, MapPin } from "lucide-react";

type ReservationRow = {
  id: string;
  statut: string;
  type_paiement: string;
  montant: number | null;
  devise: string;
  numero_bon: string;
  created_at: string;
  sessions: {
    date_debut: string;
    lieu: string;
    formations: { titre: string; domaine: string };
  };
};

export default async function MesReservationsPage() {
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

  const { data } = await supabase
    .from("inscriptions")
    .select(`
      id,
      statut,
      type_paiement,
      montant,
      devise,
      numero_bon,
      created_at,
      sessions (
        date_debut,
        lieu,
        formations (
          titre,
          domaine
        )
      )
    `)
    .eq("apprenant_id", apprenant.id)
    .eq("statut", "en_attente")
    .order("created_at", { ascending: false });

  const reservations = (data ?? []) as unknown as ReservationRow[];

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-gesthorest-primary">
        Mes réservations en attente
      </h2>

      {reservations.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <Clock size={40} className="mx-auto mb-3 text-gesthorest-text-light" />
          <p className="text-gesthorest-text-light">Aucune réservation en attente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => {
            const session = res.sessions;
            const formation = session?.formations;
            return (
              <div
                key={res.id}
                className="rounded-lg border-l-4 border-yellow-400 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-base font-semibold text-gesthorest-primary">
                      {formation?.titre || "Formation"}
                    </h3>
                    <p className="mt-1 text-sm text-gesthorest-text-light">
                      N° Bon :{" "}
                      <span className="font-mono font-medium text-gesthorest-text">
                        {res.numero_bon}
                      </span>
                    </p>
                  </div>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                    En attente de paiement
                  </span>
                </div>

                <div className="mt-3 text-sm text-gesthorest-text-light">
                  <p>
                    Montant :{" "}
                    <span className="font-semibold text-gesthorest-accent">
                      {res.montant
                        ? `${res.montant.toLocaleString("fr-FR")} ${res.devise}`
                        : "Sur devis"}
                    </span>
                  </p>
                  <p className="mt-1">
                    Réservé le{" "}
                    {new Date(res.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="mt-4 rounded bg-gesthorest-light p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gesthorest-primary">
                    Paiement au cabinet
                  </p>
                  <div className="space-y-1 text-sm text-gesthorest-text-light">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} />
                      Abidjan — Côte d&apos;Ivoire
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={14} />
                      +225 07 47 12 33 21
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={14} />
                      contact@gesthorest.com
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
