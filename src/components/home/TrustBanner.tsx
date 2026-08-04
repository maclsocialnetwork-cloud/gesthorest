import Image from "next/image";
import { Clock, Globe2 } from "lucide-react";

const TRUST_ITEMS = [
  {
    type: "image" as const,
    src: "/logo-fdfp.jpg",
    alt: "Agréé FDFP",
    label: "Agréé FDFP",
  },
  {
    type: "image" as const,
    src: "/logo-iso-9001.jpg",
    alt: "ISO 9001:2015",
    label: "Certifié ISO 9001:2015",
  },
  {
    type: "icon" as const,
    Icon: Clock,
    label: "12 ans d'expertise",
  },
  {
    type: "icon" as const,
    Icon: Globe2,
    label: "Présence Afrique-Europe",
  },
];

export default function TrustBanner() {
  return (
    <section className="bg-gesthorest-primary py-14">
      <div className="container-gesthorest">
        <h2 className="text-center font-heading text-2xl font-bold text-white">
          Votre partenaire international expérimenté, certifié et agréé
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-3 rounded border border-white/10 bg-white/5 px-4 py-6 text-center"
            >
              {item.type === "image" ? (
                <div className="flex h-16 w-24 items-center justify-center rounded bg-white/90 px-2 py-1">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={80}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : (
                <item.Icon size={28} className="text-gesthorest-accent" />
              )}
              <span className="text-sm font-medium text-white">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
