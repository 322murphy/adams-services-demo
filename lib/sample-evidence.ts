const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
  <rect width="640" height="360" fill="#efe4d2"/>
  <rect x="70" y="210" width="500" height="16" fill="#c4b49a"/>
  <rect x="150" y="70" width="110" height="170" rx="10" fill="#24533a"/>
  <rect x="280" y="100" width="90" height="140" rx="10" fill="#1b3d2b"/>
  <rect x="390" y="120" width="70" height="120" rx="8" fill="#6d4c2f"/>
  <text x="32" y="40" font-family="sans-serif" font-size="22" fill="#1c1915">Sample evidence</text>
  <text x="32" y="330" font-family="sans-serif" font-size="16" fill="#1c1915">Extra carts at the curb. Office review copy.</text>
</svg>`;

export const SAMPLE_EVIDENCE_NAME = "sample-curb-photo.svg";
export const SAMPLE_EVIDENCE_URL = `data:image/svg+xml,${encodeURIComponent(svg)}`;
