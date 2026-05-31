'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic, Search, Sparkles, MapPin, ArrowRight, ShieldCheck,
  TrendingUp, Building2, ChevronLeft, ChevronRight, Play, Pause,
  Volume2, VolumeX,
} from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

const DEFAULT_BANNERS = [
  {
    _id: 'default-1',
    mediaType: 'image',
    image: { url: '' },
    videoUrl: '',
    title: 'Apna Sapna Ghar\nDhundna Hua Aasaan',
    subtitle: "India's first AI-powered real estate platform. Search in Hindi or English.",
    badge: 'AI-Powered Real Estate',
    ctaText: 'Search Properties',
    ctaLink: '/properties',
    ctaSecondaryText: 'Talk to AI',
    ctaSecondaryLink: '#search',
    overlayOpacity: 35,
    isActive: true,
  },
  {
    _id: 'default-2',
    mediaType: 'image',
    image: { url: '' },
    videoUrl: '',
    title: 'Premium Properties\nAcross India',
    subtitle: 'RERA verified listings in Mumbai, Gurgaon, Bangalore, Noida & more.',
    badge: '12,400+ Listings',
    ctaText: 'Explore Now',
    ctaLink: '/properties',
    ctaSecondaryText: 'WhatsApp Us',
    ctaSecondaryLink: '#',
    overlayOpacity: 40,
    isActive: true,
  },
];

const SUGGESTIONS = [
  '3BHK flat in Gurgaon under 1.5 crore',
  '2BHK apartment in Noida Sector 62',
  'Villa in Baner Pune with garden',
  'Studio near Bandra Kurla Complex',
  'Independent house in Whitefield Bangalore',
];

const STATS = [
  { label: 'Properties', value: '12,400+', icon: Building2 },
  { label: 'Cities',     value: '85+',     icon: MapPin },
  { label: 'Buyers',     value: '4,200+',  icon: ShieldCheck },
  { label: 'AI Searches',value: '18,000+', icon: TrendingUp },
];

const QUICK_CHIPS = ['Noida 2BHK', 'Mumbai Sea View', 'Bangalore Villa', 'Delhi NCR', 'Under 50L', 'New Launch'];

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/);
  return m ? m[1] : null;
}

// ── Single slide media layer ──────────────────────────────────────────────────
function BannerMedia({ banner, active, muted }: { banner: any; active: boolean; muted: boolean }) {
  const ytId = banner.mediaType === 'youtube' ? getYouTubeId(banner.videoUrl || '') : null;
  const overlayAlpha = (banner.overlayOpacity ?? 40) / 100;

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 0.9s ease',
        zIndex: active ? 1 : 0,
      }}
    >
      {/* Media */}
      {banner.mediaType === 'youtube' && ytId ? (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${muted?1:0}&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&playsinline=1`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'scale(1.15)', transformOrigin: 'center' }}
          allow="autoplay; encrypted-media"
          title="banner"
        />
      ) : banner.mediaType === 'video' && banner.videoUrl ? (
        <video
          src={banner.videoUrl}
          autoPlay loop playsInline muted={muted}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : banner.image?.url ? (
        <img
          src={banner.image.url}
          alt={banner.title || ''}
          className={`absolute inset-0 w-full h-full object-cover ${active ? 'banner-ken-burns' : ''}`}
        />
      ) : (
        /* Light gradient fallback */
        <div className="absolute inset-0 hero-bg" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: `rgba(10,15,30,${overlayAlpha})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
    </div>
  );
}

export default function HeroSection() {
  const settings = useSettings();
  const router   = useRouter();
  const accent   = settings?.accentColor || '#2563eb';

  // Banners
  const rawBanners = (settings?.banners || []).filter((b: any) => b.isActive !== false);
  const banners    = rawBanners.length > 0 ? rawBanners : DEFAULT_BANNERS;
  const advanceMs  = settings?.bannerInterval ?? 5500;

  const [current, setCurrent]   = useState(0);
  const [paused,  setPaused]    = useState(false);
  const [muted,   setMuted]     = useState(true);
  const [animKey, setAnimKey]   = useState(0); // force re-animation on slide change
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setAnimKey(k => k + 1);
  }, []);

  const prev = () => { goTo((current - 1 + banners.length) % banners.length); setPaused(true); };
  const next = () => { goTo((current + 1) % banners.length); setPaused(true); };

  useEffect(() => {
    if (paused || advanceMs === 0 || banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length);
      setAnimKey(k => k + 1);
    }, advanceMs);
    return () => clearInterval(timerRef.current!);
  }, [paused, advanceMs, banners.length]);

  // Search
  const [query,         setQuery]         = useState('');
  const [isListening,   setIsListening]   = useState(false);
  const [placeholder,   setPlaceholder]   = useState('');
  const [suggIdx,       setSuggIdx]       = useState(0);
  const [charIdx,       setCharIdx]       = useState(0);
  const [isDeleting,    setIsDeleting]    = useState(false);
  const [suggestions,   setSuggestions]   = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter
  useEffect(() => {
    const word = SUGGESTIONS[suggIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!isDeleting && charIdx < word.length) {
      t = setTimeout(() => { setPlaceholder(word.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 55);
    } else if (!isDeleting && charIdx === word.length) {
      t = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIdx > 0) {
      t = setTimeout(() => { setPlaceholder(word.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, 28);
    } else {
      setIsDeleting(false);
      setSuggIdx(i => (i + 1) % SUGGESTIONS.length);
    }
    return () => clearTimeout(t);
  }, [charIdx, isDeleting, suggIdx]);

  // AI suggestions
  useEffect(() => {
    if (query.length < 3) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    setSuggestions([
      q.includes('mumbai') || q.includes('bandra') ? '2BHK Bandra West, Mumbai — ₹1.8Cr' : null,
      q.includes('noida')  || q.includes('delhi')  ? '3BHK Noida Sector 137 — ₹85L' : null,
      q.includes('bangalore') || q.includes('bengaluru') ? 'Villa Whitefield, Bangalore — ₹2.4Cr' : null,
      q.includes('gurgaon') || q.includes('gurugram') ? '3BHK DLF Phase 4, Gurgaon — ₹1.6Cr' : null,
      q.includes('pune') ? '2BHK Baner, Pune — ₹72L' : null,
      `AI: "${query}" — searching 12,400+ properties...`,
    ].filter(Boolean) as string[]);
  }, [query]);

  const doSearch = () => {
    if (!query.trim()) return;
    router.push(`/properties?q=${encodeURIComponent(query)}`);
  };

  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice search: use Chrome browser'); return; }
    const r = new SR();
    r.lang = 'hi-IN'; r.interimResults = false;
    setIsListening(true);
    r.onresult = (e: any) => { setQuery(e.results[0][0].transcript); setIsListening(false); };
    r.onerror = r.onend = () => setIsListening(false);
    r.start();
  };

  const activeBanner  = banners[current];
  const hasVideo      = activeBanner?.mediaType === 'video' || activeBanner?.mediaType === 'youtube';
  const titleLines    = (activeBanner?.title || 'Find Your Dream\nHome Today').split('\n');

  return (
    <>
      {/* ── BANNER (fixed height, NO content inside) ────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: 'min(560px, 65vh)', marginTop: '64px' }}>
        {/* Slides */}
        {banners.map((b, i) => (
          <BannerMedia key={b._id || i} banner={b} active={i === current} muted={muted} />
        ))}

        {/* Text content INSIDE banner */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-10 px-4 sm:px-10 max-w-5xl mx-auto w-full">
          {activeBanner?.badge && (
            <div key={`badge-${animKey}`} className="banner-badge-enter mb-3">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ background: `${accent}22`, borderColor: `${accent}55`, color: '#fff' }}
              >
                <Sparkles size={11} style={{ color: accent }} />
                {activeBanner.badge}
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              </span>
            </div>
          )}

          <h1 key={`title-${animKey}`} className="banner-title-enter text-white font-bold leading-tight mb-3"
            style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}>
            {titleLines.map((line, i) => (
              <span key={i}>
                {i === titleLines.length - 1
                  ? <span style={{ color: accent }}>{line}</span>
                  : <>{line}<br /></>}
              </span>
            ))}
          </h1>

          {activeBanner?.subtitle && (
            <p key={`sub-${animKey}`} className="banner-sub-enter text-white/80 text-sm md:text-base mb-5 max-w-xl">
              {activeBanner.subtitle}
            </p>
          )}

          {(activeBanner?.ctaText || activeBanner?.ctaSecondaryText) && (
            <div key={`cta-${animKey}`} className="banner-cta-enter flex gap-3 flex-wrap">
              {activeBanner.ctaText && (
                <a href={activeBanner.ctaLink || '/properties'}
                  className="flex items-center gap-2 font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-300 hover:scale-105"
                  style={{ background: accent, color: '#fff' }}>
                  {activeBanner.ctaText} <ArrowRight size={14} />
                </a>
              )}
              {activeBanner.ctaSecondaryText && (
                <a href={activeBanner.ctaSecondaryLink || '#'}
                  className="flex items-center gap-2 font-semibold px-5 py-2.5 rounded-full text-sm border transition-all duration-300 hover:scale-105"
                  style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.12)' }}>
                  {activeBanner.ctaSecondaryText}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Slider controls */}
        {banners.length > 1 && (
          <>
            <button onClick={prev} aria-label="Prev"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={next} aria-label="Next"
              className="absolute right-12 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all">
              <ChevronRight size={16} />
            </button>

            {/* Dots + progress bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {banners.map((_, i) => (
                <button key={i} onClick={() => { goTo(i); setPaused(true); }}
                  aria-label={`Slide ${i+1}`}
                  className="rounded-full transition-all duration-400 overflow-hidden relative"
                  style={{ width: i === current ? '28px' : '8px', height: '8px', background: 'rgba(255,255,255,0.35)' }}>
                  {i === current && (
                    <span className="banner-progress absolute inset-0 rounded-full"
                      style={{ background: accent, animationDuration: `${advanceMs}ms` }} />
                  )}
                </button>
              ))}
            </div>

            <button onClick={() => setPaused(p => !p)} aria-label="Play/Pause"
              className="absolute bottom-2.5 right-3 z-20 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors">
              {paused ? <Play size={11} /> : <Pause size={11} />}
            </button>
          </>
        )}

        {hasVideo && (
          <button onClick={() => setMuted(m => !m)} aria-label="Mute"
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}
      </div>

      {/* ── SEARCH SECTION (below banner, light bg) ──────────────────────── */}
      <section id="search" className="py-10 px-4" style={{ background: 'var(--background)' }}>
        <div className="max-w-3xl mx-auto">
          {/* Search box */}
          <div
            className="rounded-2xl border shadow-lg overflow-visible"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              {/* AI icon */}
              <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border"
                style={{ background: `${accent}12`, borderColor: `${accent}30` }}>
                <Sparkles size={16} style={{ color: accent }} />
              </div>

              {/* Input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  placeholder={placeholder || 'Search properties...'}
                  className="w-full bg-transparent text-sm outline-none font-medium"
                  style={{ color: 'var(--foreground)' }}
                  aria-label="Search properties"
                />
                {!query && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 cursor-blink font-thin text-base" style={{ color: accent }}>|</span>
                )}
              </div>

              {/* Voice */}
              <button onClick={handleVoice} aria-label="Voice"
                className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500' : ''}`}
                style={isListening ? {} : { background: `${accent}12`, border: `1px solid ${accent}30` }}>
                <Mic size={15} style={{ color: isListening ? '#fff' : accent }} />
              </button>

              {/* Search btn */}
              <button onClick={doSearch}
                className="shrink-0 font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 text-sm transition-all hover:opacity-90"
                style={{ background: accent, color: '#fff' }}>
                <Search size={14} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="border-t px-4 pb-3 pt-2" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: accent }}>
                  <Sparkles size={10} /> AI Suggestions
                </p>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setQuery(s.split('—')[0].trim()); setSuggestions([]); }}
                    className="w-full text-left text-sm px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors hover:bg-slate-50"
                    style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={11} style={{ color: accent }} className="shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {QUICK_CHIPS.map(chip => (
              <button key={chip} onClick={() => setQuery(chip)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--card)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                {chip}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label}
                className="flex items-center gap-3 p-3 rounded-xl border card-shadow"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${accent}12` }}>
                  <Icon size={14} style={{ color: accent }} />
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight" style={{ color: 'var(--foreground)' }}>{value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}