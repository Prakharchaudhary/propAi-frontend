'use client';

import { useState } from 'react';
import { Sparkles, Phone, CheckCircle } from 'lucide-react';
import LeadCaptureModal from './LeadCaptureModal';

const TRUST_POINTS = [
  'No brokerage charges for buyers',
  '100% RERA verified listings',
  'AI match in under 5 seconds',
  '60-second broker connect',
];

export default function CTASection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-[#0a1120] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(26,47,90,0.5)_0%,transparent_70%)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e4b363]/4 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl border border-[#e4b363]/20 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.4)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left — Main CTA */}
              <div className="p-10 lg:p-12">
                <div className="w-12 h-12 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/25 flex items-center justify-center mb-6 pulse-gold">
                  <Sparkles size={22} className="text-[#e4b363]" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 text-balance">
                  Start Your Property Journey
                  <br />
                  <span className="text-[#e4b363]">Aaj Hi Karein</span>
                </h2>

                <p className="text-slate-400 text-base mb-8 leading-relaxed">
                  India&apos;s smartest home buyers use PropAI. Join 4,200+ families who found their dream home faster with AI.
                </p>

                {/* Trust points */}
                <ul className="space-y-2.5 mb-8">
                  {TRUST_POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-slate-300 text-sm">
                      <CheckCircle size={15} className="text-green-400 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex-1 bg-[#e4b363] hover:bg-[#f0cc8a] text-[#0f1a2f] font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(228,179,99,0.4)] flex items-center justify-center gap-2 text-sm"
                  >
                    <Sparkles size={16} />
                    Get Free Consultation
                  </button>
                  <a
                    href="tel:+919999999999"
                    className="flex-1 glass-gold text-[#e4b363] font-bold py-3.5 rounded-xl hover:bg-[#e4b363]/15 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Phone size={16} />
                    Call Now
                  </a>
                </div>
              </div>

              {/* Right — Stats panel */}
              <div className="bg-[#e4b363]/5 border-l border-[#e4b363]/10 p-10 lg:p-12 flex flex-col justify-center gap-8">
                <div className="space-y-6">
                  {[
                    { value: '12,400+', label: 'Properties Listed', sub: 'Across 85+ cities' },
                    { value: '4,200+', label: 'Happy Families', sub: 'Found their dream home' },
                    { value: '60 sec', label: 'Avg Broker Connect', sub: 'Fastest in the industry' },
                    { value: '₹0', label: 'Brokerage for Buyers', sub: '100% free platform' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-4">
                      <div className="w-1 h-12 rounded-full bg-[#e4b363]" />
                      <div>
                        <p className="text-[#e4b363] font-bold text-2xl leading-tight">{stat.value}</p>
                        <p className="text-white font-semibold text-sm">{stat.label}</p>
                        <p className="text-slate-500 text-xs">{stat.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeadCaptureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} mode="enquiry" />
    </>
  );
}
