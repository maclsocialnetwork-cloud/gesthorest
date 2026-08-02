import { ICON_MAP } from "@/lib/icon-map";

export type CertificationRow = { nom: string; icone: string | null }

export default function TrustBanner({ certifications }: { certifications: CertificationRow[] }) {
  if (!certifications.length) return null

  return (
    <section className="bg-gesthorest-primary py-14">
      <div className="container-gesthorest">
        <h2 className="text-center font-heading text-2xl font-bold text-white">
          Votre partenaire certifié et agréé
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {certifications.map((cert) => {
            const Icon = ICON_MAP[cert.icone ?? ''] ?? ICON_MAP.ShieldCheck;
            return (
              <div
                key={cert.nom}
                className="flex flex-col items-center gap-3 rounded border border-white/10 bg-white/5 px-4 py-6 text-center"
              >
                <Icon size={28} className="text-gesthorest-accent" />
                <span className="text-sm font-medium text-white">{cert.nom}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
