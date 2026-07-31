'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown, CheckCircle2 } from 'lucide-react'

type Module = { titre: string; points: string[] }

export default function ProgrammeAccordion({ modules }: { modules: Module[] }) {
  const defaultOpen = modules.map((_, i) => `module-${i}`)

  return (
    <Accordion.Root type="multiple" defaultValue={defaultOpen} className="space-y-3">
      {modules.map((module, i) => (
        <Accordion.Item
          key={module.titre}
          value={`module-${i}`}
          className="overflow-hidden rounded-xl border border-gray-100 bg-gesthorest-light"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left font-heading font-semibold text-gesthorest-primary hover:text-gesthorest-accent transition-colors">
              {module.titre}
              <ChevronDown
                size={18}
                className="shrink-0 text-gesthorest-text-light transition-transform duration-300 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <ul className="space-y-2 px-5 pb-5 text-sm text-gesthorest-text">
              {module.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gesthorest-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
