import { ShieldCheck, Award, Clock, Globe2 } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "Agréé FDFP" },
  { icon: Award, label: "Certifié ISO 9001:2015" },
  { icon: Clock, label: "12 ans d'expertise" },
  { icon: Globe2, label: "Présence Afrique-Europe" },
];

export default function TrustBanner() {
  return (
    <section className="bg-gesthorest-primary py-14">
      <div className="container-gesthorest">
        <h2 className="text-center font-heading text-2xl font-bold text-white">
          Votre partenaire certifié et agréé
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-3 rounded border border-white/10 bg-white/5 px-4 py-6 text-center"
              >
                <Icon size={28} className="text-gesthorest-accent" />
                <span className="text-sm font-medium text-white">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
