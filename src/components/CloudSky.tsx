/**
 * Painterly sky with soft billowing clouds on both sides, drawn in SVG.
 * Turbulence + displacement gives the hand-painted edges; a grain layer adds
 * the paper texture.
 */
type Puff = [number, number, number];

// Cloud masses hugging the left and right edges (cx, cy, r)
const LEFT: Puff[] = [
  [-40, 60, 170], [90, 10, 120], [160, 140, 110], [40, 230, 140], [-30, 360, 150],
  [120, 330, 90], [60, 470, 130], [180, 560, 120], [20, 640, 160], [260, 700, 140], [120, 780, 170],
];
const RIGHT: Puff[] = [
  [1480, 40, 170], [1360, 10, 110], [1410, 200, 150], [1300, 260, 100], [1460, 380, 140],
  [1340, 450, 120], [1240, 540, 110], [1400, 560, 150], [1180, 690, 130], [1320, 720, 160], [1460, 780, 150],
];

export default function CloudSky({ id, className = "" }: { id: string; className?: string }) {
  const puffs = [...LEFT, ...RIGHT];
  return (
    <svg
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a8fb5" />
          <stop offset="0.55" stopColor="#6c9fc2" />
          <stop offset="1" stopColor="#86b3cf" />
        </linearGradient>
        <filter id={`${id}-paint`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="70" />
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="40" />
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
      </defs>

      <rect width="1440" height="800" fill={`url(#${id}-sky)`} />

      {/* Shadow body of the clouds */}
      <g filter={`url(#${id}-paint)`} fill="#c9d3d6">
        {puffs.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      {/* Lit tops, offset up and toward the outer edge */}
      <g filter={`url(#${id}-paint)`} fill="#f4f1e8">
        {puffs.map(([x, y, r], i) => (
          <circle key={i} cx={x + (x < 720 ? -r * 0.18 : r * 0.18)} cy={y - r * 0.2} r={r * 0.82} />
        ))}
      </g>
      {/* Highlights */}
      <g filter={`url(#${id}-soft)`} fill="#ffffff" opacity="0.7">
        {puffs.map(([x, y, r], i) => (
          <circle key={i} cx={x + (x < 720 ? -r * 0.3 : r * 0.3)} cy={y - r * 0.35} r={r * 0.45} />
        ))}
      </g>

      <rect width="1440" height="800" filter={`url(#${id}-grain)`} opacity="0.18" />
    </svg>
  );
}
