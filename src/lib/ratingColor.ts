// Converte uma nota média (0 a 5) numa cor num gradiente frio → quente.
// Sem nota: cinza neutro. Nota baixa: azul frio. Nota média: dourado.
// Nota alta: vermelho/laranja quente.

type Stop = { r: number; h: number; s: number; l: number };

const STOPS: Stop[] = [
  { r: 0, h: 206, s: 55, l: 58 }, // frio (azul)
  { r: 2.5, h: 45, s: 70, l: 58 }, // neutro (dourado)
  { r: 5, h: 10, s: 78, l: 58 }, // quente (vermelho/laranja)
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function ratingHsl(rating: number | null | undefined): { h: number; s: number; l: number } {
  if (rating == null) return { h: 40, s: 6, l: 55 };
  const clamped = Math.max(0, Math.min(5, rating));

  let lo = STOPS[0];
  let hi = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (clamped >= STOPS[i].r && clamped <= STOPS[i + 1].r) {
      lo = STOPS[i];
      hi = STOPS[i + 1];
      break;
    }
  }
  const t = hi.r === lo.r ? 0 : (clamped - lo.r) / (hi.r - lo.r);
  return { h: lerp(lo.h, hi.h, t), s: lerp(lo.s, hi.s, t), l: lerp(lo.l, hi.l, t) };
}

export function ratingColor(rating: number | null | undefined, alpha = 1): string {
  const { h, s, l } = ratingHsl(rating);
  return `hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}% / ${alpha})`;
}
