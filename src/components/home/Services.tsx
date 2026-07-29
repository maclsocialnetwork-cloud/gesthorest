import Link from "next/link";
import {
  GraduationCap,
  UserCog,
  Briefcase,
  CalendarDays,
  Globe2,
  LayoutDashboard,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    icon: GraduationCap,
    title: "Formations Premium",
    description:
      "Un catalogue riche de formations professionnelles animées par des experts reconnus.",
    href: "/catalogue",
  },
  {
    icon: UserCog,
    title: "Accompagnement sur mesure",
    description:
      "Des programmes intra-entreprise conçus selon vos besoins et objectifs spécifiques.",
    href: "/sur-mesure",
  },
  {
    icon: Briefcase,
    title: "Recrutement & RH",
    description:
      "Sourcing, évaluation et conseil RH pour attirer et fidéliser les meilleurs talents.",
    href: "/recrutement",
  },
  {
    icon: CalendarDays,
    title: "Événements & Masterclass",
    description:
      "Des rencontres et masterclass animées par des experts pour enrichir vos compétences.",
    href: "/evenements",
  },
  {
    icon: Globe2,
    title: "Offres Internationales",
    description:
      "Une expertise qui traverse les frontières entre l'Afrique de l'Ouest et l'Europe.",
    href: "/international",
  },
  {
    icon: LayoutDashboard,
    title: "Espace Apprenant",
    description:
      "Suivez vos formations, téléchargez vos attestations et supports en un seul endroit.",
    href: "/espace-apprenant",
  },
];

export default function Services() {
  return (
    <section className="section-padding bg-gesthorest-light">
      <div className="container-gesthorest">
        <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
          Nos expertises
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group rounded border-l-4 border-transparent bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gesthorest-accent hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gesthorest-primary/5 text-gesthorest-primary">
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-gesthorest-primary">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gesthorest-text-light">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gesthorest-accent"
                >
                  En savoir plus
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
