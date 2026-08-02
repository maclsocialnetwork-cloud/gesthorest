import Link from "next/link";

export type DomaineRow = { libelle: string; slug: string }

export default function DomainsChips({ domaines }: { domaines: DomaineRow[] }) {
  if (!domaines.length) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-gesthorest text-center">
        <h2 className="font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
          Nos domaines d&apos;expertise
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {domaines.map((domain) => (
            <Link
              key={domain.slug}
              href={`/catalogue?domaine=${domain.slug}`}
              className="rounded-full border border-gesthorest-primary/20 px-5 py-2 text-sm font-medium text-gesthorest-primary transition-colors hover:border-gesthorest-accent hover:bg-gesthorest-accent hover:text-white"
            >
              {domain.libelle}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
