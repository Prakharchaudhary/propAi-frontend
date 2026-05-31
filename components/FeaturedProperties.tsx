'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize, ShieldCheck, Sparkles, ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { propertyService } from '@/lib/services';
import type { Property } from '@/lib/types';
import { useTheme } from '@/hooks/use-theme';

const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'New Launch':    { bg: 'rgba(59,130,246,0.12)',  text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  'Hot Deal':      { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444', border: 'rgba(239,68,68,0.3)'  },
  'Ready to Move': { bg: 'rgba(16,185,129,0.12)',  text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  'Premium':       { bg: 'rgba(139,92,246,0.12)',  text: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
};

function PropertyCard({ property, theme }: { property: Property; theme: ReturnType<typeof useTheme> }) {
  const { accent, accentFg, a } = theme;
  const img = property.images?.find((i: any) => i.isPrimary)?.url || property.images?.[0]?.url || null;
  const badge = property.badge ? BADGE_COLORS[property.badge] : null;

  return (
    <Link href={`/properties/${property.slug}`} className="block group flex-shrink-0" style={{ width: '300px' }}>
      <div
        className="rounded-2xl overflow-hidden border h-full"
        style={{ background: 'var(--card)', borderColor: 'var(--border)', transition: 'all 0.3s ease' }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = `${accent}55`;
          el.style.boxShadow   = `0 12px 36px ${a(0.12)}`;
          el.style.transform   = 'translateY(-6px)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--border)';
          el.style.boxShadow   = 'none';
          el.style.transform   = 'translateY(0)';
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: '200px', background: 'var(--surface-2,#f1f5f9)' }}>
          {img ? (
            <img src={img} alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `${accent}08` }}>
              <Sparkles size={36} style={{ color: `${accent}40` }} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badge && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm"
                style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}>
                {property.badge}
              </span>
            )}
            {property.isReraRegistered && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 backdrop-blur-sm"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', borderColor: 'rgba(16,185,129,0.35)' }}>
                <ShieldCheck size={9} /> RERA
              </span>
            )}
          </div>

          {property.aiMatch && (
            <div className="absolute top-3 right-3 rounded-full px-2 py-0.5 flex items-center gap-1 backdrop-blur-sm border"
              style={{ background: `${accent}22`, borderColor: `${accent}44` }}>
              <Sparkles size={9} style={{ color: accent }} />
              <span className="text-xs font-bold" style={{ color: accent }}>{property.aiMatch}%</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3">
            <span className="text-white font-bold text-lg drop-shadow-lg">
              ₹{property.priceLabel || property.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-sm leading-snug mb-1.5 line-clamp-2" style={{ color: 'var(--foreground)' }}>
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            <MapPin size={10} style={{ color: accent }} />
            <span className="line-clamp-1">
              {property.locality}{property.locality && property.city ? ', ' : ''}{property.city}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap mb-4" style={{ color: 'var(--text-muted)' }}>
            {property.configuration && (
              <span className="font-semibold px-2 py-0.5 rounded-md" style={{ background: `${accent}10`, color: accent }}>
                {property.configuration}
              </span>
            )}
            {property.bedrooms  && <span className="flex items-center gap-0.5"><Bed size={10} /> {property.bedrooms}</span>}
            {property.bathrooms && <span className="flex items-center gap-0.5"><Bath size={10} /> {property.bathrooms}</span>}
            {property.area      && <span className="flex items-center gap-0.5"><Maximize size={10} /> {property.area}sqft</span>}
          </div>
          <div className="w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-opacity group-hover:opacity-90"
            style={{ background: accent, color: accentFg }}>
            View Full Details <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProperties() {
  const theme = useTheme();
  const { accent, a } = theme;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]       = useState(true);
  const [current, setCurrent]       = useState(0);
  const [paused, setPaused]         = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const CARD_W   = 316; // 300px + 16px gap
  const VISIBLE  = 3;
  const INTERVAL = 3000;

  useEffect(() => {
    propertyService.getAll({ limit: 20 })
      .then(res => setProperties(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxIdx = Math.max(0, properties.length - VISIBLE);

  // Sync scroll position
  useEffect(() => {
    trackRef.current?.scrollTo({ left: current * CARD_W, behavior: 'smooth' });
  }, [current]);

  // Auto-slide
  useEffect(() => {
    if (paused || properties.length <= VISIBLE) return;
    const t = setInterval(() => {
      setCurrent(c => (c >= maxIdx ? 0 : c + 1));
    }, INTERVAL);
    return () => clearInterval(t);
  }, [paused, properties.length, maxIdx]);

  // Header reveal
  const hRef = useRef<HTMLDivElement>(null);
  const [hVis, setHVis] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = hRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-16" id="featured" style={{ background: 'var(--background)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={hRef} className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
          style={{ opacity: hVis ? 1 : 0, transform: hVis ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${accent}14` }}>
                <Sparkles size={13} style={{ color: accent }} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>AI Curated</span>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Featured Properties</h2>
            <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <TrendingUp size={12} style={{ color: accent }} /> Handpicked by AI · auto-sliding
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setCurrent(c => (c <= 0 ? maxIdx : c - 1))}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--card)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
              <ChevronLeft size={17} />
            </button>
            <button onClick={() => setCurrent(c => (c >= maxIdx ? 0 : c + 1))}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--card)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        {loading ? (
          <div className="flex gap-4">
            {[0,1,2].map(i => (
              <div key={i} className="rounded-2xl border overflow-hidden flex-shrink-0"
                style={{ width: '300px', borderColor: 'var(--border)', background: 'var(--card)' }}>
                <div className="h-48 skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 skeleton w-3/4" /><div className="h-3 skeleton w-1/2" /><div className="h-8 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={trackRef} className="flex gap-4 overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
            {properties.map((p, i) => (
              <PropertyCard key={(p as any)._id || p.id || i} property={p} theme={theme} />
            ))}
          </div>
        )}

        {/* Dots + progress */}
        {!loading && properties.length > VISIBLE && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i+1}`}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === current ? '22px' : '7px', height: '7px', background: i === current ? accent : 'var(--border)' }} />
              ))}
            </div>
            <div className="w-56 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div key={current} className="h-full rounded-full"
                style={{ background: accent, animation: `propProgress ${INTERVAL}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }} />
            </div>
          </div>
        )}

        {/* View all */}
        <div className="text-center mt-8">
          <Link href="/properties"
            className="inline-flex items-center gap-2 border px-6 py-2.5 rounded-full font-medium text-sm transition-all"
            style={{ borderColor: `${accent}40`, color: accent }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${accent}0e`; (e.currentTarget as HTMLElement).style.borderColor = accent; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`; }}>
            View All Properties <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes propProgress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </section>
  );
}