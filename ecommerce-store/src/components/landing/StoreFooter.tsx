import Image from 'next/image';
import Link from 'next/link';

export default function StoreFooter() {
  return <footer className="border-t border-white/[0.07] bg-black px-5 py-10 sm:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><div><Link href="/" aria-label="Back to home"><Image src="/images/logo.png" alt="Store logo" width={128} height={48} className="h-10 w-32 object-contain object-left"/></Link><p className="mt-2 text-xs text-white/40">A good pair takes you places.</p></div><nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/55"><Link href="#featured" className="transition hover:text-white">Featured</Link><Link href="#offers" className="transition hover:text-white">Offers</Link><Link href="#about" className="transition hover:text-white">About</Link><Link href="#contact" className="transition hover:text-white">Contact</Link></nav></div><div className="mx-auto mt-8 max-w-7xl border-t border-white/[0.07] pt-5 text-[10px] text-white/30">© {new Date().getFullYear()} All rights reserved.</div></footer>;
}
