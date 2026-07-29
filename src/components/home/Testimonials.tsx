import Image from "next/image";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Aïcha Koffi",
    role: "DRH, Groupe Ivoire Distribution",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80",
    text: "Gesthorest a su adapter son programme de management à nos réalités terrain. Nos équipes en sont ressorties plus autonomes et plus performantes.",
  },
  {
    name: "Kouassi Adjoua",
    role: "Directeur Général, Sud Finance SA",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
    text: "Un accompagnement sérieux, un formateur expérimenté et un vrai suivi post-formation. C'est ce que nous recherchions depuis longtemps.",
  },
  {
    name: "Fatou Diabaté",
    role: "Manager RH, Atlantique Industries",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
    text: "Le processus de recrutement mené par Gesthorest nous a permis de pourvoir trois postes clés en moins de six semaines, avec des profils de qualité.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-gesthorest">
        <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
          Ils nous font confiance
        </h2>

        <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="w-[85%] shrink-0 snap-center rounded bg-gesthorest-light p-6 sm:w-auto"
            >
              <div className="flex gap-0.5 text-gesthorest-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gesthorest-text">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-gesthorest-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gesthorest-text-light">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
