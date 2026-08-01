'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

type Question = { q: string; a: string }

export default function FaqAccordion({ questions }: { questions: Question[] }) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-2">
      {questions.map((item, i) => (
        <Accordion.Item
          key={i}
          value={`item-${i}`}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gesthorest-primary transition-colors hover:text-gesthorest-accent data-[state=open]:text-gesthorest-accent">
            <span>{item.q}</span>
            <ChevronDown
              size={18}
              className="shrink-0 text-gesthorest-accent transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
          <Accordion.Content className="animate-accordion-down overflow-hidden data-[state=closed]:animate-accordion-up">
            <p className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gesthorest-text">
              {item.a}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
