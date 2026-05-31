'use client';

import Link from 'next/link';
import {
  Building2, Home, Store, TreePine, ChevronRight,
  Warehouse, Hotel, Landmark, MapPin,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/lib/services';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

const CITY_IMAGES: Record<string, string> = {
  'Gurgaon':   '/images/prop1.jpg',
  'Bangalore': '/images/prop2.jpg',
  'Mumbai':    '/images/prop3.jpg',
  'Noida':     '/images/prop4.jpg',
  'Hyderabad': '/images/prop1.jpg',
  'Pune':      '/images/prop2.jpg',
  'Delhi':     '/images/prop3.jpg',
  'Chennai':   '/images/prop4.jpg',
};
const IMG_FALLBACKS = ['/images/prop1.jpg', '/images/prop2.jpg', '/images/prop3.jpg', '/images/prop4.jpg'];

const STATIC_CATEGORIES = [
  { label: '2 BHK', sub: 'Ideal for Couples',  count: '200+', href: '/properties?configuration=2+BHK', icon: Home,     color: '#3b82f6', bg: 'rgba(59,130,246,0.08)'  },
  { label: '3 BHK', sub: 'Family Homes',        count: '150+', href: '/properties?configuration=3+BHK', icon: Home,     color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
  { label: '4 BHK', sub: 'Spacious Families',   count: '80+',  href: '/properties?configuration=4+BHK', icon: Home,     color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)'  },
  { label: 'Villa', sub: 'Independent House',   count: '60+',  href: '/properties?configuration=Villa',  icon: TreePine, color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
  { label: 'Plot',  sub: 'Residential Plot',    count: '40+',  href: '/properties?configuration=Plot',   icon: Store,    color: '#f97316', bg: 'rgba(249,115,22,0.08)'  },
  { label: '1 BHK', sub: 'Studio, Compact',     count: '100+', href: '/properties?configuration=1+BHK', icon: Home,     color: '#06b6d4', bg: 'rgba(6,182,212,0.08)'   },
];

const STATIC_CITIES = [
  { name: 'Gurgaon',   count: '200+', img: '/images/prop1.jpg' },
  { name: 'Bangalore', count: '150+', img: '/images/prop2.jpg' },
  { name: 'Mumbai',    count: '120+', img: '/images/prop3.jpg' },
  { name: 'Noida',     count: '100+', img: '/images/prop4.jpg' },
];

const CONFIG_META: Record<string, { icon: React.ElementType; color: string; bg: string; sub: string }> = {
  '1 BHK': { icon: Home,      color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   sub: 'Studio, Compact'   },
  '2 BHK': { icon: Home,      color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  sub: 'Ideal for Couples' },
  '3 BHK': { icon: Home,      color: '#6366f1', bg: 'rgba(99,102,241,0.08)',  sub: 'Family Homes'      },
  '4 BHK': { icon: Home,      color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', sub: 'Spacious Families' },
  '5 BHK': { icon: Home,      color: '#a855f7', bg: 'rgba(168,85,247,0.08)', sub: 'Ultra Luxury'      },
  'Villa': { icon: TreePine,  color: '#10b981', bg: 'rgba(16,185,129,0.08)', sub: 'Independent House' },
  'Plot':  { icon: Store,     color: '#f97316', bg: 'rgba(249,115,22,0.08)', sub: 'Residential Plot'  },
  'Office':{ icon: Building2, color: '#2563eb', bg: 'rgba(37,99,235,0.08)',  sub: 'Workspace'         },
  'Commercial': { icon: Landmark, color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', sub: 'Office, Shop'  },
  'Shop':  { icon: Store,     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', sub: 'Retail, Showroom'  },
  'Warehouse': { icon: Warehouse, color: '#64748b', bg: 'rgba(100,116,139,0.08)', sub: 'Storage'      },
  'Hotel': { icon: Hotel,     color: '#f43f5e', bg: 'rgba(244,63,94,0.08)',  sub: 'Hospitality'       },
  'Penthouse': { icon: Home,  color: '#eab308', bg: 'rgba(234,179,8,0.08)',  sub: 'Top Floor Luxury'  },
};

const FALLBACK_COLORS = [
  { color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
  { color: '#14b8a6', bg: 'rgba(20,184,166,0.08)' },
  { color: '#84cc16', bg: 'rgba(132,204,22,0.08)' },
  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)'  },
];

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K+` : `${n}+`;
}

function useWindowWidth() {
  const [w, setW] = useState(1200);
  useEffect(() => {
    setW(window.innerWidth);
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return w;
}

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function PropertyCategories() {
  const { accent, a } = useTheme();
  const { ref: catRef,  inView: catInView  } = useInView();
  const { ref: cityRef, inView: cityInView } = useInView();
  const windowWidth = useWindowWidth();

  const { data: propsRes } = useQuery({
    queryKey: ['properties-categories'],
    queryFn: () => propertyService.getAll({ limit: 1000 }),
    staleTime: 0, gcTime: 30_000,
    placeholderData: { success: true, data: [], total: 0, page: 1, limit: 1000, totalPages: 1 },
    retry: 3, retryDelay: 1000,
  });

  const { data: citiesRes } = useQuery({
    queryKey: ['property-cities-cat'],
    queryFn: () => propertyService.getCities(),
    staleTime: 0, gcTime: 30_000,
    placeholderData: { success: true, data: [] },
    retry: 3, retryDelay: 1000,
  });

  const apiCategories = (() => {
    const data = propsRes?.data ?? [];
    if (data.length === 0) return null;
    const countMap: Record<string, number> = {};
    data.forEach(p => { if (p.configuration) countMap[p.configuration] = (countMap[p.configuration] || 0) + 1; });
    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([config, count], idx) => {
        const meta = CONFIG_META[config] ?? { icon: Building2, ...FALLBACK_COLORS[idx % FALLBACK_COLORS.length], sub: 'Properties' };
        return { label: config, sub: meta.sub, count: fmt(count), href: `/properties?configuration=${encodeURIComponent(config)}`, icon: meta.icon, color: meta.color, bg: meta.bg };
      });
  })();
  const categories = apiCategories ?? STATIC_CATEGORIES;

  const apiCities = (citiesRes?.data ?? []).slice(0, 4);
  const topCities = apiCities.length > 0
    ? apiCities.map((c, i) => ({ name: c.city, count: fmt(c.count), img: CITY_IMAGES[c.city] || IMG_FALLBACKS[i % IMG_FALLBACKS.length] }))
    : STATIC_CITIES;

  // Compute exact column count based on screen + item count — no empty space
  const n = categories.length;
  const cols = windowWidth < 640 ? 2 : windowWidth < 1024 ? 3 : n;

  return (
    <section className="py-16" style={{ background: 'var(--surface-2,#f1f5f9)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 size={14} style={{ color: accent }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>Browse By Type</span>
          </div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Property Categories</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Find exactly what you&apos;re looking for</p>
        </div>

        {/* THE FIX: exact column count = n, no leftover space */}
        <div
          ref={catRef}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '16px',
            marginBottom: '56px',
          }}
        >
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.label} href={cat.href} className="group"
                style={{
                  opacity:    catInView ? 1 : 0,
                  transform:  catInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ease ${idx * 0.06}s, transform 0.5s ease ${idx * 0.06}s`,
                }}>
                <div
                  className="rounded-2xl p-5 text-center h-full cursor-pointer"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = cat.color;
                    el.style.boxShadow = `0 4px 20px ${cat.color}22`;
                    el.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'var(--border)';
                    el.style.boxShadow = 'none';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: cat.bg }}>
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>{cat.label}</p>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{cat.sub}</p>
                  <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.count}</span>
                  <div className="flex items-center justify-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium" style={{ color: cat.color }}>Explore</span>
                    <ChevronRight size={11} style={{ color: cat.color }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Top Cities */}
        <div className="flex items-end justify-between mb-5 gap-3">
          <div>
            <h3 className="font-bold text-xl" style={{ color: 'var(--foreground)' }}>Top Cities</h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>India&apos;s hottest real estate markets</p>
          </div>
          <Link href="/properties" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: accent }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>

        <div ref={cityRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topCities.map((city, idx) => (
            <Link key={city.name} href={`/properties?city=${encodeURIComponent(city.name)}`}
              className="group relative rounded-2xl overflow-hidden h-52 block"
              style={{
                opacity:    cityInView ? 1 : 0,
                transform:  cityInView ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
                transition: `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`,
              }}>
              <img src={city.img} alt={city.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={e => { (e.target as HTMLImageElement).src = IMG_FALLBACKS[idx % 4]; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-xl leading-tight">{city.name}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>{city.count} properties</p>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <div className="rounded-full p-1.5 border border-white/20" style={{ background: `${accent}cc` }}>
                  <ChevronRight size={14} color="#fff" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: accent }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}