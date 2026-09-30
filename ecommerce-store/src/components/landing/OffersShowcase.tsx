'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Copy, Timer } from 'lucide-react';

type Offer = { id: string; name: string; description: string | null; type: string; value: string | null; couponCode: string | null; endAt: string; metadata: Record<string, any> | null };

function discountLabel(offer: Offer) {
  if (offer.type === 'percentage') return `${offer.value}% OFF`;
  if (offer.type === 'fixed' || offer.type === 'fixed_amount') return `$${offer.value} OFF`;
  if (offer.couponCode) return offer.metadata?.discountType === 'percentage' ? `${offer.value}% OFF` : `$${offer.value} OFF`;
  if (offer.type === 'buy_x_get_y') return `BUY ${offer.metadata?.buyQuantity || 'X'} · GET ${offer.metadata?.getQuantity || 'Y'}`;
  return 'LIMITED OFFER';
}

function useCountdown(endAt: string) {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    const update = () => {
      const ms = new Date(endAt).getTime() - Date.now();
      if (ms <= 0) { setRemaining('Ended'); return; }
      const days = Math.floor(ms / 86400000);
      const hours = Math.floor((ms % 86400000) / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      setRemaining(`${days ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [endAt]);
  return remaining;
}

function OfferCard({ offer }: { offer: Offer }) {
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(offer.endAt);
  const copyCode = async () => {
    if (!offer.couponCode) return;
    try { await navigator.clipboard.writeText(offer.couponCode); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  };

  return (
    <article className="relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-rose-400/20 bg-gradient-to-br from-rose-950 via-[#27121b] to-[#151518] p-6 sm:min-h-[340px] sm:p-8">
      <div className="absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full bg-[#E11D48]/20 blur-3xl" />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#F59E0B]">Limited time · {discountLabel(offer)}</p>
        <h3 className="mt-4 max-w-xl text-3xl font-black text-white sm:text-4xl">{offer.name}</h3>
        <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">{offer.description || 'A little something extra for your next pair.'}</p>
      </div>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
        <div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45"><Timer className="h-3.5 w-3.5" /> Offer ends in</p><p className="mt-2 font-mono text-2xl font-bold tabular-nums text-white sm:text-3xl">{countdown || '00:00:00'}</p></div>
        {offer.couponCode && <button type="button" onClick={() => void copyCode()} className="group inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-left transition hover:border-rose-300/50 hover:bg-white/10"><span><span className="block text-[9px] font-bold uppercase tracking-widest text-white/45">Use code</span><span className="font-mono text-sm font-bold tracking-[0.16em] text-white">{offer.couponCode}</span></span>{copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4 text-white/60" />}</button>}
      </div>
    </article>
  );
}

export default function OffersShowcase({ offers }: { offers: Offer[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => { if (offers.length < 2) return; const timer = window.setInterval(() => setActive((index) => (index + 1) % offers.length), 7500); return () => window.clearInterval(timer); }, [offers.length]);
  if (!offers.length) return null;
  const offer = offers[active % offers.length];
  return <section id="offers" className="mx-auto max-w-7xl px-5 py-12 sm:px-10 lg:py-16"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[#F59E0B]">Good things don’t wait</p><h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Offers worth moving for</h2></div>{offers.length > 1 && <div className="flex gap-2">{offers.map((item, index) => <button key={item.id} type="button" onClick={() => setActive(index)} aria-label={`Show offer ${index + 1}`} aria-pressed={index === active} className={`h-2.5 rounded-full transition-all ${index === active ? 'w-8 bg-[#E11D48]' : 'w-2.5 bg-white/25 hover:bg-white/50'}`} />)}</div>}</div><AnimatePresence mode="wait"><motion.div key={offer.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.3 }}><OfferCard offer={offer}/></motion.div></AnimatePresence><a href="#featured" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white">Find your next pair <ArrowRight className="h-4 w-4"/></a></section>;
}
