"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Home,
  Info,
  GraduationCap,
  CalendarDays,
  CalendarRange,
  Newspaper,
  Download,
  ClipboardList,
  Users,
  Briefcase,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard KPI", icon: LayoutDashboard, href: "/admin" },
  { id: "accueil", label: "Accueil", icon: Home, href: "/admin/contenu/accueil" },
  { id: "a-propos", label: "À propos", icon: Info, href: "/admin/contenu/a-propos" },
  { id: "catalogue", label: "Catalogue", icon: GraduationCap, href: "/admin/formations" },
  { id: "sessions", label: "Sessions", icon: CalendarDays, href: "/admin/sessions" },
  { id: "evenements", label: "Événements", icon: CalendarRange, href: "/admin/contenu/evenements" },
  { id: "articles", label: "Actualités", icon: Newspaper, href: "/admin/contenu/articles" },
  { id: "telechargements", label: "Téléchargements", icon: Download, href: "/admin/contenu/telechargements" },
  { id: "inscriptions", label: "Inscriptions", icon: ClipboardList, href: "/admin/inscriptions" },
  { id: "utilisateurs", label: "Utilisateurs", icon: Users, href: "/admin/utilisateurs" },
  { id: "candidatures", label: "Candidatures RH", icon: Briefcase, href: "/admin/candidatures" },
  { id: "contact", label: "Contact", icon: Phone, href: "/admin/contenu/contact" },
  { id: "parametres", label: "Paramètres", icon: Settings, href: "/admin/parametres" },
];

export default function AdminShell({
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
    await fetch("/api/admin/auth/logout", { method: "POST" });
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch { /* ignoré si Supabase non configuré */ }
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  }

  function currentLabel() {
    return ADMIN_NAV.find((n) => isActive(n.href))?.label ?? "Administration";
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {ADMIN_NAV.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          onClick={onClick}
          className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${
            isActive(item.href)
              ? "bg-[#F5821F] text-white"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <item.icon size={16} />
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-gesthorest-primary lg:flex lg:flex-col">
        <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ChevronLeft size={16} />
            Site
          </Link>
          <span className="mx-2 text-white/30">|</span>
          <span className="text-sm font-semibold text-white">Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          <NavLinks />
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="mb-2 truncate px-3 text-xs text-white/50">{displayName}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-red-300 hover:bg-white/10"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col bg-gesthorest-light">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="text-gesthorest-primary lg:hidden"
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-heading text-lg font-semibold text-gesthorest-primary">
              {currentLabel()}
            </h1>
          </div>
          <span className="hidden text-sm text-gesthorest-text-light sm:inline">{displayName}</span>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-gesthorest-primary shadow-xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
            <span className="text-sm font-semibold text-white">Administration</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer"
              className="text-white"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-0.5 overflow-y-auto p-3">
            <NavLinks onClick={() => setMobileOpen(false)} />
          </nav>
          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded px-3 py-3 text-sm text-red-300 hover:bg-white/10"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
