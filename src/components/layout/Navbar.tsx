"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/catalogue", label: "Formations" },
  { href: "/sur-mesure", label: "Sur mesure" },
  { href: "/recrutement", label: "Recrutement" },
  { href: "/evenements", label: "Événements" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-gesthorest-primary shadow-lg" : "bg-white"
      }`}
    >
      <nav className="container-gesthorest flex h-20 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 font-heading">
          <span
            className={`text-2xl font-bold transition-colors ${
              scrolled ? "text-white" : "text-gesthorest-primary"
            }`}
          >
            Gesthorest
          </span>
          <span className="text-sm font-semibold text-gesthorest-accent">
            International
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 pb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-gesthorest-accent text-gesthorest-accent"
                    : `border-transparent hover:text-gesthorest-accent ${
                        scrolled ? "text-white/90" : "text-gesthorest-text"
                      }`
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Link
            href="/espace-apprenant"
            className="inline-flex items-center justify-center rounded border-2 border-gesthorest-accent px-4 py-2 text-sm font-semibold text-gesthorest-accent transition-colors hover:bg-gesthorest-accent hover:text-white"
          >
            Espace apprenant
          </Link>
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setMobileOpen(true)}
          className={`lg:hidden ${scrolled ? "text-white" : "text-gesthorest-primary"}`}
        >
          <Menu size={28} />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
            <span className="font-heading text-lg font-bold text-gesthorest-primary">
              Gesthorest
            </span>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setMobileOpen(false)}
              className="text-gesthorest-primary"
            >
              <X size={26} />
            </button>
          </div>
          <div className="flex flex-col gap-1 px-6 py-6">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded px-3 py-3 text-base font-medium ${
                    isActive
                      ? "bg-gesthorest-light text-gesthorest-accent"
                      : "text-gesthorest-text hover:bg-gesthorest-light"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/espace-apprenant"
              className="mt-4 inline-flex items-center justify-center rounded border-2 border-gesthorest-accent px-4 py-3 text-sm font-semibold text-gesthorest-accent"
            >
              Espace apprenant
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
