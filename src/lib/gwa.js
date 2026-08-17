// Shared GWA scale conversion, used by both RegisterPage and ProfilePage so
// signup and later profile edits convert between scales the same way.
//
// Approximate scale <-> percentage table (Philippine 1.0-5.0 GWA scale isn't
// standardized across schools, so this is illustrative, not authoritative —
// the UI says so). Interpolated linearly between points.
const GWA_SCALE_TABLE = [
  [1.0, 99], [1.25, 96], [1.5, 93], [1.75, 90], [2.0, 87], [2.25, 84],
  [2.5, 81], [2.75, 78], [3.0, 75], [3.5, 69], [4.0, 63], [5.0, 50]
];

function interpolate(table, x) {
  if (x <= table[0][0]) return table[0][1];
  if (x >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [x1, y1] = table[i];
    const [x2, y2] = table[i + 1];
    if (x >= x1 && x <= x2) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }
  return table[table.length - 1][1];
}

export function scaleToPercentage(scale) {
  return interpolate(GWA_SCALE_TABLE, scale);
}

export function percentageToScale(pct) {
  const reversed = [...GWA_SCALE_TABLE].map(([s, p]) => [p, s]).sort((a, b) => a[0] - b[0]);
  return interpolate(reversed, pct);
}
