import Link from "next/link";

const DOMAINS = [
  { label: "Management", slug: "management" },
  { label: "Ressources Humaines", slug: "ressources-humaines" },
  { label: "Finance & Comptabilité", slug: "finance-comptabilite" },
  { label: "Bureautique & Digital", slug: "bureautique-digital" },
  { label: "Qualité & Process", slug: "qualite-process" },
  { label: "Leadership", slug: "leadership" },
  { label: "Communication", slug: "communication" },
  { label: "Sécurité au Travail", slug: "securite-travail" },
];

export default function DomainsChips() {
  return (
    <section className="section-padding bg-white">
      <div className="container-gesthorest text-center">
        <h2 className="font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
          Nos domaines d&apos;expertise
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {DOMAINS.map((domain) => (
            <Link
              key={domain.slug}
              href={`/catalogue?domaine=${domain.slug}`}
              className="rounded-full border border-gesthorest-primary/20 px-5 py-2 text-sm font-medium text-gesthorest-primary transition-colors hover:border-gesthorest-accent hover:bg-gesthorest-accent hover:text-white"
            >
              {domain.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
