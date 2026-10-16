import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "./home-config";

export default function BlogSection() {
  return (
    <section id="blog" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Our Blog</h2>
            <p className="text-sm text-[#888] mt-1">Beauty tips, skincare guides, and more</p>
          </div>
          <Link
            href="#"
            className="text-sm font-semibold text-[#C8547A] hover:underline hidden sm:block"
          >
            View All
          </Link>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.title} href={post.href} className="group block">
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-[#F9F3F5]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Content */}
              <p className="text-xs text-[#888] mb-1">{post.date}</p>
              <h3 className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#C8547A] transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-[#888] mt-1.5">
                Post light glam skin tone idea…
              </p>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#C8547A] text-[#C8547A] font-semibold text-sm"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
