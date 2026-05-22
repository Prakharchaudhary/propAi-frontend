'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, SlidersHorizontal, LayoutGrid, List, MapPin, Bed, Bath,
  Maximize, Sparkles, ShieldCheck, X, ChevronDown, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { useProperties } from '@/hooks/use-properties';
import type { PropertyFilters, Property } from '@/lib/types';

const CITIES = ['All', 'Mumbai', 'Gurgaon', 'Bangalore', 'Noida', 'Hyderabad', 'Pune', 'Delhi', 'Chennai'];
const CONFIGS = ['All', '1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Commercial'];
const LISTING_TYPES = ['All', 'sale', 'rent'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'ai_match', label: 'AI Match' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];
const BADGE_COLORS: Record<string, string> = {
  'New Launch': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Premium': 'bg-[#e4b363]/15 text-[#e4b363] border-[#e4b363]/30',
  'Hot Deal': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Ready to Move': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Good Investment': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'High Yield': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

function getImageUrl(images: any[]): string {
  if (!images || images.length === 0) return '/images/placeholder.jpg';
  const primary = images.find((i) => i?.isPrimary);
  return primary?.url || images[0]?.url || images[0] || '/images/placeholder.jpg';
}

function PropertyCardGrid({ property }: { property: Property }) {
  const imageUrl = getImageUrl(property.images as any[]);
  return (
    <Link href={`/properties/${property.slug}`} className="block group">
      <div className="glass rounded-2xl overflow-hidden border border-[#e4b363]/10 hover:border-[#e4b363]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        <div className="relative h-48 overflow-hidden bg-[#162440]">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/80 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {property.badge && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${BADGE_COLORS[property.badge] || 'bg-white/10 text-white border-white/20'}`}>
                {property.badge}
              </span>
            )}
            {property.isVerified && (
              <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                <ShieldCheck size={9} /> RERA
              </span>
            )}
          </div>
          {property.aiMatch && (
            <div className="absolute top-3 right-3">
              <div className="glass-gold rounded-full px-2 py-0.5 flex items-center gap-1">
                <Sparkles size={10} className="text-[#e4b363]" />
                <span className="text-[#e4b363] text-xs font-bold">{property.aiMatch}%</span>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-3">
            <span className="text-white font-bold text-lg">
              ₹{(property as any).priceLabel || property.price}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
            <MapPin size={10} className="text-[#e4b363]" />
            <span>{property.locality}{property.locality && property.city ? ', ' : ''}{property.city}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs border-t border-white/5 pt-2.5 mb-3">
            <span className="font-medium text-slate-300">{property.configuration}</span>
            {property.bedrooms && <span className="flex items-center gap-0.5"><Bed size={10} /> {property.bedrooms}</span>}
            {property.bathrooms && <span className="flex items-center gap-0.5"><Bath size={10} /> {property.bathrooms}</span>}
            {property.area && <span className="flex items-center gap-0.5"><Maximize size={10} /> {property.area}sqft</span>}
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-[#e4b363] hover:bg-[#f0cc8a] text-[#0f1a2f] font-semibold py-1.5 rounded-lg text-xs transition-colors">
              View Details
            </button>
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="glass-gold text-[#e4b363] font-semibold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-[#e4b363]/20 transition-colors">
              <Zap size={11} /> WA
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PropertyCardList({ property }: { property: Property }) {
  const imageUrl = getImageUrl(property.images as any[]);
  return (
    <Link href={`/properties/${property.slug}`} className="block group">
      <div className="glass rounded-2xl overflow-hidden border border-[#e4b363]/10 hover:border-[#e4b363]/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] flex">
        <div className="relative w-48 md:w-64 shrink-0 overflow-hidden bg-[#162440]">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1120]/40" />
          {property.aiMatch && (
            <div className="absolute top-3 left-3">
              <div className="glass-gold rounded-full px-2 py-0.5 flex items-center gap-1">
                <Sparkles size={10} className="text-[#e4b363]" />
                <span className="text-[#e4b363] text-xs font-bold">{property.aiMatch}% Match</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-bold text-white text-base leading-tight">{property.title}</h3>
              <span className="text-[#e4b363] font-bold text-lg whitespace-nowrap">
                ₹{(property as any).priceLabel || property.price}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
              <MapPin size={12} className="text-[#e4b363]" />
              <span>{property.locality}{property.locality && property.city ? ', ' : ''}{property.city}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-3">
              <span className="font-medium text-slate-300">{property.configuration}</span>
              {property.bedrooms && <span className="flex items-center gap-1"><Bed size={12} /> {property.bedrooms} Beds</span>}
              {property.bathrooms && <span className="flex items-center gap-1"><Bath size={12} /> {property.bathrooms} Baths</span>}
              {property.area && <span className="flex items-center gap-1"><Maximize size={12} /> {property.area} sqft</span>}
            </div>
            {property.pricePerSqft && <p className="text-slate-500 text-xs">{property.pricePerSqft}</p>}
          </div>
          <div className="flex items-center gap-3 mt-3">
            {property.badge && (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${BADGE_COLORS[property.badge] || 'bg-white/10 text-white border-white/20'}`}>
                {property.badge}
              </span>
            )}
            {property.isVerified && (
              <span className="flex items-center gap-1 text-green-300 text-xs font-semibold">
                <ShieldCheck size={11} /> RERA Verified
              </span>
            )}
            <div className="flex-1" />
            <button className="bg-[#e4b363] hover:bg-[#f0cc8a] text-[#0f1a2f] font-semibold py-1.5 px-4 rounded-lg text-sm transition-colors">
              View Details
            </button>
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="glass-gold text-[#e4b363] font-semibold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-[#e4b363]/20 transition-colors">
              <Zap size={13} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-[#e4b363]/8 animate-pulse">
      <div className="h-48 bg-[#162440]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/5 rounded-lg w-3/4" />
        <div className="h-3 bg-white/5 rounded-lg w-1/2" />
        <div className="h-3 bg-white/5 rounded-lg w-full" />
        <div className="h-8 bg-white/5 rounded-lg" />
      </div>
    </div>
  );
}

export default function PropertiesClient() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    q: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    listingType: searchParams.get('listingType') || '',
    configuration: searchParams.get('configuration') || '',
    sortBy: 'newest',
    page: 1,
    limit: 12,
  });
  const [searchInput, setSearchInput] = useState(filters.q || '');

  const { data, isLoading } = useProperties(filters);
  const properties = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const updateFilter = (key: keyof PropertyFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilter = (key: keyof PropertyFilters) => {
    setFilters((prev) => ({ ...prev, [key]: '', page: 1 }));
  };

  const activeFilterCount = [filters.city, filters.listingType, filters.configuration].filter(Boolean).length;

  return (
    <section className="pt-24 pb-20 min-h-screen bg-[#0a1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {filters.city ? `Properties in ${filters.city}` : 'All Properties'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isLoading ? 'Loading...' : `${total} properties found`}
            {filters.q && <span className="text-[#e4b363]"> for &ldquo;{filters.q}&rdquo;</span>}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 glass rounded-xl flex items-center px-4 py-2.5 gap-3 border border-[#e4b363]/10 focus-within:border-[#e4b363]/30 transition-colors">
            <Search size={16} className="text-slate-500 shrink-0" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('q', searchInput); }} placeholder="Search by city, project, locality..." className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm outline-none" />
            {searchInput && (
              <button onClick={() => { setSearchInput(''); updateFilter('q', ''); }} aria-label="Clear search">
                <X size={14} className="text-slate-500 hover:text-white transition-colors" />
              </button>
            )}
          </div>
          <div className="relative">
            <select value={filters.sortBy} onChange={(e) => updateFilter('sortBy', e.target.value)} className="glass border border-[#e4b363]/10 text-slate-300 text-sm py-2.5 pl-4 pr-8 rounded-xl outline-none appearance-none cursor-pointer hover:border-[#e4b363]/25 transition-colors bg-transparent">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0f1a2f]">{o.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${filtersOpen || activeFilterCount > 0 ? 'bg-[#e4b363] text-[#0f1a2f]' : 'glass text-slate-400 hover:text-white'}`}>
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${filtersOpen || activeFilterCount > 0 ? 'bg-[#0f1a2f] text-[#e4b363]' : 'bg-[#e4b363] text-[#0f1a2f]'}`}>{activeFilterCount}</span>
            )}
          </button>
          <div className="glass rounded-xl flex overflow-hidden border border-[#e4b363]/10">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#e4b363]/15 text-[#e4b363]' : 'text-slate-500 hover:text-white'}`} aria-label="Grid view"><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#e4b363]/15 text-[#e4b363]' : 'text-slate-500 hover:text-white'}`} aria-label="List view"><List size={16} /></button>
          </div>
        </div>
        {filtersOpen && (
          <div className="glass rounded-2xl border border-[#e4b363]/15 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">City</p>
                <div className="flex flex-wrap gap-1.5">
                  {CITIES.map((c) => (
                    <button key={c} onClick={() => updateFilter('city', c === 'All' ? '' : c)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${(c === 'All' && !filters.city) || filters.city === c ? 'bg-[#e4b363] text-[#0f1a2f]' : 'glass-light text-slate-400 hover:text-white'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Configuration</p>
                <div className="flex flex-wrap gap-1.5">
                  {CONFIGS.map((c) => (
                    <button key={c} onClick={() => updateFilter('configuration', c === 'All' ? '' : c)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${(c === 'All' && !filters.configuration) || filters.configuration === c ? 'bg-[#e4b363] text-[#0f1a2f]' : 'glass-light text-slate-400 hover:text-white'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Listing Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {LISTING_TYPES.map((t) => (
                    <button key={t} onClick={() => updateFilter('listingType', t === 'All' ? '' : t)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${(t === 'All' && !filters.listingType) || filters.listingType === t ? 'bg-[#e4b363] text-[#0f1a2f]' : 'glass-light text-slate-400 hover:text-white'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button onClick={() => setFilters((p) => ({ ...p, city: '', listingType: '', configuration: '', page: 1 }))} className="text-slate-400 hover:text-[#e4b363] text-sm flex items-center gap-1.5 transition-colors">
                  <X size={13} /> Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
        {activeFilterCount > 0 && !filtersOpen && (
          <div className="flex gap-2 flex-wrap mb-4">
            {filters.city && <span className="glass-gold text-[#e4b363] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">City: {filters.city}<button onClick={() => clearFilter('city')} aria-label="Remove city filter"><X size={11} /></button></span>}
            {filters.configuration && <span className="glass-gold text-[#e4b363] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">{filters.configuration}<button onClick={() => clearFilter('configuration')} aria-label="Remove config filter"><X size={11} /></button></span>}
            {filters.listingType && <span className="glass-gold text-[#e4b363] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">{filters.listingType}<button onClick={() => clearFilter('listingType')} aria-label="Remove listing type filter"><X size={11} /></button></span>}
          </div>
        )}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center mx-auto mb-4"><Search size={24} className="text-slate-500" /></div>
            <h3 className="text-white font-bold text-xl mb-2">No properties found</h3>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search query</p>
            <button onClick={() => setFilters({ sortBy: 'newest', page: 1, limit: 12 })} className="glass-gold text-[#e4b363] font-semibold px-6 py-2.5 rounded-full hover:bg-[#e4b363]/15 transition-colors text-sm">Clear Filters</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((p) => <PropertyCardGrid key={(p as any)._id || p.id} property={p} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {properties.map((p) => <PropertyCardList key={(p as any)._id || p.id} property={p} />)}
          </div>
        )}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => updateFilter('page', Math.max(1, (filters.page ?? 1) - 1))} disabled={(filters.page ?? 1) <= 1} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 transition-colors" aria-label="Previous page"><ChevronLeft size={16} /></button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
              <button key={i} onClick={() => updateFilter('page', i + 1)} className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${(filters.page ?? 1) === i + 1 ? 'bg-[#e4b363] text-[#0f1a2f]' : 'glass text-slate-400 hover:text-white'}`}>{i + 1}</button>
            ))}
            <button onClick={() => updateFilter('page', Math.min(totalPages, (filters.page ?? 1) + 1))} disabled={(filters.page ?? 1) >= totalPages} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 transition-colors" aria-label="Next page"><ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </section>
  );
}
