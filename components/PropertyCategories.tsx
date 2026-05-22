'use client';

import Link from 'next/link';
import {
  Building2, Home, Store, TreePine, ChevronRight,
  Warehouse, Hotel, Landmark,
} from 'lucide-react';
import { useProperties, usePropertyCities } from '@/hooks/use-properties';
import { useEffect, useRef, useState } from 'react';

const CONFIG_META: Record<string, { icon: React.ElementType; color: string; bg: string; gradient: string; sub: string; listingType?: string }> = {
  '1 BHK': { icon: Home, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', gradient: 'from-cyan-500/20 to-cyan-500/0', sub: 'Studio, Compact' },
  '2 BHK': { icon: Home, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', gradient: 'from-blue-500/20 to-blue-500/0', sub: 'Ideal for Couples' },
  '3 BHK': { icon: Home, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', gradient: 'from-indigo-500/20 to-indigo-500/0', sub: 'Family Homes' },
  '4 BHK': { icon: Home, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', gradient: 'from-violet-500/20 to-violet-500/0', sub: 'Spacious Families' },
  '5 BHK': { icon: Home, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20', gradient: 'from-fuchsia-500/20 to-fuchsia-500/0', sub: 'Ultra Luxury' },
  Villa: { icon: TreePine, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', gradient: 'from-green-500/20 to-green-500/0', sub: 'Independent, Row House' },
  Plot: { icon: Store, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', gradient: 'from-orange-500/20 to-orange-500/0', sub: 'Residential, Commercial' },
  Office: { icon: Building2, color: 'text-[#e4b363]', bg: 'bg-[#e4b363]/10 border-[#e4b363]/20', gradient: 'from-[#e4b363]/20 to-[#e4b363]/0', sub: 'Workspace, Co-working', listingType: 'Lease' },
  Shop: { icon: Store, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', gradient: 'from-amber-500/20 to-amber-500/0', sub: 'Retail, Showroom' },
  Warehouse: { icon: Warehouse, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', gradient: 'from-slate-500/20 to-slate-500/0', sub: 'Storage, Industrial' },
  Hotel: { icon: Hotel, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', gradient: 'from-rose-500/20 to-rose-500/0', sub: 'Hospitality' },
  Commercial: { icon: Landmark, color: 'text-[#e4b363]', bg: 'bg-[#e4b363]/10 border-[#e4b363]/20', gradient: 'from-[#e4b363]/20 to-[#e4b363]/0', sub: 'Office, Shop, Showroom', listingType: 'Lease' },
  'Studio Apartment': { icon: Home, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20', gradient: 'from-teal-500/20 to-teal-500/0', sub: 'Compact Living' },
  Penthouse: { icon: Home, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', gradient: 'from-yellow-500/20 to-yellow-500/0', sub: 'Top Floor Luxury' },
  Farm: { icon: TreePine, color: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/20', gradient: 'from-lime-500/20 to-lime-500/0', sub: 'Farmhouse, Agri Land' },
};

const FALLBACK_COLORS = [
  { color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', gradient: 'from-pink-500/20 to-pink-500/0' },
  { color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20', gradient: 'from-teal-500/20 to-teal-500/0' },
  { color: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/20', gradient: 'from-lime-500/20 to-lime-500/0' },
  { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', gradient: 'from-red-500/20 to-red-500/0' },
  { color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', gradient: 'from-sky-500/20 to-sky-500/0' },
  { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', gradient: 'from-purple-500/20 to-purple-500/0' },
];

const CITY_IMAGES = ['/images/prop1.jpg', '/images/prop2.jpg', '/images/prop3.jpg', '/images/prop4.jpg'];

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
  return `${n}+`;
}

// Grid col class based on count
function getGridCols(count: number) {
  if (count === 1) return 'grid-cols-1 max-w-xs mx-auto';
  if (count === 2) return 'grid-cols-2 max-w-lg mx-auto';
  if (count === 3) return 'grid-cols-3 max-w-2xl mx-auto';
  if (count === 4) return 'grid-cols-2 sm:grid-cols-4';
  if (count === 5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
  return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
}

// Animate on scroll hook
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

export default function PropertyCategories() {
  const { data: propertiesRes, isLoading: loadingProps } = useProperties({ limit: 1000 });
  const { data: citiesRes, isLoading: loadingCities } = usePropertyCities();
  const { ref: catRef, inView: catInView } = useInView();
  const { ref: cityRef, inView: cityInView } = useInView();

  const categories = (() => {
    if (!propertiesRes?.data) return [];
    const countMap: Record<string, number> = {};
    propertiesRes.data.forEach((p) => {
      if (p.configuration) countMap[p.configuration] = (countMap[p.configuration] || 0) + 1;
    });
    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([configuration, count], idx) => {
        const meta = CONFIG_META[configuration] ?? {
          icon: Building2,
          ...FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
          sub: 'Properties',
        };
        const params = new URLSearchParams({ configuration });
        if (meta.listingType) params.set('listingType', meta.listingType);
        return {
          label: configuration,
          sub: meta.sub,
          count: formatCount(count),
          href: `/properties?${params.toString()}`,
          icon: meta.icon,
          color: meta.color,
          bg: meta.bg,
          gradient: meta.gradient,
        };
      });
  })();

  const topCities = (citiesRes?.data ?? []).slice(0, 4).map((c, i) => ({
    name: c.city,
    count: formatCount(c.count),
    img: CITY_IMAGES[i % CITY_IMAGES.length],
  }));

  const isLoading = loadingProps || loadingCities;

  return (
    <section id="categories" className="py-20 bg-[#080f1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Building2 size={14} className="text-[#e4b363]" />
            <span className="text-[#e4b363] text-xs font-semibold tracking-widest uppercase">Browse By Type</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Property Categories</h2>
          <p className="text-slate-500 text-sm">Find exactly what you&apos;re looking for</p>
        </div>

        {/* Category grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl h-48 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div ref={catRef} className={`grid ${getGridCols(categories.length)} gap-5 mb-16`}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group"
                  style={{
                    opacity: catInView ? 1 : 0,
                    transform: catInView ? 'translateY(0)' : 'translateY(32px)',
                    transition: `opacity 0.5s ease ${idx * 0.08}s, transform 0.5s ease ${idx * 0.08}s`,
                  }}
                >
                  <div className="relative glass rounded-2xl p-7 border border-white/8 hover:border-[#e4b363]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl text-center overflow-hidden h-full">
                    {/* Gradient glow bottom */}
                    <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${cat.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className={cat.color} />
                    </div>

                    <p className="text-white font-bold text-base mb-1">{cat.label}</p>
                    <p className="text-slate-500 text-xs leading-tight mb-3">{cat.sub}</p>
                    <span className={`text-sm font-bold ${cat.color}`}>{cat.count} listings</span>

                    {/* Arrow on hover */}
                    <div className="flex items-center justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                      <span className={`text-xs font-semibold ${cat.color}`}>Explore</span>
                      <ChevronRight size={12} className={cat.color} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Top Cities */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-6 gap-3">
          <div>
            <h3 className="text-white font-bold text-2xl">Top Cities</h3>
            <p className="text-slate-500 text-sm mt-1">India&apos;s hottest real estate markets right now</p>
          </div>
          <Link href="/properties" className="flex items-center gap-1 text-[#e4b363] text-sm font-semibold hover:gap-2 transition-all">
            View all cities <ChevronRight size={15} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl h-52 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div ref={cityRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {topCities.map((city, idx) => (
              <Link
                key={city.name}
                href={`/properties?city=${encodeURIComponent(city.name)}`}
                className="group relative rounded-2xl overflow-hidden h-52 block"
                style={{
                  opacity: cityInView ? 1 : 0,
                  transform: cityInView ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
                  transition: `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`,
                }}
              >
                <img
                  src={city.img}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/95 via-[#0a1120]/40 to-transparent" />
                <div className="absolute inset-0 bg-[#e4b363]/0 group-hover:bg-[#e4b363]/5 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-xl leading-tight">{city.name}</p>
                  <p className="text-[#e4b363] text-xs font-semibold mt-0.5">{city.count} properties</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <div className="glass-gold rounded-full p-1.5">
                    <ChevronRight size={14} className="text-[#e4b363]" />
                  </div>
                </div>
                {/* Bottom border glow on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e4b363] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}