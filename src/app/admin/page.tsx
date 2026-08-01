import { createClient } from "@/lib/supabase/server";
import {
  DollarSign,
  Clock,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";
import { CaAreaChart, InscriptionsBarChart, TauxRemplissageChart } from "@/components/admin/DashboardCharts";

type KpiCard = {
  label: string;
  value: string;
  icon: typeof DollarSign;
  color: string;
  alert?: boolean;
};

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
}

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Build 6-month range
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { date: d, label: getMonthLabel(d) }
  })
  const sixMonthsAgo = months[0].date.toISOString()

  const [
    { count: confirmedCount },
    { count: pendingCount },
    { data: confirmedInscriptions },
    { data: pendingInscriptions },
    { count: newUsersCount },
    { data: allInscriptions },
    { data: topFormations },
    { data: inscriptionsSix },
    { data: activeSessions },
  ] = await Promise.all([
    supabase
      .from("inscriptions")
      .select("*", { count: "exact", head: true })
      .eq("statut", "confirme")
      .gte("confirmed_at", last30Days),
    supabase
      .from("inscriptions")
      .select("*", { count: "exact", head: true })
      .eq("statut", "en_attente"),
    supabase
      .from("inscriptions")
      .select("montant, devise")
      .eq("statut", "confirme")
      .eq("type_paiement", "en_ligne")
      .gte("confirmed_at", startOfMonth),
    supabase
      .from("inscriptions")
      .select("montant, devise")
      .eq("statut", "en_attente"),
    supabase
      .from("apprenants")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth),
    supabase
      .from("inscriptions")
      .select("statut")
      .gte("created_at", last30Days),
    supabase
      .from("inscriptions")
      .select(`
        session_id,
        sessions (
          formation_id,
          formations (titre)
        )
      `)
      .eq("statut", "confirme")
      .limit(200),
    supabase
      .from("inscriptions")
      .select("montant, statut, created_at")
      .gte("created_at", sixMonthsAgo),
    supabase
      .from("sessions")
      .select(`
        id,
        places_totales,
        inscriptions(count),
        formations(titre)
      `)
      .gte("date_debut", now.toISOString())
      .limit(10),
  ]);

  type MontantRow = { montant: number | null; devise: string };
  const caMonth = (confirmedInscriptions as MontantRow[] | null)?.reduce(
    (sum, r) => sum + (r.montant ?? 0),
    0
  ) ?? 0;
  const caPending = (pendingInscriptions as MontantRow[] | null)?.reduce(
    (sum, r) => sum + (r.montant ?? 0),
    0
  ) ?? 0;

  const totalInsc = allInscriptions?.length ?? 0;
  const confirmedInsc = allInscriptions?.filter((i: { statut: string }) => i.statut === "confirme").length ?? 0;
  const conversionRate = totalInsc > 0 ? Math.round((confirmedInsc / totalInsc) * 100) : 0;

  const kpis: KpiCard[] = [
    {
      label: "CA du mois (en ligne)",
      value: `${caMonth.toLocaleString("fr-FR")} FCFA`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "CA en attente (cabinet)",
      value: `${caPending.toLocaleString("fr-FR")} FCFA`,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Inscrits confirmés (30j)",
      value: String(confirmedCount ?? 0),
      icon: UserCheck,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Réservations en attente",
      value: String(pendingCount ?? 0),
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      alert: (pendingCount ?? 0) > 5,
    },
    {
      label: "Taux de conversion",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Nouveaux apprenants (mois)",
      value: String(newUsersCount ?? 0),
      icon: Users,
      color: "bg-cyan-50 text-cyan-600",
    },
  ];

  // Build 6-month chart data
  type InscRow = { montant: number | null; statut: string; created_at: string };
  const monthlyData = months.map(({ date, label }) => {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    const rows = (inscriptionsSix as InscRow[] | null)?.filter((r) => {
      const d = new Date(r.created_at)
      return d >= date && d < nextMonth
    }) ?? []
    const ca = rows
      .filter((r) => r.statut === 'confirme')
      .reduce((s, r) => s + (r.montant ?? 0), 0)
    return { mois: label, ca, inscriptions: rows.length }
  })

  // Top 5 formations
  type TopRow = {
    session_id: string;
    sessions: { formation_id: string; formations: { titre: string } };
  };
  const formationCounts: Record<string, { titre: string; count: number }> = {};
  for (const row of (topFormations ?? []) as unknown as TopRow[]) {
    const titre = row.sessions?.formations?.titre;
    if (!titre) continue;
    const fid = row.sessions?.formation_id;
    if (!formationCounts[fid]) formationCounts[fid] = { titre, count: 0 };
    formationCounts[fid].count++;
  }
  const top5 = Object.values(formationCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Taux de remplissage
  type SessionRow = {
    id: string;
    places_totales: number | null;
    inscriptions: { count: number }[];
    formations: { titre: string } | null;
  };
  const tauxData = ((activeSessions ?? []) as unknown as SessionRow[])
    .filter((s) => s.places_totales && s.places_totales > 0)
    .map((s) => {
      const inscrits = s.inscriptions?.[0]?.count ?? 0
      const places = s.places_totales ?? 1
      const taux = Math.round((inscrits / places) * 100)
      return {
        titre: s.formations?.titre ?? 'Session',
        taux,
        inscrits,
        places,
      }
    })
    .sort((a, b) => b.taux - a.taux)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`relative rounded-lg bg-white p-5 shadow-sm ${kpi.alert ? "ring-2 ring-red-300" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gesthorest-text-light">{kpi.label}</p>
                <p className="mt-1 font-heading text-2xl font-bold text-gesthorest-primary">
                  {kpi.value}
                </p>
              </div>
              <div className={`rounded-lg p-2.5 ${kpi.color}`}>
                <kpi.icon size={22} />
              </div>
            </div>
            {kpi.alert && (
              <span className="absolute right-2 top-2 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CaAreaChart data={monthlyData} />
        <InscriptionsBarChart data={monthlyData} />
      </div>

      {/* Taux remplissage + Top 5 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TauxRemplissageChart data={tauxData} />

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-heading text-base font-semibold text-gesthorest-primary">
            Top 5 formations les plus demandées
          </h3>
          {top5.length === 0 ? (
            <p className="text-sm text-gesthorest-text-light py-8 text-center">Aucune donnée disponible.</p>
          ) : (
            <div className="space-y-3">
              {top5.map((f, i) => {
                const maxCount = top5[0].count;
                const pct = maxCount > 0 ? (f.count / maxCount) * 100 : 0;
                return (
                  <div key={f.titre}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gesthorest-text">
                        {i + 1}. {f.titre}
                      </span>
                      <span className="font-semibold text-gesthorest-accent">{f.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gesthorest-accent transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
