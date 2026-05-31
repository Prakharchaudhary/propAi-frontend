'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSettings } from '@/lib/settings-context';

function hexToRgba(hex: string, alpha: number) {
  try {
    const c = hex.replace('#', '');
    const full = c.length === 3 ? c.split('').map(x => x+x).join('') : c;
    const r = parseInt(full.slice(0,2),16), g = parseInt(full.slice(2,4),16), b = parseInt(full.slice(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch { return `rgba(37,99,235,${alpha})`; }
}

function applyTheme(isDark: boolean, accentColor?: string) {
  const root = document.documentElement;
  const accent = accentColor || (isDark ? '#e4b363' : '#2563eb');

  if (isDark) {
    // ── Dark mode tokens ──────────────────────────────────────
    root.style.setProperty('--background',   '#0a1120');
    root.style.setProperty('--foreground',   '#f1f5f9');
    root.style.setProperty('--card',         'rgba(22,36,64,0.8)');
    root.style.setProperty('--surface',      '#162440');
    root.style.setProperty('--surface-2',    '#080f1e');
    root.style.setProperty('--border',       'rgba(255,255,255,0.08)');
    root.style.setProperty('--border-color', 'rgba(255,255,255,0.08)');
    root.style.setProperty('--input',        'rgba(255,255,255,0.06)');
    root.style.setProperty('--text-muted',   '#94a3b8');
    root.style.setProperty('--text-subtle',  '#64748b');
    root.style.setProperty('--navy',         '#0a1120');
    root.style.setProperty('--navy-light',   '#162440');
    root.style.setProperty('--glass-bg',     'rgba(15,26,47,0.7)');
    document.body.style.backgroundColor = '#0a1120';
    document.body.style.color = '#f1f5f9';
    root.classList.add('dark');
  } else {
    // ── Light mode tokens ─────────────────────────────────────
    root.style.setProperty('--background',   '#f8fafc');
    root.style.setProperty('--foreground',   '#0f172a');
    root.style.setProperty('--card',         '#ffffff');
    root.style.setProperty('--surface',      '#ffffff');
    root.style.setProperty('--surface-2',    '#f1f5f9');
    root.style.setProperty('--border',       '#e2e8f0');
    root.style.setProperty('--border-color', '#e2e8f0');
    root.style.setProperty('--input',        '#f1f5f9');
    root.style.setProperty('--text-muted',   '#64748b');
    root.style.setProperty('--text-subtle',  '#94a3b8');
    root.style.setProperty('--navy',         '#1e293b');
    root.style.setProperty('--navy-light',   '#334155');
    root.style.setProperty('--glass-bg',     'rgba(255,255,255,0.88)');
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#0f172a';
    root.classList.remove('dark');
  }

  // Accent always applies
  root.style.setProperty('--accent',        accent);
  root.style.setProperty('--primary',       accent);
  root.style.setProperty('--gold',          accent);
  root.style.setProperty('--ring',          accent);
  root.style.setProperty('--glass-border',  hexToRgba(accent, isDark ? 0.2 : 0.12));
}

export default function ThemeToggle() {
  const settings = useSettings();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount: check saved preference, default to light
    const saved = localStorage.getItem('propai-theme');
    const dark  = saved === 'dark';
    setIsDark(dark);
    applyTheme(dark, settings?.accentColor);
  }, []); // eslint-disable-line

  // Re-apply accent when settings load
  useEffect(() => {
    if (!settings?.accentColor) return;
    applyTheme(isDark, settings.accentColor);
  }, [settings?.accentColor, isDark]);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('propai-theme', next ? 'dark' : 'light');
    applyTheme(next, settings?.accentColor);
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Day mode' : 'Night mode'}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300"
      style={{
        background:   isDark ? '#1e293b' : '#ffffff',
        borderColor:  isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0',
        boxShadow:    isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
        color:        isDark ? '#fbbf24' : '#475569',
      }}
    >
      {isDark
        ? <Sun  size={17} className="transition-transform duration-300 rotate-0" />
        : <Moon size={17} className="transition-transform duration-300 rotate-0" />
      }
    </button>
  );
}