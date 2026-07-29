import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Gesthorest International à Abidjan ou à Paris pour vos projets de formation, recrutement ou partenariat.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contactez-nous"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
      />

      <section className="section-padding container-gesthorest grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-6">
          <div className="rounded bg-gesthorest-light p-6">
            <h3 className="font-heading text-lg font-semibold text-gesthorest-primary">
              Nos coordonnées
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gesthorest-text">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                Abidjan — Côte d&apos;Ivoire
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                Paris — France
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

          <div className="overflow-hidden rounded shadow-sm">
            <iframe
              title="Localisation Gesthorest International — Abidjan"
              src="https://www.google.com/maps?q=Abidjan,Côte d'Ivoire&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
