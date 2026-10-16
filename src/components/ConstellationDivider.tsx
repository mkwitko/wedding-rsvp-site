/** Thin star-chart divider between sections: a faint line linking small gold stars. */
export function ConstellationDivider() {
  return (
    <div className="grid place-items-center py-2 text-gold" aria-hidden="true">
      <svg viewBox="0 0 320 24" width="320" height="24" fill="none" className="max-w-[70vw]">
        <path
          d="M0 12 H115 L135 6 L160 14 L185 8 L205 12 H320"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.45"
        />
        <circle cx="115" cy="12" r="1.4" fill="currentColor" />
        <circle cx="135" cy="6" r="2" fill="currentColor" />
        <circle
          cx="160"
          cy="14"
          r="2.6"
          fill="currentColor"
          className="origin-center motion-safe:[animation:const-pulse_3.5s_ease-in-out_infinite]"
        />
        <circle cx="185" cy="8" r="2" fill="currentColor" />
        <circle cx="205" cy="12" r="1.4" fill="currentColor" />
      </svg>
    </div>
  )
}
