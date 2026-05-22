'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Sparkles, Bot, MicOff, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  properties?: any[];
}

interface PropertyContext {
  lat?: number;
  lng?: number;
  address?: string;
  title?: string;
}

interface ChatWidgetProps {
  propertyContext?: PropertyContext;
  autoOpen?: boolean;
}

export default function ChatWidget({ propertyContext, autoOpen = false }: ChatWidgetProps) {
  const [open, setOpen] = useState(autoOpen);
  const [showModeSelect, setShowModeSelect] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: propertyContext?.title
        ? `Namaste! 🏠 Main PropAI Assistant hoon.\n\n"${propertyContext.title}" ke baare mein kuch poochna hai?\n\nAap kaise baat karna chahenge?`
        : 'Namaste! 🏠 Main PropAI Assistant hoon.\n\nAap kaise baat karna chahenge?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [unread, setUnread] = useState(1);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('propai_session');
      if (existing) return existing;
      const newId = `session_${Date.now()}`;
      localStorage.setItem('propai_session', newId);
      return newId;
    }
    return `session_${Date.now()}`;
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  const cleanReply = (text: string) => {
    return text
      .replace(/\{"captureLeadName"[\s\S]*?\}/g, '')
      .replace(/SLUG:\S+/g, '')
      .replace(/\bSLUG\b/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const sendMessage = async (text?: string) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;

    setInput('');
    setShowModeSelect(false);
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMsg,
          propertyContext: propertyContext || null,
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: cleanReply(data.reply || ''),
          properties: data.properties || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, kuch problem hui. Dobara try karo.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Aapka browser voice support nahi karta. Chrome use karo.');
      return;
    }

    setShowModeSelect(false);
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      sendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Voice recognize nahi hua. Dobara try karo ya type karo.',
        },
      ]);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const QUICK_LOCALITY = propertyContext
    ? [
        '🚇 Nearest metro kaun sa hai?',
        '🏥 Paas mein hospital kahan hai?',
        '🏫 Schools kaun se hain?',
        '🛍️ Nearest mall kitna door hai?',
      ]
    : [
        '2BHK under 80L in Noida',
        'Flats near metro in Delhi',
        'Villa in Bangalore 2Cr',
      ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setOpen(true); setUnread(0); }}
        aria-label="Open AI chat assistant"
        className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-[#e4b363] hover:bg-[#f0cc8a] text-[#0f1a2f] shadow-[0_0_30px_rgba(228,179,99,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <Sparkles size={22} />
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 md:bottom-28 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[360px] rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border border-[#e4b363]/20"
          style={{ height: '540px' }}
        >
          {/* Header */}
          <div className="bg-[#0f1a2f] px-4 py-3.5 flex items-center justify-between border-b border-[#e4b363]/15 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#e4b363] flex items-center justify-center">
                <Bot size={17} className="text-[#0f1a2f]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">PropAI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs">
                    {isListening ? 'Sun raha hoon...' : 'Online — Instant replies'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Property Context Banner */}
          {propertyContext?.title && (
            <div className="bg-[#e4b363]/10 border-b border-[#e4b363]/20 px-4 py-2 flex items-center gap-2">
              <MapPin size={12} className="text-[#e4b363] shrink-0" />
              <p className="text-[#e4b363] text-xs line-clamp-1 font-medium">
                {propertyContext.title}
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#080f1e]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#e4b363]/15 border border-[#e4b363]/25 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={11} className="text-[#e4b363]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#e4b363]/15 border border-[#e4b363]/25 text-white rounded-br-sm'
                      : 'bg-[#162440] text-slate-200 border border-white/5 rounded-bl-sm'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Mode Select */}
                  {i === 0 && showModeSelect && (
                    <div className="flex flex-col gap-2 mt-3">
                      <button
                        onClick={() => {
                          setShowModeSelect(false);
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: 'assistant',
                              content: propertyContext?.title
                                ? `Bilkul! "${propertyContext.title}" ke baare mein kuch bhi poochho — locality, price, amenities sab bataunga! 😊`
                                : 'Bilkul! Apni property requirements type karo. 😊',
                            },
                          ]);
                        }}
                        className="glass border border-[#e4b363]/30 text-[#e4b363] text-xs px-3 py-2 rounded-xl hover:bg-[#e4b363]/10 transition-colors text-left"
                      >
                        ⌨️ Type karke baat karo
                      </button>
                      <button
                        onClick={startVoice}
                        className="glass border border-[#e4b363]/30 text-[#e4b363] text-xs px-3 py-2 rounded-xl hover:bg-[#e4b363]/10 transition-colors text-left"
                      >
                        🎤 Voice se baat karo
                      </button>
                    </div>
                  )}

                  {/* Property Cards */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                      {msg.properties.map((p: any) => (
                        <Link
                          key={p._id}
                          href={`/properties/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="block bg-[#0f1a2f] border border-[#e4b363]/20 rounded-xl p-2.5 hover:border-[#e4b363]/50 transition-colors"
                        >
                          <p className="font-semibold text-white text-xs line-clamp-1">{p.title}</p>
                          <p className="text-[#e4b363] font-bold text-sm">
                            ₹{p.priceLabel || p.price}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {p.configuration} · {p.city}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Listening */}
            {isListening && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-1">
                  <Mic size={11} className="text-red-400 animate-pulse" />
                </div>
                <div className="bg-[#162440] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="text-red-400 text-xs animate-pulse">Sun raha hoon... boliye</span>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#e4b363]/15 border border-[#e4b363]/25 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={11} className="text-[#e4b363]" />
                </div>
                <div className="bg-[#162440] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-[#e4b363] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#e4b363] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#e4b363] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && !showModeSelect && (
            <div className="px-3 py-2 bg-[#080f1e] border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {QUICK_LOCALITY.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="shrink-0 glass-light text-slate-300 text-xs px-3 py-1.5 rounded-full hover:border-[#e4b363]/30 transition-colors whitespace-nowrap"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/5 bg-[#0a1120] flex gap-2 items-center shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={propertyContext ? 'Is property ke baare mein poochho...' : 'Message PropAI...'}
              className="flex-1 bg-[#162440] border border-white/8 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#e4b363]/40 transition-colors"
            />
            <button
              onClick={startVoice}
              disabled={isListening}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 animate-pulse text-white'
                  : 'bg-[#162440] border border-white/10 text-slate-400 hover:text-[#e4b363] hover:border-[#e4b363]/30'
              }`}
              aria-label="Voice input"
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-9 h-9 rounded-xl bg-[#e4b363] disabled:opacity-40 hover:bg-[#f0cc8a] text-[#0f1a2f] flex items-center justify-center transition-all duration-200"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}