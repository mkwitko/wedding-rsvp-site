import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full min-w-0 rounded-lg border border-input bg-navy-800/70 px-3.5 py-2 text-base text-cream shadow-sm transition-[color,box-shadow] outline-none',
        'placeholder:text-muted-foreground/70 selection:bg-gold selection:text-navy-950',
        'focus-visible:border-gold focus-visible:ring-[3px] focus-visible:ring-ring/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
