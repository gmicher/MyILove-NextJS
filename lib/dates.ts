export function formatBR(d: Date) {
  try {
    return d.toLocaleDateString('pt-BR');
  } catch {
    return String(d);
  }
}
export function parseLocalDate(iso: string) {
  const only = String(iso||'').split('T')[0];
  const [y,m,d] = only.split('-').map(n=>parseInt(n,10));
  return new Date(y, (m||1)-1, d||1);
}
