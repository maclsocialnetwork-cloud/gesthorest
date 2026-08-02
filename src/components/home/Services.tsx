import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ICON_MAP } from "@/lib/icon-map";

export type ServiceRow = { icone: string; titre: string; description: string; lien: string }

export default function Services({ services }: { services: ServiceRow[] }) {
  if (!services.length) return null

  return (
    <section className="section-padding bg-gesthorest-light">
      <div className="container-gesthorest">
        <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
          Nos expertises
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = ICON_MAP[service.icone] ?? ICON_MAP.GraduationCap;
            return (
              <div
                key={service.titre}
                className="group rounded border-l-4 border-transparent bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gesthorest-accent hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gesthorest-primary/5 text-gesthorest-primary">
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-gesthorest-primary">
                  {service.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gesthorest-text-light">
                  {service.description}
                </p>
                <Link
                  href={service.lien}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gesthorest-accent"
                >
                  En savoir plus
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
