'use client';

import { useState } from 'react';
import {
  Train, ShoppingBag, Heart, GraduationCap, Utensils,
  Landmark, Star, ChevronDown, ChevronUp, MapPin, Loader2
} from 'lucide-react';
import { localityService } from '@/lib/services';
import { useTheme } from '@/hooks/use-theme';

interface LocalityInsightsProps {
  lat?: number;
  lng?: number;
  locality?: string;
  city?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: any; iconColor: string; bg: string; border: string }> = {
  'Metro Stations': { icon: Train,         iconColor: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.20)'  },
  'Malls':          { icon: ShoppingBag,   iconColor: '#8b5cf6', bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.20)'  },
  'Hospitals':      { icon: Heart,         iconColor: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.20)'   },
  'Schools':        { icon: GraduationCap, iconColor: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.20)'  },
  'Restaurants':    { icon: Utensils,      iconColor: '#f97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.20)'  },
  'Banks':          { icon: Landmark,      iconColor: '#eab308', bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.20)'   },
};

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return (
    <span className="text-xs" style={{ color: 'var(--text-subtle,#94a3b8)' }}>No rating</span>
  );
  return (
    <div className="flex items-center gap-1">
      <Star size={10} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
      <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{rating}</span>
    </div>
  );
}

export default function LocalityInsights({ lat, lng, locality, city }: LocalityInsightsProps) {
  const { accent, accentFg, a } = useTheme();
  const [data, setData]                 = useState<any>(null);
  const [loading, setLoading]           = useState(false);
  const [loaded, setLoaded]             = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>('Metro Stations');
  const [expanded, setExpanded]         = useState(false);

  const fetchInsights = async () => {
    if (loaded) { setExpanded(!expanded); return; }
    if (!lat || !lng) return;
    setLoading(true);
    setExpanded(true);
    try {
      const res = await localityService.getNearby(lat, lng);
      setData(res);
      setLoaded(true);
      const firstKey = Object.keys(res)[0];
      if (firstKey) setActiveCategory(firstKey);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const categories  = data ? Object.keys(data) : [];
  const activeItems = data && activeCategory ? data[activeCategory] || [] : [];

  if (!lat || !lng) return null;

  return (
    <div className="mt-8">
      {/* Toggle Button */}
      <button
        onClick={fetchInsights}
        className="w-full rounded-2xl p-4 flex items-center justify-between transition-all duration-200 border"
        style={{
          background:   'var(--card)',
          borderColor:  `${accent}25`,
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}55`)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = `${accent}25`)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{ background: `${accent}10`, borderColor: `${accent}25` }}>
            <MapPin size={18} style={{ color: accent }} />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              Locality Insights
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {locality ? `${locality}, ` : ''}{city} ke paas kya hai?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 size={16} style={{ color: accent }} className="animate-spin" />}
          {!loading && (
            expanded
              ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} />
              : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="mt-3 rounded-2xl border overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 size={28} style={{ color: accent }} className="animate-spin mx-auto mb-3" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Nearby places fetch ho rahe hain...
              </p>
            </div>
          ) : data ? (
            <>
              {/* Category Tabs */}
              <div className="flex overflow-x-auto gap-1.5 p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                {categories.map(cat => {
                  const config = CATEGORY_CONFIG[cat];
                  const Icon   = config?.icon;
                  const isActive = activeCategory === cat;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                      style={isActive
                        ? { background: accent, color: accentFg, borderColor: accent }
                        : { background: 'var(--surface-2,#f1f5f9)', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                      }
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = accent; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                    >
                      {Icon && <Icon size={11} />}
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Places list */}
              <div className="p-3 flex flex-col gap-2">
                {activeItems.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
                    Is area mein {activeCategory} nahi mila.
                  </p>
                ) : (
                  activeItems.map((place: any, i: number) => {
                    const config = activeCategory ? CATEGORY_CONFIG[activeCategory] : null;
                    const Icon   = config?.icon;
                    return (
                      <div key={i}
                        className="flex items-start gap-3 p-3 rounded-xl border"
                        style={{
                          background:  config?.bg   || 'var(--surface-2,#f1f5f9)',
                          borderColor: config?.border || 'var(--border)',
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: config?.bg || 'var(--surface-2,#f1f5f9)' }}>
                          {Icon && <Icon size={14} style={{ color: config?.iconColor || accent }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* ← THE FIX: was text-white, now uses --foreground */}
                          <p className="text-sm font-medium line-clamp-1" style={{ color: 'var(--foreground)' }}>
                            {place.name}
                          </p>
                          <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {place.vicinity}
                          </p>
                        </div>
                        <StarRating rating={place.rating} />
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs text-center" style={{ color: 'var(--text-subtle,#94a3b8)' }}>
                  Powered by Google Places API
                </p>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Locality data load nahi hua. Dobara try karo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}