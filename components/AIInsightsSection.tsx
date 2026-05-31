'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Brain, BarChart3, MessageSquare, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const AI_FEATURES = [
  {
    icon: Brain,
    title: 'Smart Property Matching',
    desc: 'AI analyzes your lifestyle, budget, and commute to recommend properties with up to 97% match accuracy.',
    metric: '97% accuracy',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Market Insights',
    desc: 'Live price trends, demand-supply analysis, and ROI forecasts powered by 50+ data sources.',
    metric: '50+ sources',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: MessageSquare,
    title: 'Bilingual Conversations',
    desc: '"Mumbai mein 2BHK dikhao" — our AI understands Hindi, English, and Hinglish queries.',
    metric: 'Hindi + English',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
  },
  {
    icon: ShieldCheck,
    title: 'RERA-Verified Trust Layer',
    desc: 'Every listing is cross-checked with RERA databases to ensure compliance and authenticity.',
    metric: '100% RERA check',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
  },
];

const MARKET_TRENDS = [
  { city: 'Gurgaon',    change: '+12.4%', insight: '3BHK demand surging' },
  { city: 'Bengaluru',  change: '+9.1%',  insight: 'IT corridor hotspot' },
  { city: 'Hyderabad',  change: '+15.3%', insight: 'Fastest growing' },
  { city: 'Mumbai',     change: '+4.2%',  insight: 'Stable premium demand' },
  { city: 'Pune',       change: '+7.8%',  insight: 'NRI investor favorite' },
  { city: 'Noida',      change: '+6.5%',  insight: 'Affordable mix' },
];

// SSR-safe useInView — only runs on client
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function AIInsightsSection() {
  const { accent, a } = useTheme();
  const { ref: featRef, inView: featInView }   = useInView(0.05);
  const { ref: trendRef, inView: trendInView } = useInView(0.05);

  return (
    <section className="py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={14} style={{ color: accent }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>AI-Powered</span>
          </div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Why US?</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Smart technology for smarter property decisions</p>
        </div>

        {/* Feature cards */}
        <div ref={featRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {AI_FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl p-6 border transition-all duration-300 cursor-default"
                style={{
                  background:  'var(--card)',
                  borderColor: 'var(--border)',
                  opacity:     featInView ? 1 : 0,
                  transform:   featInView ? 'translateY(0)' : 'translateY(28px)',
                  transition:  `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s ease ${idx * 0.1}s, box-shadow 0.3s ease`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = f.color;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${f.color}20`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border"
                  style={{ background: f.bg, borderColor: `${f.color}22` }}>
                  <Icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--foreground)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: f.bg, color: f.color }}>
                  {f.metric}
                </span>
              </div>
            );
          })}
        </div>

        {/* Market Trends */}
        <div ref={trendRef}
          className="rounded-2xl border p-6"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${accent}12` }}>
                <TrendingUp size={16} style={{ color: accent }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Live Market Trends</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Year-on-year price growth</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.10)', color: '#10b981' }}>
              Live Data
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MARKET_TRENDS.map((t, idx) => (
              <div
                key={t.city}
                className="rounded-xl p-3 border text-center transition-all duration-300"
                style={{
                  background:  'var(--surface-2, #f8fafc)',
                  borderColor: 'var(--border)',
                  opacity:     trendInView ? 1 : 0,
                  transform:   trendInView ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
                  transition:  `opacity 0.5s ease ${idx * 0.07}s, transform 0.5s ease ${idx * 0.07}s`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = accent;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <p className="font-bold text-base text-green-500">{t.change}</p>
                <p className="font-semibold text-xs mt-0.5" style={{ color: 'var(--foreground)' }}>{t.city}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}