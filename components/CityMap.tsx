'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2, ChevronRight, TrendingUp } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const CITIES = [
  {
    name: 'Noida',
    properties: '1,800+',
    trend: '+11.4%',
    highlights: ['Sector 62', 'Sector 137', 'Greater Noida'],
    color: '#8b5cf6',
    // Google Maps embed URL centered on this city
    mapQ: 'Noida,Uttar+Pradesh,India',
  },
  {
    name: 'Delhi',
    properties: '2,400+',
    trend: '+8.2%',
    highlights: ['Dwarka', 'Rohini', 'Lajpat Nagar'],
    color: '#3b82f6',
    mapQ: 'New+Delhi,India',
  },
  {
    name: 'Ghaziabad',
    properties: '980+',
    trend: '+6.7%',
    highlights: ['Vaishali', 'Indirapuram', 'Raj Nagar'],
    color: '#f97316',
    mapQ: 'Ghaziabad,Uttar+Pradesh,India',
  },
  {
    name: 'Gurgaon',
    properties: '3,200+',
    trend: '+13.1%',
    highlights: ['DLF Phase 4', 'Sector 56', 'Golf Course Rd'],
    color: '#10b981',
    mapQ: 'Gurugram,Haryana,India',
  },
];

// NCR-wide embed (shows all 4 cities at once)
const NCR_EMBED = `https://maps.google.com/maps?q=NCR+Delhi+India&t=m&z=10&output=embed&iwloc=near`;

export default function CityMap() {
  const { accent, accentFg, a } = useTheme();
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const city = CITIES.find(c => c.name === activeCity);

  // Switch map when a city is hovered
  const mapSrc = activeCity && city
    ? `https://maps.google.com/maps?q=${city.mapQ}&t=m&z=13&output=embed&iwloc=near`
    : NCR_EMBED;

  return (
    <section className="py-16" style={{ background: 'var(--surface-2,#f1f5f9)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={14} style={{ color: accent }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
              NCR Coverage
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
            Properties Across NCR
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Hover a city below to explore on map · click to browse listings
          </p>
        </div>

        {/* Google Map */}
        <div
          className="rounded-3xl overflow-hidden border shadow-md mb-6"
          style={{ borderColor: 'var(--border)', height: '420px' }}
        >
          <iframe
            key={mapSrc}   /* re-mount when src changes to trigger smooth load */
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={activeCity ? `Map of ${activeCity}` : 'NCR Region Map'}
          />
        </div>

        {/* City cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CITIES.map(c => {
            const isActive = activeCity === c.name;
            return (
              <Link
                key={c.name}
                href={`/properties?city=${encodeURIComponent(c.name)}`}
                className="rounded-2xl border p-4 group transition-all duration-300 block"
                style={{
                  background:  isActive ? `${c.color}0c` : 'var(--card)',
                  borderColor: isActive ? `${c.color}55` : 'var(--border)',
                  boxShadow:   isActive ? `0 4px 20px ${c.color}18` : 'none',
                  transform:   isActive ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setActiveCity(c.name)}
                onMouseLeave={() => setActiveCity(null)}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
                  style={{
                    background: isActive ? c.color : `${c.color}12`,
                    boxShadow:  isActive ? `0 4px 12px ${c.color}35` : 'none',
                  }}
                >
                  <Building2 size={17} style={{ color: isActive ? '#fff' : c.color }} />
                </div>

                {/* City name */}
                <p className="font-bold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>
                  {c.name}
                </p>

                {/* Properties + trend */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-semibold" style={{ color: c.color }}>
                    {c.properties}
                  </span>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}
                  >
                    {c.trend}
                  </span>
                </div>

                {/* Highlights */}
                <div className="flex flex-col gap-0.5">
                  {c.highlights.map(h => (
                    <span key={h} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      · {h}
                    </span>
                  ))}
                </div>

                {/* CTA arrow */}
                <div
                  className="flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: c.color }}
                >
                  Browse <ChevronRight size={11} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border px-6 py-2.5 rounded-full font-medium text-sm transition-all"
            style={{ borderColor: `${accent}40`, color: accent }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background  = `${accent}0e`;
              (e.currentTarget as HTMLElement).style.borderColor = accent;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background  = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
            }}
          >
            Browse All NCR Properties <TrendingUp size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}