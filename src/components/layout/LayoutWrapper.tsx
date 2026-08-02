"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer, { type FooterData } from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import PwaInstallBanner from "@/components/PwaInstallBanner";

export default function LayoutWrapper({
  children,
  footerData,
}: {
  children: React.ReactNode;
  footerData: FooterData;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer data={footerData} />
      <WhatsAppFloat />
      <PwaInstallBanner />
    </>
  );
}
