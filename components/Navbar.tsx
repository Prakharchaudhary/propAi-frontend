'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, Phone } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Properties', href: '/properties' },
  { label: 'AI Search', href: '#ai-search' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settings = useSettings();

  const phone = settings?.contact?.phone || '+91 99999 99999';
  const whatsapp = settings?.contact?.whatsapp || '919999999999';
  const dealerName = settings?.dealerName || 'PropAI';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a1120]/90 backdrop-blur-xl border-b border-[#e4b363]/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {settings?.logo?.url ? (
              <div className="flex items-center gap-3">
  <div className="bg-white dark:bg-[#111827] p-2 rounded-xl border border-slate-200 dark:border-[#e4b363]/10 shadow-sm">
    <img
      src={settings.logo.url}
      alt={dealerName}
      className="h-10 w-auto object-contain"
    />
  </div>

  <div className="hidden sm:block leading-tight">
    <h2 className="text-white dark:text-white text-sm font-semibold tracking-wide">
      {dealerName}
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-xs">
      Real Estate Consultant
    </p>
  </div>
</div>
            ) : (
              <>
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-[#e4b363] flex items-center justify-center pulse-gold">
                    <Sparkles size={18} className="text-[#0f1a2f]" />
                  </div>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-white text-xl font-bold tracking-tight">Prop</span>
                  <span className="text-[#e4b363] text-xl font-bold tracking-tight">AI</span>
                  <span className="text-[#e4b363] text-xl font-bold">.</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a

              href={`tel:${phone}`}

              className="flex items-center gap-2 text-slate-400 hover:text-[#e4b363] transition-colors text-sm"
            >
              <Phone size={15} />
              <span className="font-medium">{phone}</span>
            </a>
            <Link
              href="/contact"
              className="relative overflow-hidden bg-[#e4b363] text-[#0f1a2f] font-semibold px-5 py-2 rounded-full text-sm hover:bg-[#f0cc8a] transition-all duration-300 hover:shadow-[0_0_20px_rgba(228,179,99,0.4)]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-[#e4b363]/10 py-4 rounded-b-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-slate-300 hover:text-[#e4b363] font-medium transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-3 flex gap-3">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex-1 bg-[#e4b363] text-[#0f1a2f] px-5 py-2.5 rounded-full font-semibold text-center text-sm"
              >
                Get Started
              </Link>
              <a
              

                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 glass-gold text-[#e4b363] px-5 py-2.5 rounded-full font-semibold text-center text-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}