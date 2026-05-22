'use client';
import { useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';

export default function ThemeApplicator() {
  const settings = useSettings();

  useEffect(() => {
    if (!settings) return;
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
    }
    if (settings.secondaryColor) {
      document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor);
    }
  }, [settings]);

  return null;
}