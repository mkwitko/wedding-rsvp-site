/** Crescent gold moon with a soft glow, drifting in the upper sky. */
export function Moon() {
  return (
    <div
      className="pointer-events-none absolute top-[8vh] right-[10vw] motion-safe:[animation:moon-glow_7s_ease-in-out_infinite]"
      aria-hidden="true"
    >
      <svg width="120" height="120" viewBox="0 0 120 120" className="w-[clamp(64px,12vw,120px)]">
        <defs>
          <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(230,201,118,0.35)" />
            <stop offset="60%" stopColor="rgba(230,201,118,0.08)" />
            <stop offset="100%" stopColor="rgba(230,201,118,0)" />
          </radialGradient>
          <linearGradient id="moonBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff6df" />
            <stop offset="100%" stopColor="#c9a24b" />
          </linearGradient>
          <mask id="crescent">
            <rect width="120" height="120" fill="black" />
            <circle cx="60" cy="60" r="34" fill="white" />
            <circle cx="74" cy="52" r="30" fill="black" />
          </mask>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#moonHalo)" />
        <circle cx="60" cy="60" r="34" fill="url(#moonBody)" mask="url(#crescent)" />
      </svg>
    </div>
  )
}
