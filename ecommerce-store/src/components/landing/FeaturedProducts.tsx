import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HOME_PRODUCT_LIMIT } from './home-config';

type Product = { id: string; name: string; sku: string; slug: string; price: string; compareAtPrice: string | null; imageUrl: string | null; isFeatured: boolean };

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const visibleProducts = products.slice(0, HOME_PRODUCT_LIMIT);
  return (
    <section id="featured" className="mx-auto max-w-7xl px-5 py-14 sm:px-10 lg:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[#E11D48]">Picked for the rotation</p><h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">The featured lineup</h2><p className="mt-2 max-w-xl text-sm text-white/55">A few pairs we think deserve a closer look.</p></div>
        <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/55">{visibleProducts.length} styles</span>
      </div>
      {visibleProducts.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">{visibleProducts.map((product, index) => <article key={product.id} className="group"><Link href="#contact" aria-label={`Ask us about ${product.name}`} className="block"><div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1E1E24]"><span className="absolute left-3 top-3 z-10 rounded-full bg-black/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur">{product.isFeatured ? 'Featured' : `Style ${String(index + 1).padStart(2, '0')}`}</span>{product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105"/> : <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-xs uppercase tracking-widest text-white/30">Image coming soon</div>}<span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#E11D48] text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4"/></span></div><h3 className="mt-3 line-clamp-1 text-sm font-bold text-white sm:text-base">{product.name}</h3><div className="mt-1 flex items-center gap-2"><span className="text-sm font-semibold text-white/75">${Number(product.price).toFixed(2)}</span>{product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && <span className="text-xs text-white/35 line-through">${Number(product.compareAtPrice).toFixed(2)}</span>}</div></Link><p className="mt-1 text-[10px] font-mono tracking-wider text-white/35">{product.sku}</p></article>)}</div> : <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center"><p className="font-semibold text-white/75">New styles are on the way.</p><p className="mt-2 text-sm text-white/45">Add active products in the admin to fill this lineup.</p></div>}
    </section>
  );
}
