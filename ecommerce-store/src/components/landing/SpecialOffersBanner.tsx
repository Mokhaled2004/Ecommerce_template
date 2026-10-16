import Image from "next/image";
import Link from "next/link";

export default function SpecialOffersBanner() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-[#FDF0F4] min-h-[260px] sm:min-h-[300px]">
          {/* Left: promo image */}
          <div className="absolute inset-y-0 left-0 w-2/5 hidden sm:block">
            <Image
              src="/images/banners/fa1dfa2f5a01b09d1badbb76112cfc3f75e3b0da.jpg"
              alt="Special Offers"
              fill
              sizes="40vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right: text content */}
          <div className="relative z-10 flex items-center h-full sm:ml-[42%] p-8 sm:p-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C8547A] mb-2 block">
                Special Offers
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#3B1A26] leading-snug mb-3">
                Save Up To <span className="text-[#C8547A]">50%</span>
              </h2>
              <p className="text-sm text-[#555] leading-relaxed mb-6 max-w-sm">
                Don't miss out on our biggest sale of the season. Grab premium skincare and cosmetics at unbeatable prices — limited time only.
              </p>
              <Link
                href="/shop?sale=true"
                className="inline-flex items-center px-7 py-3 rounded-full bg-[#C8547A] text-white font-semibold text-sm hover:bg-[#b04468] transition-colors shadow-md"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
