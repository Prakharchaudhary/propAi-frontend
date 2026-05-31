'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/lib/settings-context';

const FAQS = [
  {
    q: 'PropAI kaise kaam karta hai?',
    a: 'PropAI ek AI-powered real estate platform hai jo natural language mein property search allow karta hai. Aap Hindi ya English mein apni requirements type ya bol sakte hain — jaise "Noida mein 2BHK under 80 lakh" — aur AI instantly best matching properties show karta hai market insights ke saath.',
  },
  {
    q: 'Kya properties RERA verified hain?',
    a: 'Haan! Hamare platform par listed properties RERA database se automatically cross-verified hoti hain. "RERA Verified" badge waali properties mein RERA registration number clearly display hoti hai.',
  },
  {
    q: 'Voice search kaise use karein?',
    a: 'Search bar mein microphone button dabao. Pehli baar browser permission maangega — "Allow" karo. Phir apni property requirements Hindi ya English mein clearly bolo. Chrome browser best results deta hai.',
  },
  {
    q: 'Kya PropAI free hai?',
    a: 'Buyers aur renters ke liye PropAI bilkul free hai. Property search, AI matching, market insights, aur broker connect sab free hain. Builders aur brokers ke liye premium listing plans available hain.',
  },
  {
    q: 'Broker se directly contact kaise karein?',
    a: 'Har property card pe "WhatsApp" button hai — click karte hi directly broker se connect ho jaoge. Average response time 60 seconds se kam hai.',
  },
  {
    q: 'Home loan assistance milti hai?',
    a: 'PropAI ke partner banks aur NBFCs se instant home loan eligibility check kar sakte hain. Interest rates, EMI calculator, aur document checklist sab available hai.',
  },
  {
    q: 'AI match percentage kya hoti hai?',
    a: 'Jab aap search karte ho, AI aapki preferences ko analyze karke har property ko ek match score deta hai. 90%+ matlab property aapki requirements se bahut closely match karti hai.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const { accent, a } = useTheme();
  const settings = useSettings();
  const whatsapp = settings?.contact?.whatsapp || '919999999999';

  return (
    <section id="faq" className="py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle size={14} style={{ color: accent }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Frequently Asked Questions</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Aapke sawal, hamare jawab. Kuch aur poochna ho toh AI chatbot se poocho!
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5">
          {FAQS.map((faq, i) => (
            <div key={i}
              className="rounded-2xl border overflow-hidden transition-all duration-200"
              style={{
                background: 'var(--card)',
                borderColor: open === i ? `${accent}40` : 'var(--border)',
                boxShadow: open === i ? `0 2px 12px ${a(0.06)}` : 'none',
              }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className="font-medium text-sm pr-4 leading-relaxed"
                  style={{ color: open === i ? accent : 'var(--foreground)' }}>
                  {faq.q}
                </span>
                <ChevronDown size={17} className={`shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                  style={{ color: accent }} />
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm leading-relaxed border-t pt-3"
                    style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Still have questions? Our AI assistant answers 24/7.
          </p>
          <a
            href={`https://wa.me/${whatsapp}?text=Hello%21%20I%20have%20a%20question%20about%20PropAI`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-full text-sm border transition-all duration-200 hover:opacity-90"
            style={{ background: `${accent}0e`, borderColor: `${accent}30`, color: accent }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Support
          </a>
        </div>
      </div>
    </section>
  );
}