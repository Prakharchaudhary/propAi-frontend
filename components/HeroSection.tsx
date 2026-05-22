'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Search, Sparkles, MapPin, ArrowRight, ShieldCheck, TrendingUp, Building2 } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

const SUGGESTIONS = [
  '3BHK flat in Gurgaon under 1.5 crore',
  '2BHK apartment in Noida Sector 62',
  'Villa in Baner Pune with garden',
  'Studio near Bandra Kurla Complex',
  'Independent house in Whitefield Bangalore',
];

const STATS = [
  { label: 'Properties Listed', value: '12,400+', icon: Building2 },
  { label: 'Cities Covered', value: '85+', icon: MapPin },
  { label: 'Happy Buyers', value: '4,200+', icon: ShieldCheck },
  { label: 'AI Searches/Day', value: '18,000+', icon: TrendingUp },
];

export default function HeroSection() {
  const settings = useSettings();
  const tagline = settings?.tagline || "India's first conversational AI real estate platform. Search in Hindi or English — voice, text, or chat.";
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentSuggestion = SUGGESTIONS[suggestionIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIdx < currentSuggestion.length) {
      timeout = setTimeout(() => {
        setPlaceholder(currentSuggestion.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 55);
    } else if (!isDeleting && charIdx === currentSuggestion.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setPlaceholder(currentSuggestion.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, 28);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setSuggestionIdx((i) => (i + 1) % SUGGESTIONS.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, suggestionIdx]);

  // AI suggestions as user types
  useEffect(() => {
    if (query.length > 2) {
      const lower = query.toLowerCase();
      const suggestions = [
        lower.includes('mumbai') || lower.includes('bandra') ? '2BHK in Bandra West, Mumbai — ₹1.8Cr' : null,
        lower.includes('delhi') || lower.includes('noida') ? '3BHK in Noida Sector 137 — ₹85L' : null,
        lower.includes('bangalore') || lower.includes('bengaluru') ? 'Villa in Whitefield, Bangalore — ₹2.4Cr' : null,
        lower.includes('pune') ? '2BHK in Baner, Pune — ₹72L' : null,
        lower.includes('gurgaon') || lower.includes('gurugram') ? '3BHK in DLF Phase 4, Gurgaon — ₹1.6Cr' : null,
        `AI result: "${query}" — searching 12,400+ properties...`,
      ].filter(Boolean) as string[];
      setAiSuggestions(suggestions.slice(0, 4));
    } else {
      setAiSuggestions([]);
    }
  }, [query]);

  const handleSearch = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query });
    router.push(`/properties?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser. Try Chrome!');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      setQuery(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <section id="ai-search" className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-bg pt-16">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#1a2f5a]/40 rounded-full blur-[100px]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#e4b363]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-[#e4b363]/4 rounded-full blur-[60px]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(228,179,99,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(228,179,99,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="glass-gold rounded-full px-4 py-1.5 flex items-center gap-2">
            <Sparkles size={14} className="text-[#e4b363]" />
            <span className="text-[#e4b363] text-xs font-semibold tracking-wider uppercase">
              AI-Powered Real Estate OS
            </span>
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.08] mb-5 text-balance">
  Apna Sapna Ghar
  <br />
  <span className="text-[#e4b363] text-glow-gold">Dhundna Hua Aasaan</span>
</h1>
<div className="mt-6 flex flex-col items-center gap-4">

  {/* OWNER BADGE */}
  <div className="owner-badge">

    <span className="owner-label">
      Trusted by
    </span>

    <span className="owner-name">
      {settings?.dealerName}
    </span>

  </div>

  {/* TAGLINE */}
  <p
    className="
      text-slate-400
      text-sm md:text-base
      max-w-2xl
      mx-auto
      leading-relaxed
    "
  >
    {tagline}
  </p>

</div>
        </div>

        {/* Conversational Search Box */}
        <div className="max-w-3xl mx-auto mb-6 relative">
          <div className="glass rounded-2xl p-1.5 shadow-[0_0_60px_rgba(228,179,99,0.1)] border border-[#e4b363]/20">
            <div className="flex items-center gap-3 px-4 py-3">
              {/* AI indicator */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#e4b363]/10 border border-[#e4b363]/30 flex items-center justify-center">
                  <Sparkles size={15} className="text-[#e4b363]" />
                </div>
              </div>

              {/* Input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder || 'Search properties...'}
                  className="w-full bg-transparent text-white placeholder:text-slate-500 text-base outline-none font-medium"
                  aria-label="AI property search"
                />
                {!query && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#e4b363] cursor-blink text-lg font-thin">|</span>
                )}
              </div>

              {/* Voice Button */}
              <button
                onClick={handleVoice}
                aria-label="Voice search"
                className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : 'glass-gold hover:bg-[#e4b363]/20'
                }`}
              >
                <Mic size={17} className={isListening ? 'text-white' : 'text-[#e4b363]'} />
              </button>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="shrink-0 bg-[#e4b363] hover:bg-[#f0cc8a] text-[#0f1a2f] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:shadow-[0_0_25px_rgba(228,179,99,0.4)] text-sm whitespace-nowrap"
              >
                <Search size={16} />
                <span className="hidden sm:inline">Search AI</span>
              </button>
            </div>

            {/* AI Suggestions Dropdown */}
            {aiSuggestions.length > 0 && (
              <div className="px-4 pb-3 pt-1 border-t border-[#e4b363]/10">
                <p className="text-[#e4b363] text-xs font-semibold mb-2 flex items-center gap-1">
                  <Sparkles size={11} />
                  AI Suggestions
                </p>
                <div className="flex flex-col gap-1">
                  {aiSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setQuery(s.split('—')[0].trim()); setAiSuggestions([]); }}
                      className="text-left text-slate-300 text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <MapPin size={12} className="text-[#e4b363] shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick filter chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-16">
          {['Noida 2BHK', 'Mumbai Sea View', 'Bangalore Villa', 'Delhi NCR Flat', '50L se kam', 'New Launch'].map((chip) => (
            <button
              key={chip}
              onClick={() => setQuery(chip)}
              className="glass-light text-slate-300 hover:text-white hover:border-[#e4b363]/40 text-xs px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-white/8"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl p-4 text-center hover:border-[#e4b363]/25 transition-all duration-300 group">
              <div className="w-9 h-9 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#e4b363]/15 transition-colors">
                <Icon size={16} className="text-[#e4b363]" />
              </div>
              <p className="text-white font-bold text-xl leading-tight">{value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="flex justify-center mt-14">
          <a href="#featured" className="flex flex-col items-center gap-2 text-slate-600 hover:text-[#e4b363] transition-colors group">
            <span className="text-xs font-medium tracking-widest uppercase">Explore Properties</span>
            <ArrowRight size={16} className="rotate-90 group-hover:translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
