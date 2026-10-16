import { useEffect } from 'react'

/**
 * Reveals `main section` elements as they scroll into view.
 * Sections below the hero start hidden (`.reveal`) and get `.revealed` once
 * intersecting. Respects prefers-reduced-motion (reveals everything at once).
 */
export function useScrollReveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('main section'))
    if (targets.length === 0) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      targets.forEach((t) => t.classList.add('revealed'))
      return
    }

    targets.forEach((t) => t.classList.add('reveal'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.12 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])
}
