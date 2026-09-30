"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const shoes = [
  { id: "shoe1", name: "Air Jordan 1 Retro", price: "$180", frameImage: "/images/frame1.png", thumbnail: "/images/shoe1.png" },
  { id: "shoe2", name: "Nike Air Max Yellow", price: "$150", frameImage: "/images/frame2.png", thumbnail: "/images/shoe2.png" },
  { id: "shoe3", name: "Nike Pink Runner", price: "$120", frameImage: "/images/frame3.png", thumbnail: "/images/shoe3.png" },
  { id: "shoe4", name: "Nike Orange/Black 270", price: "$160", frameImage: "/images/frame4.png", thumbnail: "/images/shoe4.png" },
  { id: "shoe5", name: "Nike Blue Trainer", price: "$130", frameImage: "/images/frame5.png", thumbnail: "/images/shoe5.png" },
  { id: "shoe6", name: "Nike Leather Edition", price: "$170", frameImage: "/images/frame6.png", thumbnail: "/images/shoe6.png" },
];

export default function Hero() {
  const [selectedShoe, setSelectedShoe] = useState(shoes[0]);

  return (
    <section className="relative flex h-[85vh] w-full flex-col items-center overflow-hidden bg-[#121214] sm:h-screen">
      <img
        src="/images/hero.png"
        alt="Sneaker collection background"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-[center_15%] sm:object-cover sm:object-center"
      />

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedShoe.id}
            src={selectedShoe.frameImage}
            alt={selectedShoe.name}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="pointer-events-none absolute -ml-[12.5%] h-[125%] w-[125%] select-none object-contain object-top sm:ml-0 sm:h-full sm:w-full sm:object-cover sm:object-center"
          />
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start gap-4 px-5 pb-6 pt-[32vh] sm:gap-6 sm:px-6 sm:pt-0 lg:flex-row lg:justify-between lg:px-16">
        <div className="pointer-events-auto w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedShoe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#E11D48] sm:text-sm">Featured Release</span>
              <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight text-white drop-shadow-lg sm:mb-2 sm:text-6xl lg:text-7xl">{selectedShoe.name}</h1>
              <p className="mb-2.5 line-clamp-2 text-xs text-[#A1A1AA] drop-shadow sm:mb-6 sm:text-base">Engineered for ultimate comfort, striking streetwear aesthetics, and peak performance.</p>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <button className="rounded-full bg-[#F59E0B] px-5 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 sm:px-8 sm:py-3 sm:text-base">Buy Now</button>
                <span className="text-lg font-semibold text-white sm:text-2xl">{selectedShoe.price}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto flex max-w-full gap-2.5 overflow-x-auto rounded-3xl border border-white/10 bg-[#1E1E24]/60 p-2 shadow-2xl backdrop-blur-md sm:gap-3 sm:p-5 lg:grid lg:grid-cols-2">
          {shoes.map((shoe) => {
            const isSelected = selectedShoe.id === shoe.id;
            return (
              <button
                key={shoe.id}
                onClick={() => setSelectedShoe(shoe)}
                aria-label={`Show ${shoe.name}`}
                aria-pressed={isSelected}
                className={`group relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full transition-all duration-300 focus:outline-none sm:h-20 sm:w-20 ${isSelected ? "scale-105 border-2 border-[#E11D48] bg-[#1E1E24] shadow-[0_0_20px_rgba(225,29,72,0.6)]" : "border border-white/20 bg-[#121214]/80 hover:border-white/50"}`}
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full p-0.5 sm:h-16 sm:w-16">
                  <img src={shoe.thumbnail} alt="" className="pointer-events-none h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                {isSelected && <span className="pointer-events-none absolute -inset-1 animate-pulse rounded-full border border-[#E11D48]/40" />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
