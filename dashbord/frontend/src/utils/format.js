export function niceDate(v) {
  try { return new Date(v).toLocaleString(); } catch { return v || '—'; }
}
