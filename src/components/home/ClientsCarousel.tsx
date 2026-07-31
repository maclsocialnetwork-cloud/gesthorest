import AnimatedSection from '@/components/ui/AnimatedSection'

const LOGOS_ROW1 = [
  'Ecobank CI', 'Orange CI', 'MTN CI', 'Nestlé CI', 'TotalEnergies CI',
  'Société Générale CI', 'SODECI', 'CIE', 'Bolloré Africa', 'SIB',
]

const LOGOS_ROW2 = [
  'CFAO Motors', 'SIFCA', "Air Côte d'Ivoire", 'Moov Africa', 'BIAO-CI',
  'NSIA Banque', 'Coris Bank CI', 'CANAL+ Afrique', 'BNETD', 'Afrique Télécom',
]

function LogoCard({ name }: { name: string }) {
  return (
    <div className="mx-3 flex h-14 w-44 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 shadow-sm">
      <span className="text-center text-xs font-semibold leading-tight text-gesthorest-primary/70">
        {name}
      </span>
    </div>
  )
}

function MarqueeRow({ logos, reverse = false }: { logos: string[]; reverse?: boolean }) {
  const all = [...logos, ...logos]
  return (
    <div className="flex overflow-hidden">
      <div className={reverse ? 'animate-marquee-reverse flex' : 'animate-marquee flex'}>
        {all.map((name, i) => (
          <LogoCard key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  )
}

export default function ClientsCarousel() {
  return (
    <section className="section-padding bg-[#F8F9FC]">
      <div className="container-gesthorest">
        <AnimatedSection>
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gesthorest-accent">
            Confiance
          </p>
          <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gesthorest-text-light">
            Des entreprises de premier plan nous confient le développement
            des compétences de leurs équipes.
          </p>
        </AnimatedSection>
      </div>

      <div className="mt-12 space-y-4">
        <MarqueeRow logos={LOGOS_ROW1} />
        <MarqueeRow logos={LOGOS_ROW2} reverse />
      </div>
    </section>
  )
}
