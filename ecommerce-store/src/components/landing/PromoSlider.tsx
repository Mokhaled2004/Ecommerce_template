'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HOME_SLIDES } from './home-config';

export default function PromoSlider() {
  const [active, setActive] = useState(0);
  const slide = HOME_SLIDES[active];
  const move = (step: number) => setActive((current) => (current + step + HOME_SLIDES.length) % HOME_SLIDES.length);

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section aria-label="Featured collections" className="px-5 py-12 sm:px-10 lg:py-16">
      <div className="relative mx-auto min-h-[390px] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#1E1E24] sm:min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }} className="absolute inset-0">
            <Image src={slide.image} alt="Featured sneaker" fill sizes="100vw" className="object-cover object-center opacity-55" />
            <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 6.5 }} className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 flex min-h-[390px] items-end p-7 sm:min-h-[500px] sm:p-14 lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div key={`copy-${active}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#F59E0B]">{slide.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">{slide.title}</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">{slide.description}</p>
              <Link href={slide.href} className="mt-7 inline-flex rounded-full bg-[#E11D48] px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-500">{slide.action}</Link>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
          <span className="mr-2 text-xs font-semibold tracking-widest text-white/75">{String(active + 1).padStart(2, '0')} / {String(HOME_SLIDES.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => move(-1)} aria-label="Previous slide" className="rounded-full border border-white/30 bg-black/30 p-3 text-white backdrop-blur transition hover:bg-white/15"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next slide" className="rounded-full border border-white/30 bg-black/30 p-3 text-white backdrop-blur transition hover:bg-white/15"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
    </section>
  );
}
