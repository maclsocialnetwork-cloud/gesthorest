'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ZoomIn } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export type GalerieRow = { photo_url: string; titre: string }

export default function GallerySection({ photos }: { photos: GalerieRow[] }) {
  const [selected, setSelected] = useState<GalerieRow | null>(null)

  if (!photos.length) return null

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

        <div className="mt-12 columns-2 gap-4 lg:columns-3">
          {photos.map((photo, i) => (
            <AnimatedSection key={photo.photo_url} delay={i * 0.08} className="mb-4 break-inside-avoid">
              <button
                onClick={() => setSelected(photo)}
                className="group relative block w-full overflow-hidden rounded-xl shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={photo.photo_url}
                    alt={photo.titre}
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

      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Title className="sr-only">
              {selected?.titre ?? 'Photo galerie'}
            </Dialog.Title>
            {selected && (
              <div className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-xl">
                <Image
                  src={selected.photo_url}
                  alt={selected.titre}
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
