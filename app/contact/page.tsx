'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { Phone, Mail, MapPin, Sparkles, Clock, MessageSquare, User, CheckCircle, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useSubmitEnquiry } from '@/hooks/use-properties';
import { useSettings } from '@/lib/settings-context';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(\+91|91|0)?[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['buy', 'rent', 'invest', 'sell', 'broker', 'other']),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const { mutateAsync, isPending } = useSubmitEnquiry();
  const settings = useSettings();

  const phone = settings?.contact?.phone || '+91 99999 99999';
  const email = settings?.contact?.email || 'hello@propai.in';
  const address = settings?.contact?.address || 'Cyber City, Gurgaon';
  const whatsapp = settings?.contact?.whatsapp || '919999999999';
  const dealerName = settings?.dealerName || 'PropAI';

  const CONTACT_INFO = [
    { icon: Phone, label: 'Call Us', value: phone, sub: 'Mon–Sat, 9AM–8PM', href: `tel:${phone}` },
    { icon: Mail, label: 'Email Us', value: email, sub: 'Replies within 2 hours', href: `mailto:${email}` },
    { icon: MapPin, label: 'Head Office', value: address, sub: '', href: '#' },
    { icon: Clock, label: 'Business Hours', value: '9:00 AM – 8:00 PM', sub: 'Monday to Saturday', href: '#' },
  ];

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'buy' },
  });

  const onSubmit = async (data: FormData) => {
    await mutateAsync({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      message: `[${data.type.toUpperCase()}] ${data.message}`,
    });
    setSuccess(true);
    reset();
  };

  return (
    <main className="min-h-screen bg-[#0a1120]">
      <Navbar />

      <section className="pt-28 pb-20 bg-[#0a1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MessageSquare size={14} className="text-[#e4b363]" />
              <span className="text-[#e4b363] text-xs font-semibold tracking-widest uppercase">Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white text-balance mb-3">
              Contact {dealerName}
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Whether you&apos;re buying, renting, or investing — our team and AI are here to help you find the perfect property.
            </p>
          </div>

          {/* Contact info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub, href }) => (
              <a key={label} href={href} className="glass rounded-2xl p-5 border border-[#e4b363]/8 hover:border-[#e4b363]/25 transition-all duration-300 group hover:-translate-y-0.5 block">
                <div className="w-10 h-10 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon size={18} className="text-[#e4b363]" />
                </div>
                <p className="text-slate-500 text-xs mb-1">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
              </a>
            ))}
          </div>

          {/* Main grid: form + offices */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Contact Form */}
            <div className="lg:col-span-3 glass rounded-2xl border border-[#e4b363]/15 overflow-hidden">
              <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-[#e4b363]" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Send Us a Message</h2>
                  <p className="text-slate-500 text-xs">We respond within 60 seconds on business days</p>
                </div>
              </div>

              <div className="p-6">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={28} className="text-green-400" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Message Received!</h3>
                    <p className="text-slate-400 text-sm mb-6">Our {dealerName} advisor will contact you within 60 seconds.</p>
                    <button onClick={() => setSuccess(false)} className="glass-gold text-[#e4b363] font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-[#e4b363]/15 transition-colors">
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="text-slate-400 text-xs font-semibold mb-2 block uppercase tracking-wider">I want to</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'buy', label: 'Buy' },
                          { value: 'rent', label: 'Rent' },
                          { value: 'invest', label: 'Invest' },
                          { value: 'sell', label: 'Sell' },
                          { value: 'broker', label: 'List as Broker' },
                          { value: 'other', label: 'Other' },
                        ].map((opt) => (
                          <label key={opt.value} className="cursor-pointer">
                            <input type="radio" value={opt.value} {...register('type')} className="sr-only" />
                            <span className="block glass-light text-slate-400 text-xs px-3.5 py-1.5 rounded-full border border-white/5 cursor-pointer transition-colors hover:border-[#e4b363]/30 hover:text-white has-[:checked]:bg-[#e4b363]/15 has-[:checked]:border-[#e4b363]/40 has-[:checked]:text-[#e4b363]">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 text-xs font-medium mb-1.5 block" htmlFor="contact-name">Full Name *</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input id="contact-name" {...register('name')} placeholder="Rahul Sharma" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none focus:border-[#e4b363]/40 transition-colors" />
                        </div>
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs font-medium mb-1.5 block" htmlFor="contact-phone">Mobile Number *</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input id="contact-phone" {...register('phone')} placeholder="+91 98765 43210" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none focus:border-[#e4b363]/40 transition-colors" />
                        </div>
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1.5 block" htmlFor="contact-email">Email (Optional)</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input id="contact-email" {...register('email')} placeholder="rahul@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none focus:border-[#e4b363]/40 transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1.5 block" htmlFor="contact-message">Your Message *</label>
                      <div className="relative">
                        <MessageSquare size={14} className="absolute left-3.5 top-3 text-slate-500" />
                        <textarea id="contact-message" {...register('message')} rows={4} placeholder="Tell us about your property requirements, budget, preferred location..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none focus:border-[#e4b363]/40 transition-colors resize-none" />
                      </div>
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    <button type="submit" disabled={isPending} className="w-full bg-[#e4b363] hover:bg-[#f0cc8a] disabled:opacity-60 text-[#0f1a2f] font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(228,179,99,0.3)] text-sm flex items-center justify-center gap-2">
                      {isPending ? 'Sending...' : (<><Sparkles size={15} />Send Message</>)}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Offices + WhatsApp */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="glass-gold rounded-2xl p-6 border border-[#e4b363]/20">
                <h3 className="text-white font-bold text-base mb-1">Prefer WhatsApp?</h3>
                <p className="text-slate-400 text-sm mb-4">Chat with our AI or team instantly</p>
                <a href={`https://wa.me/${whatsapp}?text=Hello%21%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(dealerName)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Start WhatsApp Chat
                </a>
              </div>

              <div className="glass rounded-2xl p-5 border border-[#e4b363]/8 flex-1">
                <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <Building2 size={15} className="text-[#e4b363]" />
                  Our Office
                </h3>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e4b363]/10 border border-[#e4b363]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={13} className="text-[#e4b363]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{dealerName}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}