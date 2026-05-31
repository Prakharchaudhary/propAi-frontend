'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSettings } from '@/lib/settings-context';
import { useTheme } from '@/hooks/use-theme';
import {
  ShieldCheck, Award, Users, TrendingUp, MapPin,
  Phone, Mail, Star, Building2, Sparkles, ArrowRight, CheckCircle,
} from 'lucide-react';

const MILESTONES = [
  { year: '2018', title: 'Founded', desc: 'Started with a vision to make real estate transparent and accessible.' },
  { year: '2020', title: 'AI Integration', desc: 'Launched AI-powered property matching and voice search in Hindi & English.' },
  { year: '2022', title: '5,000+ Families', desc: 'Helped 5,000+ families find their dream home across 50+ cities.' },
  { year: '2024', title: 'RERA Verified Platform', desc: 'Became a 100% RERA-verified platform with AI trust scoring.' },
];

const VALUES = [
  { icon: ShieldCheck, title: 'Transparency',   desc: 'Every listing is RERA verified. No hidden charges, no fake photos, no misleading prices.' },
  { icon: Users,       title: 'Customer First', desc: 'We work for buyers, not builders. Our AI recommends what is best for you.' },
  { icon: TrendingUp,  title: 'Market Expertise',desc: '8+ years of data on pricing, demand, and ROI across Indian cities.' },
  { icon: Award,       title: 'RERA Compliant',  desc: 'Fully compliant with RERA regulations. All listings cross-verified with official databases.' },
];

const STATS = [
  { value: '12,400+', label: 'Properties Listed' },
  { value: '85+',     label: 'Cities Covered' },
  { value: '4,200+',  label: 'Happy Families' },
  { value: '8+ Yrs',  label: 'Industry Experience' },
];

const TEAM = [
  { name: 'Rahul Chaudhary',   role: 'Founder & CEO',           initial: 'R', desc: '12 years in real estate. Ex-DLF, JLL. IIT Delhi alumnus.' },
  { name: 'Priya Sharma',      role: 'Head of AI & Technology', initial: 'P', desc: 'Ex-Google AI. Built the AI property matching engine.' },
  { name: 'Amit Verma',        role: 'Head of Operations',      initial: 'A', desc: '10 years ops experience. 50+ city expansion lead.' },
  { name: 'Sunita Mehta',      role: 'Customer Success Lead',   initial: 'S', desc: 'Ensures 60-second response time SLA across all cities.' },
];

export default function AboutPage() {
  const settings = useSettings();
  const { accent, accentFg, a } = useTheme();

  const dealerName = settings?.dealerName || 'PropAI';
  const tagline    = settings?.tagline    || 'Your Dream Home Awaits';
  const phone      = settings?.contact?.phone   || '+91 99999 99999';
  const email      = settings?.contact?.email   || 'hello@propai.in';
  const address    = settings?.contact?.address || 'Cyber City, Gurgaon';
  const whatsapp   = settings?.contact?.whatsapp || '919999999999';

  const card = { background: 'var(--card)', border: '1px solid var(--border)' } as React.CSSProperties;

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16" style={{ background: `linear-gradient(135deg, ${accent}08, var(--background))` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: accent }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>About Us</span>
          </div>
          {settings?.logo?.url ? (
            <div className="flex justify-center mb-5">
              <img src={settings.logo.url} alt={dealerName} className="h-16 object-contain" />
            </div>
          ) : (
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: accent }}>
                <Building2 size={30} style={{ color: accentFg }} />
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            {dealerName}
          </h1>
          <p className="text-xl mb-2" style={{ color: accent }}>{tagline}</p>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            India&apos;s most trusted AI-powered real estate platform. We connect home buyers with verified properties using artificial intelligence, voice search, and real-time market insights.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="rounded-2xl p-4 border text-center"
                style={card}>
                <p className="text-2xl font-bold" style={{ color: accent }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ───────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--surface-2,#f1f5f9)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} style={{ color: accent }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>Our Story</span>
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                Built to Make Real Estate <span style={{ color: accent }}>Simple & Honest</span>
              </h2>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                <p>We started {dealerName} after seeing how stressful and opaque the property buying process was for ordinary Indian families. Brokers with hidden agendas, misleading listings, and zero transparency.</p>
                <p>Our mission: use AI to give every buyer the same information and advantage that only big investors had. Voice search in Hindi, AI match scoring, real-time price trends — all free for buyers.</p>
                <p>Today we serve 85+ cities and have helped 4,200+ families find the right home at the right price.</p>
              </div>
              <Link href="/properties"
                className="inline-flex items-center gap-2 mt-6 font-semibold px-5 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
                style={{ background: accent, color: accentFg }}>
                Browse Properties <ArrowRight size={15} />
              </Link>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: i === MILESTONES.length - 1 ? accent : `${accent}12`, color: i === MILESTONES.length - 1 ? accentFg : accent }}>
                      {m.year.slice(2)}
                    </div>
                    {i < MILESTONES.length - 1 && (
                      <div className="w-0.5 h-8 mt-1" style={{ background: `${accent}20` }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold" style={{ color: accent }}>{m.year}</span>
                      <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{m.title}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck size={14} style={{ color: accent }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>Our Values</span>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-6 border text-center transition-all duration-200"
                style={card}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${a(0.08)}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 border"
                  style={{ background: `${accent}10`, borderColor: `${accent}20` }}>
                  <Icon size={20} style={{ color: accent }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--foreground)' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--surface-2,#f1f5f9)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users size={14} style={{ color: accent }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>Our Team</span>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>The People Behind {dealerName}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(member => (
              <div key={member.name} className="rounded-2xl p-5 border text-center" style={card}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-lg font-bold"
                  style={{ background: accent, color: accentFg }}>
                  {member.initial}
                </div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{member.name}</h3>
                <p className="text-xs font-medium mb-2" style={{ color: accent }}>{member.role}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 border" style={{ background: `${accent}06`, borderColor: `${accent}20` }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                  Why Choose <span style={{ color: accent }}>{dealerName}?</span>
                </h2>
                <div className="space-y-3">
                  {[
                    'Free for buyers — zero brokerage',
                    '100% RERA verified listings',
                    'AI property matching in 5 seconds',
                    'Voice search in Hindi & English',
                    'Real-time market price insights',
                    'WhatsApp connect in 60 seconds',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--foreground)' }}>
                      <CheckCircle size={15} style={{ color: accent }} className="shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Get In Touch</h3>
                <div className="space-y-3">
                  {[
                    { icon: Phone,  label: phone,   href: `tel:${phone}` },
                    { icon: Mail,   label: email,   href: `mailto:${email}` },
                    { icon: MapPin, label: address,  href: '#' },
                  ].map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href}
                      className="flex items-start gap-3 text-sm transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = accent)}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                      <Icon size={15} style={{ color: accent }} className="mt-0.5 shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
                <a href={`https://wa.me/${whatsapp}?text=Hi ${dealerName}! I want to know more.`}
                  target="_blank" rel="noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl text-sm text-white bg-green-600 hover:bg-green-500 transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}