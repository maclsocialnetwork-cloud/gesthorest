import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gesthorest.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gesthorest International — Former aujourd'hui, réussir demain",
    template: "%s | Gesthorest International",
  },
  description:
    "Gesthorest International, cabinet de formation professionnelle et de recrutement à Abidjan et Paris. Agréé FDFP · Certifié ISO 9001:2015.",
  manifest: "/manifest.json",
  themeColor: "#1B2A4A",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gesthorest",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    title: "Gesthorest International — Former aujourd'hui, réussir demain",
    description:
      "Cabinet de formation professionnelle et de recrutement à Abidjan et Paris. Agréé FDFP · Certifié ISO 9001:2015.",
    url: siteUrl,
    siteName: "Gesthorest International",
    images: [{ url: "/logo-gesthorest.png" }],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} font-body antialiased`}>
        <ToastProvider>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
