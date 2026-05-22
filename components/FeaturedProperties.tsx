'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { propertyService } from '@/lib/services';
import type { Property } from '@/lib/types';

const BADGE_COLORS: Record<string, string> = {
  'New Launch': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Premium': 'bg-[#e4b363]/15 text-[#e4b363] border-[#e4b363]/30',
  'Hot Deal': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Ready to Move': 'bg-green-500/20 text-green-300 border-green-500/30',
};

const FILTERS = ['All', 'sale', 'rent'];

function PropertyCard({ property }: { property: Property }) {
  const primaryImage = property.images?.find((img: any) => img.isPrimary)?.url
    || property.images?.[0]?.url
    || null;

  return (
    <Link href={`/properties/${property.slug}`} className="block group">
      <div className="glass rounded-2xl overflow-hidden border border-[#e4b363]/10 hover:border-[#e4b363]/30 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#162440]">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <Sparkles size={40} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.badge && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${BADGE_COLORS[property.badge] || 'bg-white/10 text-white border-white/20'}`}>
                {property.badge}
              </span>
            )}
            {property.isVerified && (
              <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                <ShieldCheck size={10} /> Verified
              </span>
            )}
          </div>

          {/* AI Match */}
          {property.aiMatch && (
            <div className="absolute top-3 right-3 bg-[#e4b363]/20 backdrop-blur-sm border border-[#e4b363]/30 rounded-full px-2.5 py-1 flex items-center gap-1">
              <Sparkles size={10} className="text-[#e4b363]" />
              <span className="text-[#e4b363] text-xs font-bold">{property.aiMatch}% Match</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-base mb-1 line-clamp-1 group-hover:text-[#e4b363] transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
            <MapPin size={12} className="text-[#e4b363]" />
            <span>{property.locality ? `${property.locality}, ` : ''}{property.city}</span>
          </div>

          {/* Price */}
          <div className="text-[#e4b363] font-bold text-xl mb-3">
            ₹{property.priceLabel || property.price}
            {property.pricePerSqft && (
              <span className="text-slate-500 text-xs font-normal ml-2">{property.pricePerSqft}</span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-slate-400 text-sm border-t border-white/5 pt-3">
            {property.configuration && (
              <span className="text-slate-300 font-medium">{property.configuration}</span>
            )}
            {property.bedrooms && (
              <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms}</span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms}</span>
            )}
            {property.area && (
              <span className="flex items-center gap-1"><Maximize size={13} /> {property.area} sqft</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    propertyService.getAll({ limit: 6 })
      .then((res) => setProperties(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? properties
    : properties.filter((p) => p.listingType?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#e4b363]" />
              <span className="text-[#e4b363] text-sm font-medium uppercase tracking-wider">AI Curated</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Properties</h2>
            <p className="text-slate-400 mt-2">Handpicked by our AI based on market trends</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                  activeFilter === f
                    ? 'bg-[#e4b363] text-[#0a1120]'
                    : 'glass border border-[#e4b363]/20 text-slate-300 hover:border-[#e4b363]/40'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl h-72 animate-pulse border border-[#e4b363]/10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No properties found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => <PropertyCard key={p._id || p.id} property={p} />)}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-10">
          <Link href="/properties"
            className="inline-flex items-center gap-2 border border-[#e4b363]/30 text-[#e4b363] px-6 py-3 rounded-full hover:bg-[#e4b363]/10 transition-colors font-medium">
            View All Properties <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}