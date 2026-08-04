import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez Gesthorest International à Abidjan ou à Paris pour vos projets de formation, recrutement ou partenariat.',
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contactez-nous"
        breadcrumb={[{ label: 'Accueil', href: '/' }, { label: 'Contact' }]}
      />

      <section className="section-padding container-gesthorest grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-6">
          {/* Bouton WhatsApp prominent */}
          <a
            href="https://wa.me/2250747123321?text=Bonjour%20Gesthorest%2C%20j%27aimerais%20avoir%20des%20informations%20sur%20vos%20formations."
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 font-semibold text-white shadow-md transition-all hover:bg-[#20BA5A] hover:shadow-lg"
          >
            <MessageCircle size={22} />
            💬 Écrire sur WhatsApp
          </a>

          {/* Coordonnées */}
          <div className="rounded-xl bg-gesthorest-light p-6">
            <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
              Nos coordonnées
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gesthorest-text">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                <span>Abidjan — Plateau, Côte d&apos;Ivoire</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                <span>Paris — France</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="shrink-0 text-gesthorest-accent" />
                contact@gesthorest.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="shrink-0 text-gesthorest-accent" />
                +225 07 47 12 33 21
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="shrink-0 text-gesthorest-accent" />
                +33 6 71 97 11 59
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div className="rounded-xl bg-gesthorest-light p-6">
            <h3 className="font-heading text-lg font-semibold text-gesthorest-primary flex items-center gap-2">
              <Clock size={18} className="text-gesthorest-accent" />
              Horaires d&apos;ouverture
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gesthorest-text">
              <li className="flex justify-between">
                <span>Lundi – Vendredi</span>
                <span className="font-medium">08h00 – 18h00</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi</span>
                <span className="font-medium">09h00 – 13h00</span>
              </li>
              <li className="flex justify-between text-gesthorest-text-light">
                <span>Dimanche</span>
                <span>Fermé</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-gesthorest-accent font-medium">
              ⏱ Nous vous répondons sous 24h ouvrées
            </p>
          </div>

          {/* Google Maps */}
          <div className="overflow-hidden rounded-xl shadow-sm">
            <iframe
              title="Localisation Gesthorest International — Abidjan Plateau"
              src="https://www.google.com/maps?q=Plateau+Abidjan+Côte+d%27Ivoire&output=embed"
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}
