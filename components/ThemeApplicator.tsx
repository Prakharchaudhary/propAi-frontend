'use client';
import { useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';

function hexToRgba(hex: string, alpha: number): string {
  try {
    const c = hex.replace('#', '');
    const f = c.length === 3 ? c.split('').map(x => x+x).join('') : c;
    const r = parseInt(f.slice(0,2),16), g = parseInt(f.slice(2,4),16), b = parseInt(f.slice(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch { return `rgba(37,99,235,${alpha})`; }
}

// Returns 0 (dark) to 1 (bright)
function brightness(hex: string): number {
  try {
    const c = hex.replace('#','');
    const f = c.length === 3 ? c.split('').map(x=>x+x).join('') : c;
    const r = parseInt(f.slice(0,2),16), g = parseInt(f.slice(2,4),16), b = parseInt(f.slice(4,6),16);
    return (0.299*r + 0.587*g + 0.114*b) / 255;
  } catch { return 0.5; }
}

function autoFg(hex: string) { return brightness(hex) > 0.5 ? '#0f172a' : '#ffffff'; }

export default function ThemeApplicator() {
  const settings = useSettings();

  useEffect(() => {
    const root = document.documentElement;

    const accent = settings?.accentColor || '#2563eb';
    const bg     = settings?.bgColor     || '#f8fafc';
    const card   = settings?.cardColor   || '#ffffff';

    const bgIsDark   = brightness(bg)   < 0.45;
    const cardIsDark = brightness(card) < 0.45;

    // ── Accent ──────────────────────────────────────────────────────────────
    root.style.setProperty('--accent',               accent);
    root.style.setProperty('--primary',              accent);
    root.style.setProperty('--gold',                 accent);
    root.style.setProperty('--ring',                 accent);
    root.style.setProperty('--primary-foreground',   autoFg(accent));
    root.style.setProperty('--accent-fg',            autoFg(accent));
    root.style.setProperty('--glass-border',         hexToRgba(accent, bgIsDark ? 0.20 : 0.12));
    root.style.setProperty('--glow-gold',            `0 4px 24px ${hexToRgba(accent, 0.12)}`);
    root.style.setProperty('--glow-gold-sm',         `0 2px 12px ${hexToRgba(accent, 0.08)}`);

    // ── Background ──────────────────────────────────────────────────────────
    root.style.setProperty('--background', bg);
    root.style.setProperty('--navy',       bg);
    document.body.style.backgroundColor = bg;
    document.body.style.color = autoFg(bg);

    // ── Text — AUTO from background brightness ───────────────────────────────
    if (bgIsDark) {
      root.style.setProperty('--foreground',       '#f1f5f9');
      root.style.setProperty('--card-foreground',  '#f1f5f9');
      root.style.setProperty('--text-muted',       '#94a3b8');
      root.style.setProperty('--text-subtle',      '#64748b');
      root.style.setProperty('--border',           'rgba(255,255,255,0.10)');
      root.style.setProperty('--border-color',     'rgba(255,255,255,0.10)');
      root.style.setProperty('--input',            'rgba(255,255,255,0.06)');
      root.style.setProperty('--surface-2',        hexToRgba(bg, 0.6));
      root.style.setProperty('--glass-bg',         hexToRgba(card, 0.65));
      root.style.setProperty('--muted-foreground', '#94a3b8');
      root.classList.add('dark');
    } else {
      root.style.setProperty('--foreground',       '#0f172a');
      root.style.setProperty('--card-foreground',  cardIsDark ? '#f1f5f9' : '#0f172a');
      root.style.setProperty('--text-muted',       '#64748b');
      root.style.setProperty('--text-subtle',      '#94a3b8');
      root.style.setProperty('--border',           '#e2e8f0');
      root.style.setProperty('--border-color',     '#e2e8f0');
      root.style.setProperty('--input',            '#f1f5f9');
      root.style.setProperty('--surface-2',        '#f1f5f9');
      root.style.setProperty('--glass-bg',         'rgba(255,255,255,0.92)');
      root.style.setProperty('--muted-foreground', '#64748b');
      root.classList.remove('dark');
    }

    // ── Card ────────────────────────────────────────────────────────────────
    root.style.setProperty('--card',             card);
    root.style.setProperty('--navy-light',       card);
    root.style.setProperty('--popover',          card);
    root.style.setProperty('--popover-foreground', autoFg(card));

  }, [settings]);

  return null;
}