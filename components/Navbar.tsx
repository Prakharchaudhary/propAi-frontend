'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, Phone } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { useTheme } from '@/hooks/use-theme';
import ThemeToggle from './ThemeToggle';

// ← AI Search removed
const navLinks = [
  { label: 'Properties', href: '/properties' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact',    href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settings = useSettings();
  const { accent, bg, accentFg, a } = useTheme();

  const phone      = settings?.contact?.phone    || '+91 99999 99999';
  const whatsapp   = settings?.contact?.whatsapp || '919999999999';
  const dealerName = settings?.dealerName        || 'PropAI';

  // determine if bg is dark so we pick correct text colour for navbar links
  // Navbar always dark — fixed link colors
  const linkColor      = '#94a3b8';
  const linkHoverColor = '#ffffff';
  const mobileTextColor = '#cbd5e1';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        backgroundColor: `var(--card)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      } : {
        backgroundColor: 'var(--card)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {settings?.logo?.url ? (
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-xl border" style={{ background: 'var(--background)',
borderColor: 'var(--border),' }}>
                  <img src={settings.logo.url} alt={dealerName} className="h-9 w-auto object-contain" />
                </div>
                <div className="hidden sm:block leading-tight">
  <h2
    className="text-sm font-bold truncate max-w-[220px]"
    style={{
      color: 'var(--foreground)',
    }}
  >
    {dealerName}
  </h2>

  <p
    className="text-xs"
    style={{
      color: 'var(--muted-foreground)',
    }}
  >
    Real Estate Consultant
  </p>
</div>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center pulse-gold"
                  style={{ backgroundColor: accent }}>
                  <Sparkles size={18} style={{ color: accentFg }} />
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>Prop</span>
                  <span className="text-xl font-bold tracking-tight" style={{ color: accent }}>AI</span>
                  <span className="text-xl font-bold" style={{ color: accent }}>.</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: linkColor }}
                onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
                onMouseLeave={e => (e.currentTarget.style.color = linkColor)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a href={`tel:${phone}`}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: linkColor }}
              onMouseEnter={e => (e.currentTarget.style.color = accent)}
              onMouseLeave={e => (e.currentTarget.style.color = linkColor)}>
              <Phone size={14} />
              <span className="font-medium">{phone}</span>
            </a>
            <Link href="/contact"
              className="font-semibold px-4 py-2 rounded-full text-sm transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: accent, color: accentFg }}>
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
            style={{ color: 'var(--foreground)' }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block px-2 py-3 text-sm font-medium transition-colors"
                style={{ color: mobileTextColor }}
                onMouseEnter={e => (e.currentTarget.style.color = accent)}
                onMouseLeave={e => (e.currentTarget.style.color = mobileTextColor)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-2">
              <Link href="/contact" onClick={() => setMenuOpen(false)}
                className="flex-1 py-2.5 rounded-full font-semibold text-center text-sm"
                style={{ backgroundColor: accent, color: accentFg }}>
                Get Started
              </Link>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
                className="flex-1 py-2.5 rounded-full font-semibold text-center text-sm border"
                style={{ borderColor: a(0.3), color: accent }}>
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}