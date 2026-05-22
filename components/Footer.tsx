'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Sparkles, Instagram, Youtube, Twitter } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { usePropertyCities, useProperties } from '@/hooks/use-properties';

export default function Footer() {
  const settings = useSettings();

  const { data: citiesRes } = usePropertyCities();
  const { data: propertiesRes } = useProperties({ limit: 1000 });

  const cities = (citiesRes?.data ?? []).slice(0, 6).map((c) => c.city);

  const propertyTypes = (() => {
    if (!propertiesRes?.data) return [];
    const countMap: Record<string, number> = {};
    propertiesRes.data.forEach((p) => {
      if (p.configuration) countMap[p.configuration] = (countMap[p.configuration] || 0) + 1;
    });
    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([config]) => config);
  })();

  const phone = settings?.contact?.phone || '+91 99999 99999';
  const email = settings?.contact?.email || 'hello@propai.in';
  const address = settings?.contact?.address || 'Cyber City, Gurgaon, Haryana';
  const whatsapp = settings?.contact?.whatsapp || '919999999999';
  const instagram = settings?.social?.instagram || '#';
  const youtube = settings?.social?.youtube || '#';
  const dealerName = settings?.dealerName || 'PropAI';
  const tagline = settings?.tagline || "India's AI-powered real estate sales OS. Connecting buyers, brokers, and builders through intelligent conversations.";

  return (
    <footer className="bg-[#06101f] border-t border-[#e4b363]/10">
      {/* Ticker */}
      <div className="border-b border-[#e4b363]/8 py-3 overflow-hidden">
        <div className="flex ticker-track whitespace-nowrap">
          {[...cities, ...cities].map((city, i) => (
            <span key={i} className="mx-6 text-slate-600 text-xs font-medium uppercase tracking-wider">
              {city}
              <span className="mx-6 text-[#e4b363]/30">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              {settings?.logo?.url ? (
                <img src={settings.logo.url} alt={dealerName} className="h-9 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-9 h-9 rounded-xl bg-[#e4b363] flex items-center justify-center">
                    <Sparkles size={18} className="text-[#0f1a2f]" />
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-white text-xl font-bold">Prop</span>
                    <span className="text-[#e4b363] text-xl font-bold">AI</span>
                    <span className="text-[#e4b363] text-xl font-bold">.</span>
                  </div>
                </>
              )}
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">{tagline}</p>
            <div className="flex gap-3">
              <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-slate-500 hover:text-[#e4b363] hover:border-[#e4b363]/30 transition-colors">
                <Instagram size={15} />
              </a>
              <a href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-slate-500 hover:text-[#e4b363] hover:border-[#e4b363]/30 transition-colors">
                <Youtube size={15} />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-slate-500 hover:text-[#e4b363] hover:border-[#e4b363]/30 transition-colors">
                <Twitter size={15} />
              </a>
            </div>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Top Cities</h4>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <Link href={`/properties?city=${encodeURIComponent(city)}`} className="text-slate-500 hover:text-[#e4b363] transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-1 h-1 bg-[#e4b363]/40 rounded-full group-hover:bg-[#e4b363] transition-colors" />
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Property Types</h4>
            <ul className="space-y-2">
              {propertyTypes.map((type) => (
                <li key={type}>
                  <Link href={`/properties?configuration=${encodeURIComponent(type)}`} className="text-slate-500 hover:text-[#e4b363] transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-1 h-1 bg-[#e4b363]/40 rounded-full group-hover:bg-[#e4b363] transition-colors" />
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get In Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone}`} className="flex items-start gap-3 text-slate-500 hover:text-[#e4b363] transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-[#e4b363]/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#e4b363]/15 transition-colors">
                    <Phone size={13} className="text-[#e4b363]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">Call Us</p>
                    <p className="text-sm font-medium">{phone}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-slate-500 hover:text-[#e4b363] transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-[#e4b363]/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#e4b363]/15 transition-colors">
                    <Mail size={13} className="text-[#e4b363]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">Email</p>
                    <p className="text-sm font-medium">{email}</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-slate-500">
                  <div className="w-7 h-7 rounded-lg bg-[#e4b363]/8 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={13} className="text-[#e4b363]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">HQ</p>
                    <p className="text-sm font-medium">{address}</p>
                  </div>
                </div>
              </li>
            </ul>

            <a
              href={`https://wa.me/${whatsapp}?text=Hello%21%20I%20want%20to%20explore%20properties.`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-600 text-xs">
            &copy; {new Date().getFullYear()} {dealerName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-600 text-xs">
            <Link href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">RERA Info</Link>
          </div>
          <p className="text-slate-600 text-xs">
            Powered by <span className="text-[#e4b363] font-semibold">PropAI OS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}