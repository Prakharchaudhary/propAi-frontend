'use client';

import { useState } from 'react';
import { X, Sparkles, Phone, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitEnquiry } from '@/hooks/use-properties';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(\+91|91|0)?[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  message: z.string().optional(),
  callbackTime: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyTitle?: string;
  mode?: 'enquiry' | 'callback' | 'download';
}

const CALLBACK_SLOTS = [
  'Within 1 hour', 'Today morning', 'Today evening', 'Tomorrow morning', 'Tomorrow evening',
];

export default function LeadCaptureModal({ isOpen, onClose, propertyId, propertyTitle, mode = 'enquiry' }: Props) {
  const [success, setSuccess] = useState(false);
  const { mutateAsync, isPending } = useSubmitEnquiry();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        message: data.message,
        propertyId,
        callbackTime: data.callbackTime,
      });
      setSuccess(true);
      reset();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch {
      // Error handled silently; in production, show toast
    }
  };

  const titles: Record<string, string> = {
    enquiry: 'Request Property Details',
    callback: 'Schedule a Callback',
    download: 'Download Brochure',
  };
  const subtitles: Record<string, string> = {
    enquiry: 'A PropAI advisor will contact you within 60 seconds.',
    callback: 'Choose your preferred time and we\'ll call you back.',
    download: 'Enter your details to receive the brochure instantly.',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={titles[mode]}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md glass border border-[#e4b363]/20 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e4b363]/10 border border-[#e4b363]/25 flex items-center justify-center pulse-gold">
              <Sparkles size={18} className="text-[#e4b363]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">{titles[mode]}</h2>
              {propertyTitle && (
                <p className="text-[#e4b363] text-xs font-medium mt-0.5 truncate max-w-[220px]">{propertyTitle}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close modal" className="text-slate-400 hover:text-white transition-colors mt-0.5">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Request Submitted!</h3>
              <p className="text-slate-400 text-sm">
                {mode === 'callback' ? 'We\'ll call you at your preferred time.' : 'Our advisor will contact you within 60 seconds.'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-sm mb-5">{subtitles[mode]}</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block" htmlFor="lead-name">Full Name *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="lead-name"
                      {...register('name')}
                      placeholder="Rahul Sharma"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none focus:border-[#e4b363]/40 transition-colors"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block" htmlFor="lead-phone">Mobile Number *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="lead-phone"
                      {...register('phone')}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none focus:border-[#e4b363]/40 transition-colors"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block" htmlFor="lead-email">Email (Optional)</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="lead-email"
                      {...register('email')}
                      placeholder="rahul@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none focus:border-[#e4b363]/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Callback time — only for callback mode */}
                {mode === 'callback' && (
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1.5 block">Preferred Callback Time</label>
                    <div className="flex flex-wrap gap-2">
                      {CALLBACK_SLOTS.map((slot) => (
                        <label key={slot} className="cursor-pointer">
                          <input type="radio" value={slot} {...register('callbackTime')} className="sr-only" />
                          <span className="block glass-light text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-full border border-white/5 hover:border-[#e4b363]/30 transition-colors cursor-pointer has-[:checked]:border-[#e4b363]/50 has-[:checked]:text-[#e4b363]">
                            {slot}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block" htmlFor="lead-message">Message (Optional)</label>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3.5 top-3 text-slate-500" />
                    <textarea
                      id="lead-message"
                      {...register('message')}
                      rows={2}
                      placeholder="Your requirements or questions..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm outline-none focus:border-[#e4b363]/40 transition-colors resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#e4b363] hover:bg-[#f0cc8a] disabled:opacity-60 text-[#0f1a2f] font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(228,179,99,0.3)] text-sm flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="dot-1 w-2 h-2 bg-[#0f1a2f] rounded-full inline-block" />
                      <span className="dot-2 w-2 h-2 bg-[#0f1a2f] rounded-full inline-block" />
                      <span className="dot-3 w-2 h-2 bg-[#0f1a2f] rounded-full inline-block" />
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      {mode === 'callback' ? 'Schedule Callback' : mode === 'download' ? 'Send Brochure' : 'Submit Enquiry'}
                    </>
                  )}
                </button>

                <p className="text-slate-600 text-xs text-center">
                  By submitting, you agree to our{' '}
                  <a href="#" className="text-slate-500 hover:text-[#e4b363] transition-colors underline">Privacy Policy</a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
