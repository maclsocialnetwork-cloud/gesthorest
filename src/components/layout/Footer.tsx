import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { ICON_MAP } from "@/lib/icon-map";

export type FooterData = {
  certifications: { nom: string; icone: string | null }[];
  domaines: { libelle: string; slug: string }[];
  coordonnees: Record<string, string>;
};

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.75h3.47V21H3.4V8.75Zm6.2 0h3.33v1.68h.05c.46-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32 4.18 5.34V21h-3.47v-5.63c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21H9.6V8.75Z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer({ data }: { data: FooterData }) {
  const { certifications, domaines, coordonnees } = data;

  const formationLinks = domaines.slice(0, 4).map((d) => ({
    href: `/catalogue?domaine=${d.slug}`,
    label: d.libelle,
  }));
  formationLinks.push(
    { href: "/catalogue", label: "Voir tout le catalogue" },
    { href: "/fdfp", label: "Financement FDFP" },
    { href: "/telechargements", label: "Téléchargements" },
    { href: "/faq", label: "FAQ" }
  );

  const email = coordonnees.email_contact || "contact@gesthorest.com";
  const telCi = coordonnees.telephone_ci || "+225 07 47 12 33 21";
  const telFr = coordonnees.telephone_fr || "+33 6 71 97 11 59";
  const adrCi = coordonnees.adresse_ci || "Abidjan — Côte d'Ivoire";
  const adrFr = coordonnees.adresse_fr || "Paris — France";

  return (
    <footer className="bg-gesthorest-primary text-white">
      <div className="container-gesthorest grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-2 font-heading">
            <span className="text-2xl font-bold text-white">Gesthorest</span>
            <span className="text-sm font-semibold text-gesthorest-accent">International</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Accompagner les entreprises, institutions et professionnels vers
            l&apos;excellence grâce à des solutions sur mesure, pratiques et
            orientées performance.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Formations
          </h3>
          <ul className="mt-4 space-y-3">
            {formationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-gesthorest-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gesthorest-accent" />
              <span>{adrCi}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gesthorest-accent" />
              <span>{adrFr}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} className="shrink-0 text-gesthorest-accent" />
              <a href={`mailto:${email}`} className="hover:text-gesthorest-accent">{email}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="shrink-0 text-gesthorest-accent" />
              <a href={`tel:${telCi.replace(/\s/g, '')}`} className="hover:text-gesthorest-accent">{telCi}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="shrink-0 text-gesthorest-accent" />
              <a href={`tel:${telFr.replace(/\s/g, '')}`} className="hover:text-gesthorest-accent">{telFr}</a>
            </li>
            <li>
              <Link href="/admin/login" className="text-xs select-none cursor-pointer text-white hover:text-gray-400 transition-colors duration-500">
                Administration
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Certifications
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {certifications.map((cert) => {
              const Icon = ICON_MAP[cert.icone ?? ''] ?? ICON_MAP.ShieldCheck;
              return (
                <div key={cert.nom} className="flex items-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-2">
                  <Icon size={20} className="shrink-0 text-gesthorest-accent" />
                  <span className="text-sm text-white/80">{cert.nom}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-gesthorest flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} Gesthorest International. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="text-white/60 transition-colors hover:text-gesthorest-accent">
              <FacebookIcon size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-white/60 transition-colors hover:text-gesthorest-accent">
              <LinkedinIcon size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="text-white/60 transition-colors hover:text-gesthorest-accent">
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
