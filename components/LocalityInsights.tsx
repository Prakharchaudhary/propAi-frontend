'use client';

import { useState } from 'react';
import {
  Train, ShoppingBag, Heart, GraduationCap, Utensils,
  Landmark, Star, ChevronDown, ChevronUp, MapPin, Loader2
} from 'lucide-react';
import { localityService } from '@/lib/services';

interface LocalityInsightsProps {
  lat?: number;
  lng?: number;
  locality?: string;
  city?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  'Metro Stations': { icon: Train, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  'Malls': { icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  'Hospitals': { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  'Schools': { icon: GraduationCap, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  'Restaurants': { icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  'Banks': { icon: Landmark, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
};

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-slate-600 text-xs">No rating</span>;
  return (
    <div className="flex items-center gap-1">
      <Star size={10} className="text-[#e4b363] fill-[#e4b363]" />
      <span className="text-slate-300 text-xs font-medium">{rating}</span>
    </div>
  );
}

export default function LocalityInsights({ lat, lng, locality, city }: LocalityInsightsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>('Metro Stations');
  const [expanded, setExpanded] = useState(false);

  const fetchInsights = async () => {
    if (loaded) {
      setExpanded(!expanded);
      return;
    }

    if (!lat || !lng) return;

    setLoading(true);
    setExpanded(true);
    try {
      const res = await localityService.getNearby(lat, lng);
      setData(res);
      setLoaded(true);
      // Set first available category as active
      const firstKey = Object.keys(res)[0];
      if (firstKey) setActiveCategory(firstKey);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const categories = data ? Object.keys(data) : [];
  const activeItems = data && activeCategory ? data[activeCategory] || [] : [];

  if (!lat || !lng) return null;

  return (
    <div className="mt-8">
      {/* Toggle Button */}
      <button
        onClick={fetchInsights}
        className="w-full glass rounded-2xl border border-[#e4b363]/20 hover:border-[#e4b363]/40 p-4 flex items-center justify-between transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center">
            <MapPin size={18} className="text-[#e4b363]" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Locality Insights</p>
            <p className="text-slate-500 text-xs">
              {locality ? `${locality}, ` : ''}{city} ke paas kya hai?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 size={16} className="text-[#e4b363] animate-spin" />}
          {!loading && (
            expanded
              ? <ChevronUp size={16} className="text-slate-400" />
              : <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="mt-3 glass rounded-2xl border border-[#e4b363]/10 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 size={28} className="text-[#e4b363] animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Nearby places fetch ho rahe hain...</p>
            </div>
          ) : data ? (
            <>
              {/* Category Tabs */}
              <div className="flex overflow-x-auto gap-1 p-3 border-b border-white/5 scrollbar-none">
                {categories.map((cat) => {
                  const config = CATEGORY_CONFIG[cat];
                  const Icon = config?.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-[#e4b363] text-[#0f1a2f]'
                          : 'glass-light text-slate-400 hover:text-white'
                      }`}
                    >
                      {Icon && <Icon size={11} />}
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Places List */}
              <div className="p-3 flex flex-col gap-2">
                {activeItems.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    Is area mein {activeCategory} nahi mila.
                  </p>
                ) : (
                  activeItems.map((place: any, i: number) => {
                    const config = activeCategory ? CATEGORY_CONFIG[activeCategory] : null;
                    const Icon = config?.icon;
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${config?.bg || 'bg-white/5 border-white/10'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config?.bg || ''}`}>
                          {Icon && <Icon size={14} className={config?.color || 'text-slate-400'} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium line-clamp-1">{place.name}</p>
                          <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{place.vicinity}</p>
                        </div>
                        <StarRating rating={place.rating} />
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/5">
                <p className="text-slate-600 text-xs text-center">
                  Powered by Google Places API
                </p>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              Locality data load nahi hua. Dobara try karo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}