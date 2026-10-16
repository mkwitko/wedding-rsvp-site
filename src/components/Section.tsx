import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  eyebrow: string
  title: ReactNode
  children: ReactNode
  className?: string
  /** max width of the inner content */
  width?: 'narrow' | 'default' | 'wide'
}

const widths = {
  narrow: 'max-w-2xl',
  default: 'max-w-4xl',
  wide: 'max-w-6xl',
}

/** Consistent section shell: large script eyebrow + display title, generous spacing. */
export function Section({ id, eyebrow, title, children, className, width = 'default' }: SectionProps) {
  return (
    <section id={id} className="px-6 py-24 sm:py-28">
      <div className={cn('mx-auto text-center', widths[width], className)}>
        <p className="font-script text-gold text-[clamp(1.5rem,4.2vw,2.3rem)] leading-none">
          {eyebrow}
        </p>
        <h2 className="mt-2 mb-10 font-display font-semibold text-gold-light text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.05] tracking-tight">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}
