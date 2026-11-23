type GaugeProps = {
  /** Needle position, 0 → 1. */
  value: number;
  /** Paints the dial red from this point (0 → 1) to the end, like a red zone. */
  dangerFrom?: number;
  /** CSS transition for the needle. */
  needleTransition?: string;
  className?: string;
};

/** A car-dashboard style semicircle dial with a needle. Decorative: give the value as text next to it. */
export function Gauge({ value, dangerFrom, needleTransition, className }: GaugeProps) {
  const point = (t: number, r: number) => {
    const angle = Math.PI * (1 - t);
    return [100 + r * Math.cos(angle), 105 - r * Math.sin(angle)] as const;
  };
  const arc = (from: number, to: number, r: number) => {
    const [x1, y1] = point(from, r);
    const [x2, y2] = point(to, r);
    return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`;
  };

  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
      <path d={arc(0, 1, 80)} stroke="var(--color-border)" strokeWidth="10" fill="none" strokeLinecap="round" />
      {dangerFrom !== undefined && (
        <path d={arc(dangerFrom, 1, 80)} stroke="var(--color-primary)" strokeWidth="10" fill="none" />
      )}
      {Array.from({ length: 21 }, (_, i) => {
        const [x1, y1] = point(i / 20, 68);
        const [x2, y2] = point(i / 20, i % 5 === 0 ? 58 : 63);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-muted-foreground)" strokeWidth="1.5" />
        );
      })}
      <g
        style={{
          transform: `rotate(${-90 + value * 180}deg)`,
          transformOrigin: "100px 105px",
          transition: needleTransition,
        }}
      >
        <path d="M97 105 L100 32 L103 105 Z" fill="var(--color-signal)" />
      </g>
      <circle cx="100" cy="105" r="8" fill="var(--color-foreground)" />
      <circle cx="100" cy="105" r="3" fill="var(--color-background)" />
    </svg>
  );
}
