'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Bed, Bath, Maximize, ShieldCheck, Sparkles, ArrowLeft,
  ChevronLeft, ChevronRight, Download, Phone, Zap, CheckCircle,
  Building2, Compass, Home, Star, Calendar, MessageCircle
} from 'lucide-react';
import { useProperty, useSimilarProperties } from '@/hooks/use-properties';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import LocalityInsights from '@/components/LocalityInsights';
import ChatWidget from '@/components/ChatWidget';

const BADGE_COLORS: Record<string, string> = {
  'New Launch': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Premium': 'bg-[#e4b363]/15 text-[#e4b363] border-[#e4b363]/30',
  'Hot Deal': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Ready to Move': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Good Investment': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'High Yield': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

function ImageGallery({ images, title }: { images: any[]; title: string }) {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#162440]">
      <div className="relative h-72 md:h-96">
        <img src={images[active]?.url || images[active]} alt={`${title} — view ${active + 1}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a1120]/40" />
        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronLeft size={17} />
            </button>
            <button onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronRight size={17} />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3">
          <span className="glass text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {active + 1} / {images.length}
          </span>
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 p-3 bg-[#0f1a2f]/50">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${active === i ? 'border-[#e4b363]' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={img?.url || img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyDetailClient({ slug }: { slug: string }) {
  const { data: propertyRes, isLoading } = useProperty(slug);
  const property = propertyRes?.data;

  const { data: similarRes } = useSimilarProperties(property?.id ?? '');
  const similar = similarRes?.data ?? [];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'enquiry' | 'callback' | 'download'>('enquiry');
  const [aiOpen, setAiOpen] = useState(false); // 👈 NEW

  const openModal = (mode: typeof modalMode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="pt-24 pb-20 min-h-screen bg-[#0a1120]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/5 rounded-lg w-1/3" />
            <div className="h-96 bg-[#162440] rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-white/5 rounded-lg w-2/3" />
                <div className="h-4 bg-white/5 rounded-lg w-full" />
                <div className="h-4 bg-white/5 rounded-lg w-3/4" />
              </div>
              <div className="h-64 bg-[#162440] rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!property) {
    return (
      <section className="pt-24 pb-20 min-h-screen bg-[#0a1120] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-3">Property Not Found</h1>
          <p className="text-slate-400 mb-6">The property you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/properties" className="bg-[#e4b363] text-[#0f1a2f] font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#f0cc8a] transition-colors">
            Browse Properties
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt-24 pb-20 bg-[#0a1120]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-[#e4b363] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-[#e4b363] transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-[200px]">{property.title}</span>
          </div>

          {/* Back button */}
          <Link href="/properties" className="flex items-center gap-1.5 text-slate-400 hover:text-[#e4b363] text-sm mb-5 transition-colors w-fit">
            <ArrowLeft size={15} />
            Back to Listings
          </Link>

          {/* Gallery */}
          <div className="mb-8">
            <ImageGallery images={property.images} title={property.title} />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left / Main Details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Title block */}
              <div className="glass rounded-2xl p-6 border border-[#e4b363]/10">
                <div className="flex flex-wrap gap-2 mb-3">
                  {property.badge && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${BADGE_COLORS[property.badge] || 'bg-white/10 text-white border-white/20'}`}>
                      {property.badge}
                    </span>
                  )}
                  {property.isVerified && (
                    <span className="flex items-center gap-1 bg-green-500/15 text-green-300 border border-green-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <ShieldCheck size={11} /> RERA Verified
                    </span>
                  )}
                  {property.aiMatch && (
                    <span className="glass-gold text-[#e4b363] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={11} /> {property.aiMatch}% AI Match
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
                  <MapPin size={13} className="text-[#e4b363]" />
                  <span>{property.locality}, {property.city}, {property.state}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-[#e4b363]">
                    ₹{(property as any).priceLabel || property.price}
                  </span>
                  {property.pricePerSqft && (
                    <span className="text-slate-500 text-sm mb-1">{property.pricePerSqft}</span>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Home, label: 'Config', value: property.configuration },
                  { icon: Bed, label: 'Bedrooms', value: `${property.bedrooms} BHK` },
                  { icon: Bath, label: 'Bathrooms', value: `${property.bathrooms}` },
                  { icon: Maximize, label: 'Carpet Area', value: `${property.carpetArea ?? property.area} sqft` },
                  { icon: Building2, label: 'Floor', value: property.floorNumber ? `${property.floorNumber}/${property.totalFloors}` : 'N/A' },
                  { icon: Compass, label: 'Facing', value: property.facing ?? 'N/A' },
                  { icon: Calendar, label: 'Possession', value: property.possession ?? 'N/A' },
                  { icon: Star, label: 'Listing Type', value: property.listingType },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="glass rounded-xl p-3.5 border border-[#e4b363]/8">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon size={13} className="text-[#e4b363]" />
                      <span className="text-slate-500 text-xs">{label}</span>
                    </div>
                    <p className="text-white font-semibold text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {property.description && (
                <div className="glass rounded-2xl p-6 border border-[#e4b363]/8">
                  <h2 className="text-white font-bold text-base mb-3">About This Property</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="glass rounded-2xl p-6 border border-[#e4b363]/8">
                  <h2 className="text-white font-bold text-base mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2.5 text-slate-300 text-sm">
                        <CheckCircle size={14} className="text-green-400 shrink-0" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locality Insights */}
              <LocalityInsights
                lat={(property as any).lat || 28.6271}
                lng={(property as any).lng || 77.3710}
                locality={property.locality}
                city={property.city}
              />

              {/* 👇 NEW — Ask AI Button */}
              <div className="glass rounded-2xl p-5 border border-[#e4b363]/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center">
                    <MessageCircle size={18} className="text-[#e4b363]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Is Area ke Baare Mein Poochho</p>
                    <p className="text-slate-500 text-xs">Metro, hospital, school, mall — sab kuch AI se poochho</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    '🚇 Nearest metro?',
                    '🏥 Nearby hospital?',
                    '🏫 Schools kaun se?',
                    '🛍️ Mall kitna door?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setAiOpen(true)}
                      className="glass-light text-slate-300 text-xs px-3 py-1.5 rounded-full hover:border-[#e4b363]/30 hover:text-[#e4b363] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setAiOpen(true)}
                  className="w-full bg-[#e4b363] hover:bg-[#f0cc8a] text-[#0f1a2f] font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={15} />
                  AI se Poochho — Voice ya Type
                </button>
              </div>

              {/* RERA Info */}
              {property.isReraRegistered && property.reraNumber && (
                <div className="glass rounded-2xl p-5 border border-green-500/20 bg-green-500/5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={20} className="text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1">RERA Registered</h3>
                      <p className="text-slate-400 text-xs mb-1">Registration Number: <span className="text-green-300 font-semibold">{property.reraNumber}</span></p>
                      <p className="text-slate-500 text-xs">This project is registered with the Real Estate Regulatory Authority (RERA).</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Builder Info */}
              {property.builderName && (
                <div className="glass rounded-2xl p-5 border border-[#e4b363]/8">
                  <h2 className="text-white font-bold text-base mb-3">Builder Details</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center">
                      <Building2 size={20} className="text-[#e4b363]" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{property.builderName}</p>
                      <p className="text-slate-400 text-xs">{property.projectName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5 border border-[#e4b363]/20 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center">
                    <Sparkles size={16} className="text-[#e4b363]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Interested?</p>
                    <p className="text-slate-500 text-xs">Get instant response</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => openModal('enquiry')}
                    className="w-full bg-[#e4b363] hover:bg-[#f0cc8a] text-[#0f1a2f] font-bold py-3 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(228,179,99,0.3)] flex items-center justify-center gap-2"
                  >
                    <Sparkles size={15} />
                    Request Details
                  </button>
                  <button
                    onClick={() => openModal('callback')}
                    className="w-full glass-gold text-[#e4b363] font-bold py-3 rounded-xl text-sm hover:bg-[#e4b363]/15 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={15} />
                    Schedule Callback
                  </button>
                  <a
                    href={`https://wa.me/919999999999?text=Hi! I am interested in ${encodeURIComponent(property.title)} (${property.locality}, ${property.city}). Please share more details.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Now
                  </a>
                  <button
                    onClick={() => openModal('download')}
                    className="w-full glass text-slate-300 font-semibold py-2.5 rounded-xl text-sm hover:border-[#e4b363]/30 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={15} />
                    Download Brochure
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs font-medium">AI Advisor Online</span>
                  </div>
                  <p className="text-slate-500 text-xs">Average response time: <span className="text-white font-medium">60 seconds</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-12">
              <h2 className="text-white font-bold text-2xl mb-6">Similar Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {similar.map((p) => (
                  <Link key={p.id} href={`/properties/${p.slug}`} className="block group">
                    <div className="glass rounded-2xl overflow-hidden border border-[#e4b363]/10 hover:border-[#e4b363]/25 transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-44 overflow-hidden bg-[#162440]">
                        <img
                          src={(p.images as any[])?.[0]?.url || p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/70 to-transparent" />
                        <div className="absolute bottom-2 left-3">
                          <span className="text-white font-bold">₹{(p as any).priceLabel || p.price}</span>
                        </div>
                        {p.aiMatch && (
                          <div className="absolute top-2 right-2">
                            <span className="glass-gold text-[#e4b363] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles size={9} /> {p.aiMatch}%
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{p.title}</h3>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          <MapPin size={10} className="text-[#e4b363]" />
                          {p.locality}, {p.city}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lead Modal */}
      <LeadCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        propertyId={property.id}
        propertyTitle={property.title}
      />

      {/* 👇 NEW — Property-specific ChatWidget */}
      {aiOpen && (
        <ChatWidget
          propertyContext={{
            lat: (property as any).lat || 28.6271,
            lng: (property as any).lng || 77.3710,
            address: `${property.locality || ''}, ${property.city}`,
            title: property.title,
          }}
          autoOpen={true}
        />
      )}
    </>
  );
}