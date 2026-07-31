import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Award } from "lucide-react";

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

const FORMATIONS_LINKS = [
  { href: "/catalogue?domaine=management", label: "Management" },
  { href: "/catalogue?domaine=ressources-humaines", label: "Ressources Humaines" },
  { href: "/catalogue?domaine=finance-comptabilite", label: "Finance & Comptabilité" },
  { href: "/catalogue", label: "Voir tout le catalogue" },
  { href: "/fdfp", label: "Financement FDFP" },
  { href: "/telechargements", label: "Téléchargements" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="bg-gesthorest-primary text-white">
      <div className="container-gesthorest grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-2 font-heading">
            <span className="text-2xl font-bold text-white">Gesthorest</span>
            <span className="text-sm font-semibold text-gesthorest-accent">
              International
            </span>
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
            {FORMATIONS_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-gesthorest-accent"
                >
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
              <span>Abidjan — Côte d&apos;Ivoire</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gesthorest-accent" />
              <span>Paris — France</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} className="shrink-0 text-gesthorest-accent" />
              <a href="mailto:contact@gesthorest.com" className="hover:text-gesthorest-accent">
                contact@gesthorest.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="shrink-0 text-gesthorest-accent" />
              <a href="tel:+2250747123321" className="hover:text-gesthorest-accent">
                +225 07 47 12 33 21
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="shrink-0 text-gesthorest-accent" />
              <a href="tel:+33671971159" className="hover:text-gesthorest-accent">
                +33 6 71 97 11 59
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Certifications
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-2">
              <ShieldCheck size={20} className="shrink-0 text-gesthorest-accent" />
              <span className="text-sm text-white/80">Agréé FDFP</span>
            </div>
            <div className="flex items-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-2">
              <Award size={20} className="shrink-0 text-gesthorest-accent" />
              <span className="text-sm text-white/80">Certifié ISO 9001:2015</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-gesthorest flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Gesthorest International. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-white/60 transition-colors hover:text-gesthorest-accent"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-white/60 transition-colors hover:text-gesthorest-accent"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-white/60 transition-colors hover:text-gesthorest-accent"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
