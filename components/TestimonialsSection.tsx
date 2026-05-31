'use client';

import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const TESTIMONIALS = [
  {
    name: 'Rohit Agarwal', role: 'Software Engineer, Gurgaon', avatar: 'R', rating: 5,
    text: 'PropAI ne meri dream home search 2 weeks mein complete kar di. AI matching ne exactly waisi property suggest ki jo main chahta tha — 3BHK in DLF Phase 4, perfect budget mein. Voice search toh game changer hai!',
    property: 'Bought 3BHK in Gurgaon', highlight: '2 weeks',
  },
  {
    name: 'Meera Krishnan', role: 'IT Manager, Bangalore', avatar: 'M', rating: 5,
    text: "As an NRI investor, I was worried about finding trustworthy properties remotely. PropAI's RERA verification and AI insights gave me confidence. Bought a villa in Whitefield without even visiting — that's the power of this platform!",
    property: 'Invested in Whitefield Villa', highlight: 'NRI investor',
  },
  {
    name: 'Vivek Sharma', role: 'Real Estate Broker, Mumbai', avatar: 'V', rating: 5,
    text: 'Mera lead conversion rate PropAI se 3x ho gaya. AI lead qualification system exactly wahi leads bhejta hai jo actually buy karna chahte hain. WhatsApp integration bhi bahut smooth hai.',
    property: '3x Lead Conversion', highlight: '3x growth',
  },
  {
    name: 'Ananya Reddy', role: 'Doctor, Hyderabad', avatar: 'A', rating: 5,
    text: 'Hindi mein search karna itna easy hoga socha nahi tha. "HiTech City ke paas 2BHK dikhao" type kiya aur instantly best options aa gaye with ROI analysis. Finally ek platform jo actual users ke liye bana hai.',
    property: 'Bought 2BHK near HiTech City', highlight: 'Hindi search',
  },
  {
    name: 'Karan Mehta', role: 'Entrepreneur, Pune', avatar: 'K', rating: 5,
    text: 'PropAI ka AI chatbot raat 2 baje bhi jawab deta hai! Market insights real-time hain — Baner mein property prices jo data dikhaya exactly wahi tha. Very accurate and trustworthy platform.',
    property: 'Bought 3BHK in Baner', highlight: '24/7 support',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const { accent, accentFg, a } = useTheme();

  const prev = () => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent(c => (c + 1) % TESTIMONIALS.length);

  const visible = [
    TESTIMONIALS[current],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 2) % TESTIMONIALS.length],
  ];

  return (
    <section id="testimonials" className="py-16" style={{ background: 'var(--surface-2, #f1f5f9)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={14} style={{ color: accent, fill: accent }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>Verified Reviews</span>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
              Lakhs of Happy Families
              <br />
              <span style={{ color: accent }}>Trust PropAI</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl px-4 py-2.5 text-center border"
              style={{ background: `${accent}0e`, borderColor: `${accent}22` }}>
              <p className="font-bold text-xl" style={{ color: accent }}>4.9/5</p>
              <div className="flex gap-0.5 justify-center my-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} style={{ color: accent, fill: accent }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>4,200+ reviews</p>
            </div>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Previous"
                className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={next} aria-label="Next"
                className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visible.map((t, i) => (
            <div key={t.name + i}
              className="rounded-2xl p-6 border transition-all duration-300"
              style={{
                background: 'var(--card)',
                borderColor: i === 0 ? `${accent}40` : 'var(--border)',
                boxShadow: i === 0 ? `0 4px 20px ${a(0.08)}` : '0 1px 3px rgba(0,0,0,0.04)',
              }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 border"
                style={{ background: `${accent}0e`, borderColor: `${accent}22` }}>
                <Quote size={14} style={{ color: accent }} />
              </div>

              <p className="text-sm leading-relaxed mb-4 line-clamp-4" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${accent}0e`, color: accent }}>
                {t.highlight}
              </span>

              <div className="flex items-center justify-between pt-4 mt-4 border-t"
                style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: accent, color: accentFg }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={11} style={{ color: accent, fill: accent }} />
                  ))}
                </div>
              </div>

              <p className="text-xs font-medium mt-2" style={{ color: accent }}>{t.property}</p>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Testimonial ${i+1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px', height: '8px',
                background: i === current ? accent : 'var(--border)',
              }} />
          ))}
        </div>
      </div>
    </section>
  );
}