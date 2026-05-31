'use client';
import { useSettings } from '@/lib/settings-context';

export interface Theme {
  accent:    string;
  bg:        string;
  card:      string;
  accentFg:  string;
  cardFg:    string;   // ← NEW: readable text on top of card bg
  /** rgba(accent, alpha) */
  a: (alpha: number) => string;
  /** rgba(bg, alpha) */
  b: (alpha: number) => string;
}

function hexToRgba(hex: string, alpha: number): string {
  try {
    const c = hex.replace('#', '');
    const full = c.length === 3 ? c.split('').map(x => x+x).join('') : c;
    const r = parseInt(full.slice(0,2),16), g = parseInt(full.slice(2,4),16), b = parseInt(full.slice(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch { return `rgba(37,99,235,${alpha})`; }
}

function lum(hex: string): number {
  try {
    const c = hex.replace('#','');
    const full = c.length === 3 ? c.split('').map(x=>x+x).join('') : c;
    const r = parseInt(full.slice(0,2),16), g = parseInt(full.slice(2,4),16), b = parseInt(full.slice(4,6),16);
    return (0.299*r + 0.587*g + 0.114*b) / 255;
  } catch { return 0.5; }
}

function contrastFg(hex: string): string {
  return lum(hex) > 0.5 ? '#0f172a' : '#ffffff';
}

export function useTheme(): Theme {
  const settings = useSettings();

  const accent = settings?.accentColor || '#2563eb';
  const bg     = settings?.bgColor     || '#f8fafc';
  const card   = settings?.cardColor   || '#ffffff';

  return {
    accent,
    bg,
    card,
    accentFg: contrastFg(accent),
    cardFg:   contrastFg(card),
    a: (alpha) => hexToRgba(accent, alpha),
    b: (alpha) => hexToRgba(bg, alpha),
  };
}