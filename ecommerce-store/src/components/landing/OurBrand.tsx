import Image from "next/image";
import Link from "next/link";

export default function OurBrand() {
  return (
    <section className="py-14 sm:py-20 bg-[#3B1A26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E8A0B0] mb-3 block">
              Our Brand
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug mb-5">
              Beauty That Begins With Nature
            </h2>
            <p className="text-white/65 text-sm leading-relaxed mb-4">
              Beautya was born from a simple belief: that everyone deserves skincare that works with their skin, not against it. We source the finest natural ingredients from around the world, combining them with cutting-edge science to create products that truly make a difference.
            </p>
            <p className="text-white/65 text-sm leading-relaxed mb-8">
              From our cruelty-free formulas to our sustainable packaging, every choice we make is guided by our commitment to beauty, people, and the planet.
            </p>
            <div className="flex flex-wrap gap-8 mb-8">
              {[
                { value: "200+", label: "Natural Ingredients" },
                { value: "50K+", label: "Happy Customers" },
                { value: "100%", label: "Cruelty Free" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center px-7 py-3 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white hover:text-[#3B1A26] transition-all"
            >
              Explore More
            </Link>
          </div>

          {/* Image */}
          <div className="relative h-80 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden">
            <Image
              src="/images/banners/b689cfc53889e16d9fa29872d8015f00ce1817ed.jpg"
              alt="Our Brand — beauty model"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
