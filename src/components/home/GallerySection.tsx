'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ZoomIn } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    alt: 'Salle de formation professionnelle',
  },
  {
    src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    alt: 'Équipe en réunion de travail',
  },
  {
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    alt: 'Formatrice en présentation',
  },
  {
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    alt: 'Atelier de team building',
  },
  {
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    alt: 'Présentation business professionnelle',
  },
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
    alt: 'Conférence et formation en entreprise',
  },
]

export default function GallerySection() {
  const [selected, setSelected] = useState<(typeof PHOTOS)[0] | null>(null)

  return (
    <section className="section-padding bg-white">
      <div className="container-gesthorest">
        <AnimatedSection>
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gesthorest-accent">
            Notre cadre
          </p>
          <h2 className="text-center font-heading text-3xl font-bold text-gesthorest-primary sm:text-4xl">
            Notre environnement de formation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gesthorest-text-light">
            Des espaces modernes et équipés pour des formations dans les meilleures conditions.
          </p>
        </AnimatedSection>

        {/* Grille masonry */}
        <div className="mt-12 columns-2 gap-4 lg:columns-3">
          {PHOTOS.map((photo, i) => (
            <AnimatedSection key={photo.src} delay={i * 0.08} className="mb-4 break-inside-avoid">
              <button
                onClick={() => setSelected(photo)}
                className="group relative block w-full overflow-hidden rounded-xl shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gesthorest-primary/0 transition-colors duration-300 group-hover:bg-gesthorest-primary/40">
                    <ZoomIn size={32} className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Title className="sr-only">
              {selected?.alt ?? 'Photo galerie'}
            </Dialog.Title>
            {selected && (
              <div className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-xl">
                <Image
                  src={selected.src}
                  alt={selected.alt}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            )}
            <Dialog.Close className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
              <X size={20} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
