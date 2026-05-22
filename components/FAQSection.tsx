'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'PropAI kaise kaam karta hai?',
    a: 'PropAI ek AI-powered real estate platform hai jo natural language mein property search allow karta hai. Aap Hindi ya English mein apni requirements type ya bol sakte hain — jaise "Noida mein 2BHK under 80 lakh" — aur AI instantly best matching properties show karta hai market insights ke saath.',
  },
  {
    q: 'Kya properties RERA verified hain?',
    a: 'Haan! Hamare platform par listed properties RERA database se automatically cross-verified hoti hain. "RERA Verified" badge waali properties mein RERA registration number clearly display hoti hai. Aap government RERA portal pe directly verify bhi kar sakte hain.',
  },
  {
    q: 'Voice search kaise use karein?',
    a: 'Search bar mein microphone button dabao. Pehli baar browser permission maangega — "Allow" karo. Phir apni property requirements Hindi ya English mein clearly bolo. AI aapki speech ko text mein convert karega aur search shuru kar dega. Chrome browser best results deta hai.',
  },
  {
    q: 'Kya PropAI free hai?',
    a: 'Buyers aur renters ke liye PropAI bilkul free hai. Property search, AI matching, market insights, aur broker connect sab free hain. Builders aur brokers ke liye premium listing plans available hain.',
  },
  {
    q: 'Broker se directly contact kaise karein?',
    a: 'Har property card pe "WhatsApp" button hai — click karte hi directly broker se connect ho jaoge. Aap AI chatbot se bhi request kar sakte ho callback scheduling ke liye. Average response time 60 seconds se kam hai.',
  },
  {
    q: 'Home loan assistance milti hai?',
    a: 'PropAI ke partner banks aur NBFCs se instant home loan eligibility check kar sakte hain. Property detail page pe "Check Loan Eligibility" feature available hai. Interest rates, EMI calculator, aur document checklist sab available hai.',
  },
  {
    q: 'AI match percentage kya hoti hai?',
    a: 'Jab aap search karte ho, AI aapki preferences (location, budget, configuration, lifestyle factors) ko analyze karke har property ko ek match score deta hai. 90%+ matlab property aapki requirements se bahut closely match karti hai. Yeh score real-time update hota rehta hai.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#080f1e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle size={14} className="text-[#e4b363]" />
            <span className="text-[#e4b363] text-xs font-semibold tracking-widest uppercase">Got Questions?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-balance mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm">
            Aapke sawal, hamare jawab. Kuch aur poochna ho toh AI chatbot se poocho!
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i ? 'border-[#e4b363]/30' : 'border-[#e4b363]/8 hover:border-[#e4b363]/20'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className={`font-semibold text-sm pr-4 leading-relaxed ${open === i ? 'text-[#e4b363]' : 'text-white'}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[#e4b363] transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm mb-4">
            Still have questions? Our AI assistant answers 24/7.
          </p>
          <a
            href="https://wa.me/919999999999?text=Hello%21%20I%20have%20a%20question%20about%20PropAI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 glass-gold text-[#e4b363] font-semibold px-6 py-2.5 rounded-full hover:bg-[#e4b363]/15 transition-colors text-sm"
          >
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
