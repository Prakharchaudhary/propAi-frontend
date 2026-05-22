'use client';

import { useState } from 'react';
import { Sparkles, Brain, BarChart3, MessageSquare, ShieldCheck, Bot, ChevronRight, Zap, TrendingUp, Home } from 'lucide-react';

const AI_FEATURES = [
  {
    icon: Brain,
    title: 'Smart Property Matching',
    desc: 'AI analyzes your lifestyle, budget, and commute needs to recommend properties with up to 97% match accuracy.',
    metric: '97% accuracy',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Market Insights',
    desc: 'Live price trends, demand-supply analysis, and investment ROI forecasts powered by 50+ data sources.',
    metric: '50+ data sources',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  {
    icon: MessageSquare,
    title: 'Bilingual Conversations',
    desc: '"Mumbai mein 2BHK dikhao" — our AI understands Hindi, English, and Hinglish queries naturally.',
    metric: 'Hindi + English',
    color: 'text-[#e4b363]',
    bg: 'bg-[#e4b363]/10 border-[#e4b363]/20',
  },
  {
    icon: ShieldCheck,
    title: 'RERA-Verified Trust Layer',
    desc: 'Every property listing is cross-checked with RERA databases to ensure compliance and authenticity.',
    metric: '100% RERA check',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
];

const MARKET_TRENDS = [
  { city: 'Gurgaon', change: '+12.4%', direction: 'up', insight: '3BHK demand surging' },
  { city: 'Bengaluru', change: '+9.1%', direction: 'up', insight: 'IT corridor hotspot' },
  { city: 'Hyderabad', change: '+15.3%', direction: 'up', insight: 'Fastest growing market' },
  { city: 'Mumbai', change: '+4.2%', direction: 'up', insight: 'Stable premium demand' },
  { city: 'Pune', change: '+7.8%', direction: 'up', insight: 'NRI investor favorite' },
  { city: 'Noida', change: '+6.5%', direction: 'up', insight: 'Affordable + Premium mix' },
];

const CHAT_DEMO = [
  { role: 'user', content: 'Noida mein 2BHK dikhao 70 lakh budget mein' },
  { role: 'ai', content: 'Main aapke liye Noida Sector 137 aur 150 mein 2BHK search kar raha hoon...', thinking: true },
  { role: 'ai', content: '3 properties mili hain! Greenfield Township (₹78L), Supertech Capetown (₹72L), aur ATS Le Grandiose (₹82L). Kaunsa dekhna hai?', thinking: false },
];

export default function AIInsightsSection() {
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <>
      {/* Why PropAI Features */}
      <section id="insights" className="py-20 bg-[#080f1e] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#162440]/60 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bot size={14} className="text-[#e4b363]" />
              <span className="text-[#e4b363] text-xs font-semibold tracking-widest uppercase">AI-Native Platform</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-balance mb-4">
              ChatGPT meets
              <br />
              <span className="text-[#e4b363]">Luxury Real Estate</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              India ka sabse smart real estate OS — designed for buyers, brokers, and builders.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
            {AI_FEATURES.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 border border-[#e4b363]/8 hover:border-[#e4b363]/20 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${f.bg}`}>
                    <f.icon size={22} className={f.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-base">{f.title}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${f.bg} ${f.color}`}>
                        {f.metric}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Market Trends + Chat Demo side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Trends */}
            <div className="glass rounded-2xl p-6 border border-[#e4b363]/10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-[#e4b363]" />
                    <span className="text-[#e4b363] text-xs font-semibold uppercase tracking-wider">Live Data</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">Market Pulse</h3>
                </div>
                <div className="glass-gold rounded-full px-3 py-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[#e4b363] text-xs font-medium">Live</span>
                </div>
              </div>

              <div className="space-y-3">
                {MARKET_TRENDS.map((trend) => (
                  <div key={trend.city} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#e4b363]/10 flex items-center justify-center">
                        <Home size={14} className="text-[#e4b363]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{trend.city}</p>
                        <p className="text-slate-500 text-xs">{trend.insight}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={13} className="text-green-400" />
                      <span className="text-green-400 font-bold text-sm">{trend.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Demo */}
            <div className="glass rounded-2xl overflow-hidden border border-[#e4b363]/10">
              {/* Header */}
              <div className="bg-[#0f1a2f]/80 px-5 py-4 flex items-center justify-between border-b border-[#e4b363]/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#e4b363] flex items-center justify-center">
                    <Sparkles size={16} className="text-[#0f1a2f]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">PropAI Assistant</p>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs">Online — Replies instantly</span>
                    </div>
                  </div>
                </div>
                <Zap size={16} className="text-[#e4b363]" />
              </div>

              {/* Messages */}
              <div className="p-5 flex flex-col gap-4 min-h-[260px]">
                {CHAT_DEMO.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-[#e4b363]/15 border border-[#e4b363]/30 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        <Bot size={13} className="text-[#e4b363]" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#e4b363]/15 text-white border border-[#e4b363]/25 rounded-br-sm'
                        : 'bg-white/5 text-slate-300 border border-white/8 rounded-bl-sm'
                    }`}>
                      {msg.thinking && (
                        <div className="flex gap-1 items-center mb-1">
                          <span className="dot-1 w-1.5 h-1.5 bg-[#e4b363] rounded-full" />
                          <span className="dot-2 w-1.5 h-1.5 bg-[#e4b363] rounded-full" />
                          <span className="dot-3 w-1.5 h-1.5 bg-[#e4b363] rounded-full" />
                          <span className="text-[#e4b363] text-xs ml-1">Searching...</span>
                        </div>
                      )}
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input preview */}
              <div className="p-4 border-t border-white/5 flex gap-3">
                <div className="flex-1 glass-light rounded-xl px-4 py-2.5 text-slate-500 text-sm">
                  Aapka sawaal likho ya bolo...
                </div>
                <button className="w-10 h-10 rounded-xl bg-[#e4b363] flex items-center justify-center hover:bg-[#f0cc8a] transition-colors">
                  <ChevronRight size={18} className="text-[#0f1a2f]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Lead Assistant CTA */}
      <section className="py-16 bg-[#0a1120] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(228,179,99,0.06)_0%,transparent_70%)]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-10 border border-[#e4b363]/20 shadow-[0_0_80px_rgba(228,179,99,0.05)]">
            <div className="w-16 h-16 rounded-2xl bg-[#e4b363]/10 border border-[#e4b363]/25 flex items-center justify-center mx-auto mb-6 pulse-gold">
              <Bot size={28} className="text-[#e4b363]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
              Aapka AI Property Advisor
              <br />
              <span className="text-[#e4b363]">24/7 Available Hai</span>
            </h2>
            <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">
              Whether you want to buy, rent, or invest — our AI lead assistant connects you with the right broker in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setChatVisible(true)}
                className="bg-[#e4b363] hover:bg-[#f0cc8a] text-[#0f1a2f] font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(228,179,99,0.4)]"
              >
                <Sparkles size={18} />
                Chat with AI Assistant
              </button>
              <a
                href="https://wa.me/919999999999?text=Namaste%21%20I%20want%20to%20buy%20a%20property"
                target="_blank"
                rel="noreferrer"
                className="glass-gold text-[#e4b363] font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2.5 hover:bg-[#e4b363]/15 transition-all duration-300"
              >
                <Zap size={18} />
                WhatsApp Connect
              </a>
            </div>
            <p className="text-slate-600 text-xs mt-6">No registration required &bull; 100% Free &bull; Instant response</p>
          </div>
        </div>
      </section>
    </>
  );
}
