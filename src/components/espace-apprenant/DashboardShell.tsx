"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Clock,
  FileDown,
  Award,
  Star,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TABS = [
  { id: "dashboard", label: "Mes formations", icon: BookOpen, href: "/espace-apprenant/dashboard" },
  { id: "reservations", label: "Réservations", icon: Clock, href: "/espace-apprenant/dashboard/reservations" },
  { id: "supports", label: "Mes supports", icon: FileDown, href: "/espace-apprenant/dashboard/supports" },
  { id: "attestations", label: "Attestations", icon: Award, href: "/espace-apprenant/dashboard/attestations" },
  { id: "evaluations", label: "Évaluations", icon: Star, href: "/espace-apprenant/dashboard/evaluations" },
  { id: "profil", label: "Mon profil", icon: User, href: "/espace-apprenant/dashboard/profil" },
];

export default function DashboardShell({
  displayName,
  children,
}: {
  displayName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/espace-apprenant/connexion");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gesthorest-light">
      {/* Header dashboard */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-gesthorest flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="text-gesthorest-primary lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-heading text-lg font-semibold text-gesthorest-primary">
              Bonjour, {displayName.split(" ")[0]}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gesthorest-text-light transition-colors hover:text-red-500"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="container-gesthorest flex gap-6 py-6">
        {/* Sidebar desktop */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-28 space-y-1 rounded-lg bg-white p-3 shadow-sm">
            {TABS.map((tab) => {
              const isActive =
                tab.href === "/espace-apprenant/dashboard"
                  ? pathname === tab.href
                  : pathname?.startsWith(tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gesthorest-accent/10 text-gesthorest-accent"
                      : "text-gesthorest-text hover:bg-gesthorest-light"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
            <span className="font-heading text-sm font-semibold text-gesthorest-primary">
              {displayName}
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer"
              className="text-gesthorest-primary"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {TABS.map((tab) => {
              const isActive =
                tab.href === "/espace-apprenant/dashboard"
                  ? pathname === tab.href
                  : pathname?.startsWith(tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded px-3 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-gesthorest-accent/10 text-gesthorest-accent"
                      : "text-gesthorest-text hover:bg-gesthorest-light"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex items-center gap-3 rounded px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
