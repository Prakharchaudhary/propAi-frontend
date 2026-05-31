'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Sparkles, Instagram, Youtube, Twitter } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { useTheme } from '@/hooks/use-theme';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/lib/services';

const STATIC_CITIES = ['Noida', 'Gurgaon', 'Mumbai', 'Bangalore', 'Delhi'];
const STATIC_TYPES  = ['2 BHK', '3 BHK', 'Villa', '1 BHK', '4 BHK'];

export default function Footer() {
  const settings   = useSettings();
  const { accent, accentFg, a } = useTheme();

  const { data: citiesRes } = useQuery({
    queryKey: ['footer-cities'],
    queryFn: () => propertyService.getCities(),
    staleTime: 0, gcTime: 60_000,
    placeholderData: { success: true, data: STATIC_CITIES.map(c => ({ city: c, count: 10 })) },
    retry: 2,
  });

  const { data: propsRes } = useQuery({
    queryKey: ['footer-properties'],
    queryFn: () => propertyService.getAll({ limit: 500 }),
    staleTime: 0, gcTime: 60_000,
    placeholderData: { success: true, data: STATIC_TYPES.map((c, i) => ({ id: `s${i}`, configuration: c } as any)), total: 5, page: 1, limit: 500, totalPages: 1 },
    retry: 2,
  });

  const apiCities = (citiesRes?.data ?? []).slice(0, 5).map(c => c.city);
  const cities = apiCities.length > 0 ? apiCities : STATIC_CITIES;

  const propertyTypes = (() => {
    const data = propsRes?.data ?? [];
    if (data.length === 0) return STATIC_TYPES;
    const countMap: Record<string, number> = {};
    data.forEach(p => { if (p.configuration) countMap[p.configuration] = (countMap[p.configuration] || 0) + 1; });
    const fromApi = Object.entries(countMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c);
    return fromApi.length > 0 ? fromApi : STATIC_TYPES;
  })();

  const phone     = settings?.contact?.phone    || '+91 99999 99999';
  const email     = settings?.contact?.email    || 'hello@propai.in';
  const address   = settings?.contact?.address  || 'Cyber City, Gurgaon';
  const whatsapp  = settings?.contact?.whatsapp || '919999999999';
  const instagram = settings?.social?.instagram || '#';
  const youtube   = settings?.social?.youtube   || '#';
  const dealerName = settings?.dealerName || 'PropAI';

  // Footer always dark regardless of page theme
  const footerBg     = '#0f172a';
  const footerCard   = '#1e293b';
  const footerBorder = 'rgba(255,255,255,0.08)';
  const footerMuted  = '#94a3b8';
  const footerText   = '#f1f5f9';

  return (
    <footer style={{ backgroundColor: footerBg, borderTop: `1px solid ${footerBorder}` }}>
      {/* Ticker */}
      <div className="py-2 overflow-hidden" style={{ borderBottom: `1px solid ${footerBorder}` }}>
        <div className="flex ticker-track whitespace-nowrap">
          {[...cities, ...cities].map((city, i) => (
            <span key={i} className="mx-5 text-xs font-medium uppercase tracking-widest" style={{ color: footerMuted }}>
              {city}<span className="mx-4" style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              {settings?.logo?.url ? (
                <img src={settings.logo.url} alt={dealerName} className="h-7 w-auto object-contain brightness-0 invert" />
              ) : (
                <>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent }}>
                    <Sparkles size={14} style={{ color: accentFg }} />
                  </div>
                  <span className="font-bold text-base" style={{ color: footerText }}>
                    Prop<span style={{ color: accent }}>AI</span>
                  </span>
                </>
              )}
            </Link>
            <p className="text-xs leading-relaxed mb-4" style={{ color: footerMuted }}>
              {settings?.tagline || "India's AI-powered real estate platform."}
            </p>
            <div className="flex gap-2">
              {[
                { href: instagram, Icon: Instagram, label: 'Instagram' },
                { href: youtube,   Icon: Youtube,   label: 'YouTube'   },
                { href: '#',       Icon: Twitter,   label: 'Twitter'   },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
                  style={{ background: footerCard, borderColor: footerBorder, color: footerMuted }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accent; (e.currentTarget as HTMLElement).style.color = accent; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = footerBorder; (e.currentTarget as HTMLElement).style.color = footerMuted; }}>
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider" style={{ color: footerText }}>Cities</h4>
            <ul className="space-y-1.5">
              {cities.map(city => (
                <li key={city}>
                  <Link href={`/properties?city=${encodeURIComponent(city)}`}
                    className="text-xs transition-colors" style={{ color: footerMuted }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = footerMuted)}>
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider" style={{ color: footerText }}>Property Types</h4>
            <ul className="space-y-1.5">
              {propertyTypes.map(type => (
                <li key={type}>
                  <Link href={`/properties?configuration=${encodeURIComponent(type)}`}
                    className="text-xs transition-colors" style={{ color: footerMuted }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = footerMuted)}>
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider" style={{ color: footerText }}>Contact</h4>
            <ul className="space-y-2 mb-3">
              {[
                { Icon: Phone,  val: phone,   href: `tel:${phone}` },
                { Icon: Mail,   val: email,   href: `mailto:${email}` },
                { Icon: MapPin, val: address, href: '#' },
              ].map(({ Icon, val, href }) => (
                <li key={val}>
                  <a href={href} className="flex items-start gap-2 text-xs transition-colors" style={{ color: footerMuted }}
                    onMouseEnter={e => (e.currentTarget.style.color = footerText)}
                    onMouseLeave={e => (e.currentTarget.style.color = footerMuted)}>
                    <Icon size={11} className="mt-0.5 shrink-0" style={{ color: accent }} />
                    <span>{val}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-xs transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-5"
          style={{ borderTop: `1px solid ${footerBorder}` }}>
          <p className="text-xs" style={{ color: footerMuted }}>
            © {new Date().getFullYear()} {dealerName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: footerMuted }}>
            {['Privacy', 'Terms', 'RERA'].map(item => (
              <Link key={item} href="#"
                className="transition-colors"
                onMouseEnter={e => (e.currentTarget.style.color = footerText)}
                onMouseLeave={e => (e.currentTarget.style.color = footerMuted)}>{item}</Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: footerMuted }}>
            Powered by <span className="font-semibold" style={{ color: accent }}>PropAI OS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}