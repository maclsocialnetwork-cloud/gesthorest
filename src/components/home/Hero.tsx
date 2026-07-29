import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gesthorest-primary to-[#243752]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full border border-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full border border-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-1/4 h-24 w-24 rotate-45 border border-gesthorest-accent/20"
      />

      <div className="container-gesthorest relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white">
            <ShieldCheck size={16} className="text-gesthorest-accent" />
            Agréé FDFP · ISO 9001:2015
          </span>

          <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
            Former aujourd&apos;hui,
            <br />
            <span className="text-gesthorest-accent">réussir demain</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80">
            Accompagner les entreprises, institutions et professionnels vers
            l&apos;excellence grâce à des solutions sur mesure, pratiques et
            orientées performance.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/catalogue" className="btn-primary">
              Voir nos formations
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-gesthorest-primary"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
              alt="Équipe professionnelle en formation"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gesthorest-primary/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
