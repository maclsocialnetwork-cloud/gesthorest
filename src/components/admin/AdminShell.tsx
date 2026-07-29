"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  Users,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "formations", label: "Formations", icon: GraduationCap, href: "/admin/formations" },
  { id: "inscriptions", label: "Inscriptions", icon: ClipboardList, href: "/admin/inscriptions" },
  { id: "utilisateurs", label: "Utilisateurs", icon: Users, href: "/admin/utilisateurs" },
  { id: "contenus", label: "Contenus", icon: FileText, href: "/admin/contenus" },
  { id: "candidatures", label: "Candidatures", icon: Briefcase, href: "/admin/candidatures" },
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
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/espace-apprenant/connexion");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      {/* Sidebar desktop */}
      <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-gesthorest-primary lg:block">
        <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ChevronLeft size={16} />
            Site
          </Link>
          <span className="mx-2 text-white/30">|</span>
          <span className="text-sm font-semibold text-white">Administration</span>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 p-3">
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
              {ADMIN_NAV.find((n) => isActive(n.href))?.label || "Administration"}
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
          <nav className="flex flex-col gap-0.5 p-3">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded px-3 py-3 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
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
