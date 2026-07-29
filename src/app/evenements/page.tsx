import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import EvenementCard from "@/components/evenements/EvenementCard";
import { getEvenements } from "@/lib/data/evenements";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Découvrez les prochains événements et masterclass organisés par Gesthorest International à Abidjan et à Paris.",
};

export default async function EvenementsPage() {
  const evenements = await getEvenements();
  const aVenir = evenements.filter((e) => !e.passe);
  const passes = evenements.filter((e) => e.passe);

  return (
    <>
      <PageHeader
        title="Nos événements"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Événements" }]}
      />

      <section className="section-padding container-gesthorest">
        <h2 className="font-heading text-3xl font-bold text-gesthorest-primary">
          Prochains événements
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aVenir.map((evenement) => (
            <EvenementCard key={evenement.id} evenement={evenement} />
          ))}
        </div>
      </section>

      {passes.length > 0 && (
        <section className="section-padding bg-gesthorest-light">
          <div className="container-gesthorest">
            <details className="group rounded bg-white p-6">
              <summary className="cursor-pointer font-heading text-xl font-semibold text-gesthorest-primary">
                Événements passés
              </summary>
              <div className="mt-6 space-y-4">
                {passes.map((evenement) => (
                  <div key={evenement.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
                    <div>
                      <p className="font-heading font-semibold text-gesthorest-primary">
                        {evenement.titre}
                      </p>
                      <p className="text-sm text-gesthorest-text-light">{evenement.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gesthorest-text-light">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} /> {formatDate(evenement.dateEvenement)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {evenement.lieu}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </section>
      )}
    </>
  );
}
