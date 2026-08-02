import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import ToastProvider from '@/components/ui/ToastProvider'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import type { FooterData } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
})

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gesthorest.vercel.app'
const siteUrl = rawSiteUrl.replace(/^﻿/, '').trim()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gesthorest International — Former aujourd'hui, réussir demain",
    template: '%s | Gesthorest International',
  },
  description:
    'Gesthorest International, cabinet de formation professionnelle et de recrutement à Abidjan et Paris. Agréé FDFP · Certifié ISO 9001:2015.',
  manifest: '/manifest.json',
  themeColor: '#1B2A4A',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gesthorest',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    title: "Gesthorest International — Former aujourd'hui, réussir demain",
    description:
      'Cabinet de formation professionnelle et de recrutement à Abidjan et Paris. Agréé FDFP · Certifié ISO 9001:2015.',
    url: siteUrl,
    siteName: 'Gesthorest International',
    images: [{ url: '/logo-gesthorest.png' }],
    locale: 'fr_FR',
    type: 'website',
  },
}

const FALLBACK_FOOTER: FooterData = {
  certifications: [
    { nom: 'Agréé FDFP', icone: 'ShieldCheck' },
    { nom: 'Certifié ISO 9001:2015', icone: 'Award' },
  ],
  domaines: [
    { libelle: 'Management', slug: 'management' },
    { libelle: 'Ressources Humaines', slug: 'ressources-humaines' },
    { libelle: 'Finance & Comptabilité', slug: 'finance-comptabilite' },
    { libelle: 'Bureautique & Digital', slug: 'bureautique-digital' },
  ],
  coordonnees: {
    email_contact: 'contact@gesthorest.com',
    telephone_ci: '+225 07 47 12 33 21',
    telephone_fr: '+33 6 71 97 11 59',
    adresse_ci: 'Abidjan — Côte d\'Ivoire',
    adresse_fr: 'Paris — France',
  },
}

async function getFooterData(): Promise<FooterData> {
  try {
    const supabase = createClient()
    const [certRes, domRes, paramRes] = await Promise.all([
      supabase.from('certifications').select('nom, icone').eq('visible', true).order('ordre'),
      supabase.from('domaines').select('libelle, slug').eq('visible', true).order('ordre'),
      supabase.from('parametres_site').select('cle, valeur'),
    ])

    const coordonnees: Record<string, string> = {}
    for (const row of paramRes.data ?? []) {
      coordonnees[row.cle] = row.valeur
    }

    return {
      certifications: certRes.data?.length ? certRes.data : FALLBACK_FOOTER.certifications,
      domaines: domRes.data?.length ? domRes.data : FALLBACK_FOOTER.domaines,
      coordonnees: Object.keys(coordonnees).length ? coordonnees : FALLBACK_FOOTER.coordonnees,
    }
  } catch {
    return FALLBACK_FOOTER
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const footerData = await getFooterData()

  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} font-body antialiased`}>
        <ToastProvider>
          <LayoutWrapper footerData={footerData}>{children}</LayoutWrapper>
        </ToastProvider>
      </body>
    </html>
  )
}
