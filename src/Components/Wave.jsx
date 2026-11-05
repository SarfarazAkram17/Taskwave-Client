/** Decorative layered waves. Colours come from theme tokens so it works in both themes. */
export const Wave = ({ className = "" }) => {
  const path = "M0 80 C 150 20, 300 140, 450 80 S 750 20, 900 80 S 1200 140, 1350 80 S 1650 20, 1800 80 V 200 H 0 Z";
  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute bottom-0 left-0 w-[200%] h-full wave-drift-slow" style={{ opacity: 0.16 }}>
        <svg viewBox="0 0 1800 200" preserveAspectRatio="none" className="w-1/2 h-full float-left" style={{ maxWidth: "none" }}>
          <path d={path} fill="var(--hero-wave-a)" />
        </svg>
        <svg viewBox="0 0 1800 200" preserveAspectRatio="none" className="w-1/2 h-full float-left" style={{ maxWidth: "none" }}>
          <path d={path} fill="var(--hero-wave-a)" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-[200%] h-3/4 wave-drift" style={{ opacity: 0.22 }}>
        <svg viewBox="0 0 1800 200" preserveAspectRatio="none" className="w-1/2 h-full float-left" style={{ maxWidth: "none" }}>
          <path d={path} fill="var(--hero-wave-b)" />
        </svg>
        <svg viewBox="0 0 1800 200" preserveAspectRatio="none" className="w-1/2 h-full float-left" style={{ maxWidth: "none" }}>
          <path d={path} fill="var(--hero-wave-b)" />
        </svg>
      </div>
    </div>
  );
};
