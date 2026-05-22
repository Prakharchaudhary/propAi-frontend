'use client';

import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Rohit Agarwal',
    role: 'Software Engineer, Gurgaon',
    avatar: 'R',
    rating: 5,
    text: 'PropAI ne meri dream home search 2 weeks mein complete kar di. AI matching ne exactly waisi property suggest ki jo main chahta tha — 3BHK in DLF Phase 4, perfect budget mein. Voice search toh game changer hai!',
    property: 'Bought 3BHK in Gurgaon',
    highlight: '2 weeks',
  },
  {
    name: 'Meera Krishnan',
    role: 'IT Manager, Bangalore',
    avatar: 'M',
    rating: 5,
    text: 'As an NRI investor, I was worried about finding trustworthy properties remotely. PropAI\'s RERA verification and AI insights gave me confidence. Bought a villa in Whitefield without even visiting — that\'s the power of this platform!',
    property: 'Invested in Whitefield Villa',
    highlight: 'NRI investor',
  },
  {
    name: 'Vivek Sharma',
    role: 'Real Estate Broker, Mumbai',
    avatar: 'V',
    rating: 5,
    text: 'Mera lead conversion rate PropAI se 3x ho gaya. AI lead qualification system exactly wahi leads bhejta hai jo actually buy karna chahte hain. WhatsApp integration bhi bahut smooth hai.',
    property: '3x Lead Conversion',
    highlight: '3x growth',
  },
  {
    name: 'Ananya Reddy',
    role: 'Doctor, Hyderabad',
    avatar: 'A',
    rating: 5,
    text: 'Hindi mein search karna itna easy hoga socha nahi tha. "HiTech City ke paas 2BHK dikhao" type kiya aur instantly best options aa gaye with ROI analysis. Finally ek platform jo actual users ke liye bana hai.',
    property: 'Bought 2BHK near HiTech City',
    highlight: 'Hindi search',
  },
  {
    name: 'Karan Mehta',
    role: 'Entrepreneur, Pune',
    avatar: 'K',
    rating: 5,
    text: 'PropAI ka AI chatbot raat 2 baje bhi jawab deta hai! Market insights real-time hain — Baner mein property prices jo data dikhaya exactly wahi tha. Very accurate and trustworthy platform.',
    property: 'Bought 3BHK in Baner, Pune',
    highlight: '24/7 support',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const visible = [
    TESTIMONIALS[current],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 2) % TESTIMONIALS.length],
  ];

  return (
    <section id="testimonials" className="py-20 bg-[#0a1120] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#1a2f5a]/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#e4b363]/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-[#e4b363] fill-[#e4b363]" />
              <span className="text-[#e4b363] text-xs font-semibold tracking-widest uppercase">Verified Reviews</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-balance">
              Lakhs of Happy Families
              <br />
              <span className="text-[#e4b363]">Trust PropAI</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-gold rounded-full px-4 py-2 text-center">
              <p className="text-[#e4b363] font-bold text-xl">4.9/5</p>
              <div className="flex gap-0.5 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="text-[#e4b363] fill-[#e4b363]" />
                ))}
              </div>
              <p className="text-slate-400 text-xs mt-0.5">4,200+ reviews</p>
            </div>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Previous" className="w-9 h-9 glass rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-[#e4b363]/30 transition-colors">
                <ChevronLeft size={17} />
              </button>
              <button onClick={next} aria-label="Next" className="w-9 h-9 glass rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-[#e4b363]/30 transition-colors">
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visible.map((t, i) => (
            <div
              key={t.name}
              className={`glass rounded-2xl p-6 border transition-all duration-300 ${
                i === 0
                  ? 'border-[#e4b363]/30 shadow-[0_0_30px_rgba(228,179,99,0.08)]'
                  : 'border-[#e4b363]/8'
              }`}
            >
              {/* Quote icon */}
              <div className="w-8 h-8 rounded-lg bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center mb-4">
                <Quote size={14} className="text-[#e4b363]" />
              </div>

              {/* Text */}
              <p className="text-slate-300 text-sm leading-relaxed mb-5 line-clamp-4">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Highlight badge */}
              <div className="mb-4">
                <span className="glass-gold text-[#e4b363] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {t.highlight}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e4b363] flex items-center justify-center text-[#0f1a2f] font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={11} className="text-[#e4b363] fill-[#e4b363]" />
                  ))}
                </div>
              </div>

              <p className="text-[#e4b363] text-xs font-medium mt-2">{t.property}</p>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-[#e4b363]' : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
