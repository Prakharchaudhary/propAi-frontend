'use client';

import { useState } from 'react';
import { Sparkles, Phone, CheckCircle } from 'lucide-react';
import LeadCaptureModal from './LeadCaptureModal';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/lib/settings-context';

const TRUST_POINTS = [
  'No brokerage charges for buyers',
  '100% RERA verified listings',
  'AI match in under 5 seconds',
  '60-second broker connect',
];

export default function CTASection() {
  const [modalOpen, setModalOpen] = useState(false);
  const { accent, accentFg, a } = useTheme();
  const settings = useSettings();
  const phone = settings?.contact?.phone || '+919999999999';

  return (
    <>
      <section className="py-16 relative overflow-hidden" style={{ background: 'var(--surface-2,#f1f5f9)' }}>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl overflow-hidden border shadow-xl"
            style={{ background: 'var(--card)', borderColor: `${accent}25` }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* Left — CTA */}
              <div className="p-8 lg:p-10">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border"
                  style={{ background: `${accent}12`, borderColor: `${accent}25` }}
                >
                  <Sparkles size={20} style={{ color: accent }} />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3" style={{ color: 'var(--foreground)' }}>
                  Start Your Property Journey
                  <br />
                  <span style={{ color: accent }}>Aaj Hi Karein</span>
                </h2>

                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  India&apos;s smartest home buyers use PropAI. Join 4,200+ families who found their dream home faster with AI.
                </p>

                <ul className="space-y-2.5 mb-7">
                  {TRUST_POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--foreground)' }}>
                      <CheckCircle size={15} className="text-green-500 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: accent, color: accentFg }}
                  >
                    <Sparkles size={15} />
                    Get Free Consultation
                  </button>
                  <a
                    href={`tel:${phone}`}
                    className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm border transition-colors"
                    style={{ borderColor: `${accent}30`, color: accent, background: `${accent}08` }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${accent}14`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${accent}08`)}
                  >
                    <Phone size={15} />
                    Call Now
                  </a>
                </div>
              </div>

              {/* Right — Stats */}
              <div
                className="p-8 lg:p-10 flex flex-col justify-center gap-6 border-t lg:border-t-0 lg:border-l"
                style={{ background: `${accent}06`, borderColor: `${accent}15` }}
              >
                {[
                  { value: '12,400+', label: 'Properties Listed',  sub: 'Across 85+ cities' },
                  { value: '4,200+',  label: 'Happy Families',     sub: 'Found their dream home' },
                  { value: '60 sec',  label: 'Avg Broker Connect', sub: 'Fastest in the industry' },
                  { value: '₹0',      label: 'Brokerage for Buyers', sub: '100% free platform' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                    <div>
                      <p className="font-bold text-xl leading-tight" style={{ color: accent }}>{stat.value}</p>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{stat.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeadCaptureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} mode="enquiry" />
    </>
  );
}