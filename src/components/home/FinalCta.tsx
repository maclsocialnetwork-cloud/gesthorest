import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="bg-gesthorest-accent py-16">
      <div className="container-gesthorest flex flex-col items-center gap-6 text-center">
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Prêt à transformer vos équipes ?
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded bg-white px-8 py-3 font-semibold text-gesthorest-accent transition-colors hover:bg-gesthorest-light"
        >
          Nous contacter
        </Link>
      </div>
    </section>
  );
}
