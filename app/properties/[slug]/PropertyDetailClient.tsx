'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Bed, Bath, Maximize, ShieldCheck, Sparkles, ArrowLeft,
  ChevronLeft, ChevronRight, Download, Phone, CheckCircle,
  Building2, Compass, Home, Star, Calendar, MessageCircle
} from 'lucide-react';
import { useProperty, useSimilarProperties } from '@/hooks/use-properties';
import { useSettings } from '@/lib/settings-context';
import { useTheme } from '@/hooks/use-theme';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import LocalityInsights from '@/components/LocalityInsights';
import ChatWidget from '@/components/ChatWidget';

// ── Image Gallery ─────────────────────────────────────────────────────────────
function ImageGallery({ images, title, accent }: { images: any[]; title: string; accent: string }) {
  const [active, setActive] = useState(0);
  const prev = () => setActive(a => (a - 1 + images.length) % images.length);
  const next = () => setActive(a => (a + 1) % images.length);

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--surface-2,#f1f5f9)' }}>
      <div className="relative h-72 md:h-96">
        <img
          src={images[active]?.url || images[active]}
          alt={`${title} — view ${active + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={17} />
            </button>
            <button onClick={next} aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
              <ChevronRight size={17} />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3">
          <span className="text-white text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            {active + 1} / {images.length}
          </span>
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 p-3" style={{ background: 'var(--surface-2,#f1f5f9)' }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all"
              style={{ borderColor: active === i ? accent : 'transparent', opacity: active === i ? 1 : 0.55 }}>
              <img src={img?.url || img} alt={`Thumb ${i+1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Spec tile ─────────────────────────────────────────────────────────────────
function SpecTile({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl p-3.5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={13} style={{ color: accent }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{value || 'N/A'}</p>
    </div>
  );
}

export default function PropertyDetailClient({ slug }: { slug: string }) {
  const { data: propertyRes, isLoading } = useProperty(slug);
  const property = propertyRes?.data;
  const { data: similarRes } = useSimilarProperties(property?._id ?? property?.id ?? '');
  const similar = similarRes?.data ?? [];
  const settings  = useSettings();
  const { accent, accentFg, a } = useTheme();
  const whatsapp = settings?.contact?.whatsapp || '919999999999';

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'enquiry'|'callback'|'download'>('enquiry');
  const [aiOpen,   setAiOpen]    = useState(false);

  const openModal = (mode: typeof modalMode) => { setModalMode(mode); setModalOpen(true); };

  // Skeleton
  if (isLoading) return (
    <section className="pt-24 pb-20 min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
        <div className="h-8 rounded-lg w-1/3" style={{ background: 'var(--border)' }} />
        <div className="h-96 rounded-2xl" style={{ background: 'var(--surface-2)' }} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 rounded-lg w-2/3" style={{ background: 'var(--border)' }} />
            <div className="h-4 rounded-lg" style={{ background: 'var(--border)' }} />
          </div>
          <div className="h-64 rounded-2xl" style={{ background: 'var(--surface-2)' }} />
        </div>
      </div>
    </section>
  );

  if (!property) return (
    <section className="pt-24 pb-20 min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="text-center">
        <p className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Property not found</p>
        <Link href="/properties"
          className="font-bold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
          style={{ background: accent, color: accentFg }}>
          Browse Properties
        </Link>
      </div>
    </section>
  );

  const images = (property.images as any[]) || [];
  const SPECS = [
    { icon: Home,     label: 'Config',    value: property.configuration },
    { icon: Bed,      label: 'Bedrooms',  value: property.bedrooms ? `${property.bedrooms} BHK` : '' },
    { icon: Bath,     label: 'Bathrooms', value: property.bathrooms ? String(property.bathrooms) : '' },
    { icon: Maximize, label: 'Carpet Area',value: property.carpetArea ? `${property.carpetArea} sqft` : '' },
    { icon: Building2,label: 'Floor',     value: property.floorNumber ? `${property.floorNumber}/${property.totalFloors}` : '' },
    { icon: Compass,  label: 'Facing',    value: property.facing || '' },
    { icon: Calendar, label: 'Possession',value: property.possession || '' },
    { icon: Star,     label: 'Listing Type',value: property.listingType || '' },
  ].filter(s => s.value);

  return (
    <>
      <section className="pt-20 pb-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="transition-colors hover:underline" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = accent)}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>Home</Link>
            <span>/</span>
            <Link href="/properties" className="transition-colors hover:underline" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = accent)}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>Properties</Link>
            <span>/</span>
            <span className="line-clamp-1" style={{ color: 'var(--foreground)' }}>{property.title}</span>
          </div>

          {/* Back button */}
          <Link href="/properties"
            className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors font-medium"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = accent)}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            <ArrowLeft size={15} /> Back to Listings
          </Link>

          {/* Gallery */}
          {images.length > 0 && (
            <div className="mb-8">
              <ImageGallery images={images} title={property.title} accent={accent} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT COLUMN ────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Title card */}
              <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {property.badge && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                      style={{ background: `${accent}12`, color: accent, borderColor: `${accent}30` }}>
                      {property.badge}
                    </span>
                  )}
                  {property.isReraRegistered && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 bg-green-50 text-green-600 border-green-200">
                      <ShieldCheck size={10} /> RERA Verified
                    </span>
                  )}
                  {property.aiMatch && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border"
                      style={{ background: `${accent}12`, color: accent, borderColor: `${accent}30` }}>
                      <Sparkles size={10} /> {property.aiMatch}% Match
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{property.title}</h1>
                <div className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={13} style={{ color: accent }} />
                  <span>{property.locality}{property.locality && property.city ? ', ' : ''}{property.city}{property.state ? `, ${property.state}` : ''}</span>
                </div>
                <div className="text-3xl font-bold" style={{ color: accent }}>
                  ₹{(property as any).priceLabel || property.price}
                  {property.pricePerSqft && (
                    <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-muted)' }}>{property.pricePerSqft}</span>
                  )}
                </div>
              </div>

              {/* Specs grid */}
              {SPECS.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SPECS.map(s => <SpecTile key={s.label} icon={s.icon} label={s.label} value={s.value} accent={accent} />)}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h2 className="font-bold text-base mb-3" style={{ color: 'var(--foreground)' }}>About this Property</h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h2 className="font-bold text-base mb-4" style={{ color: 'var(--foreground)' }}>Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {property.amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm"
                        style={{ color: 'var(--text-muted)' }}>
                        <CheckCircle size={14} style={{ color: accent }} className="shrink-0" />
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

              {/* Ask AI section */}
              <div className="rounded-2xl p-5 border" style={{ background: `${accent}06`, borderColor: `${accent}20` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{ background: `${accent}12`, borderColor: `${accent}22` }}>
                    <MessageCircle size={18} style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>Is Area ke Baare Mein Poochho</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Metro, hospital, school — AI se poochho</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['🚇 Nearest metro?', '🏥 Nearby hospital?', '🏫 Schools?', '🛍️ Mall kitna door?'].map(q => (
                    <button key={q} onClick={() => setAiOpen(true)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                      {q}
                    </button>
                  ))}
                </div>
                <button onClick={() => setAiOpen(true)}
                  className="w-full font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ background: accent, color: accentFg }}>
                  <Sparkles size={15} /> AI se Poochho
                </button>
              </div>

              {/* RERA */}
              {property.isReraRegistered && property.reraNumber && (
                <div className="rounded-2xl p-5 border border-green-200 bg-green-50">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={20} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm text-green-700 mb-1">RERA Registered</h3>
                      <p className="text-xs text-green-600 mb-0.5">Reg No: <span className="font-semibold">{property.reraNumber}</span></p>
                      <p className="text-xs text-green-500">This project is registered with RERA.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Builder */}
              {property.builderName && (
                <div className="rounded-2xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h2 className="font-bold text-base mb-3" style={{ color: 'var(--foreground)' }}>Builder Details</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
                      style={{ background: `${accent}10`, borderColor: `${accent}20` }}>
                      <Building2 size={20} style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: 'var(--foreground)' }}>{property.builderName}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{property.projectName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ──────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="rounded-2xl p-5 border sticky top-24" style={{ background: 'var(--card)', borderColor: `${accent}25` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{ background: `${accent}12`, borderColor: `${accent}22` }}>
                    <Sparkles size={16} style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>Interested?</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Get instant response</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => openModal('enquiry')}
                    className="w-full font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    style={{ background: accent, color: accentFg }}>
                    <Sparkles size={15} /> Request Details
                  </button>
                  <button onClick={() => openModal('callback')}
                    className="w-full font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 border transition-colors"
                    style={{ borderColor: `${accent}30`, color: accent, background: `${accent}08` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${accent}14`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${accent}08`}>
                    <Phone size={15} /> Schedule Callback
                  </button>
                  <a href={`https://wa.me/${whatsapp}?text=Hi! I am interested in ${encodeURIComponent(property.title)} (${property.locality}, ${property.city}). Please share details.`}
                    target="_blank" rel="noreferrer"
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Now
                  </a>
                  <button onClick={() => openModal('download')}
                    className="w-full font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 border transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--card)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                    <Download size={15} /> Download Brochure
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-500">AI Advisor Online</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Avg response: <span className="font-medium" style={{ color: 'var(--foreground)' }}>60 seconds</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-12">
              <h2 className="font-bold text-2xl mb-6" style={{ color: 'var(--foreground)' }}>Similar Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {similar.map(p => (
                  <Link key={(p as any)._id || p.id} href={`/properties/${p.slug}`} className="block group">
                    <div className="rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${accent}18`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                      <div className="relative h-44 overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                        <img src={(p.images as any[])?.[0]?.url || p.images[0]} alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-2 left-3">
                          <span className="text-white font-bold text-sm">₹{(p as any).priceLabel || p.price}</span>
                        </div>
                        {p.aiMatch && (
                          <div className="absolute top-2 right-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{ background: `${accent}22`, color: accent, backdropFilter: 'blur(8px)' }}>
                              <Sparkles size={9} /> {p.aiMatch}%
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1" style={{ color: 'var(--foreground)' }}>{p.title}</h3>
                        <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <MapPin size={10} style={{ color: accent }} />
                          {p.locality}{p.locality && p.city ? ', ' : ''}{p.city}
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

      <LeadCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        propertyId={property.id}
        propertyTitle={property.title}
      />

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