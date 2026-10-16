/** Two interlocking gold wedding rings, slowly rotating in CSS 3D behind the names. */
export function Rings() {
  return (
    <div
      className="pointer-events-none absolute inset-0 grid place-items-center [perspective:900px]"
      aria-hidden="true"
    >
      <span className="absolute size-[min(48vmin,340px)] rounded-full border-[2.5px] border-gold opacity-40 [filter:drop-shadow(0_0_12px_rgba(230,201,118,0.5))] motion-safe:[animation:spin-a_20s_linear_infinite]" />
      <span className="absolute size-[min(48vmin,340px)] rounded-full border-[2.5px] border-gold-light opacity-40 [filter:drop-shadow(0_0_12px_rgba(230,201,118,0.5))] motion-safe:[animation:spin-b_26s_linear_infinite]" />
    </div>
  )
}
