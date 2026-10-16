import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-24 w-full rounded-lg border border-input bg-navy-800/70 px-3.5 py-2.5 text-base text-cream shadow-sm transition-[color,box-shadow] outline-none',
        'placeholder:text-muted-foreground/70 field-sizing-content',
        'focus-visible:border-gold focus-visible:ring-[3px] focus-visible:ring-ring/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
