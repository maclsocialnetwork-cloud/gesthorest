import Link from "next/link";
import { Clock, MapPin, CalendarDays } from "lucide-react";
import {
  DOMAIN_LABELS,
  DOMAIN_BADGE_CLASSES,
  type Formation,
} from "@/lib/data/formations-seed";
import { formatDate, formatPrix } from "@/lib/format";

export default function FormationCard({ formation }: { formation: Formation }) {
  const nextSession = [...formation.sessions].sort(
    (a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
  )[0];

  return (
    <div className="flex flex-col rounded bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${DOMAIN_BADGE_CLASSES[formation.domaine]}`}
      >
        {DOMAIN_LABELS[formation.domaine]}
      </span>

      <h3 className="mt-4 font-heading text-lg font-semibold text-gesthorest-primary">
        {formation.titre}
      </h3>

      <div className="mt-4 space-y-2 text-sm text-gesthorest-text-light">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gesthorest-accent" />
          {formation.format}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gesthorest-accent" />
          {formation.dureeLabel}
        </div>
        {nextSession && (
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-gesthorest-accent" />
            Prochaine session : {formatDate(nextSession.dateDebut)}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="font-heading text-lg font-bold text-gesthorest-accent">
          {formatPrix(formation.prix, formation.devise)}
        </span>
        <Link
          href={`/catalogue/${formation.slug}`}
          className="text-sm font-semibold text-gesthorest-primary hover:text-gesthorest-accent"
        >
          Voir la formation →
        </Link>
      </div>
    </div>
  );
}
