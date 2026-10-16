"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "./home-config";

export default function Hero() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = HERO_SLIDES[active];
  const move = (step: number) =>
    setActive((c) => (c + step + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    if (isPaused) return;
    const t = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(t);
  }, [isPaused, active]);

  return (
    <section 
      className="relative w-full h-[92vh] min-h-[540px] overflow-hidden bg-[#F9F3F5]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt="Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`copy-${active}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#E8A0B0] mb-4">
                {slide.eyebrow}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8 max-w-md">
                {slide.description}
              </p>
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#C8547A] font-semibold text-sm hover:bg-[#C8547A] hover:text-white transition-all duration-300 shadow-lg"
              >
                {slide.action}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide navigation arrows - full height at edges */}
      <button
        onClick={() => move(-1)}
        aria-label="Previous slide"
        className="absolute left-0 top-0 bottom-0 z-20 w-16 flex items-center justify-center text-white bg-gradient-to-r from-black/30 to-transparent hover:from-black/50 transition-all group"
      >
        <ChevronLeft className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>
      <button
        onClick={() => move(1)}
        aria-label="Next slide"
        className="absolute right-0 top-0 bottom-0 z-20 w-16 flex items-center justify-center text-white bg-gradient-to-l from-black/30 to-transparent hover:from-black/50 transition-all group"
      >
        <ChevronRight className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Slide dots with progress */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 relative overflow-hidden ${
              i === active ? "w-8 h-2" : "w-2 h-2"
            }`}
          >
            {i === active ? (
              <>
                <div className="absolute inset-0 bg-white/40" />
                <motion.div
                  key={`progress-${active}`}
                  initial={{ width: "0%" }}
                  animate={{ width: isPaused ? "0%" : "100%" }}
                  transition={{ duration: isPaused ? 0 : 5, ease: "linear" }}
                  className="absolute inset-0 bg-white"
                />
              </>
            ) : (
              <div className="w-full h-full bg-white/40 hover:bg-white/70 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
