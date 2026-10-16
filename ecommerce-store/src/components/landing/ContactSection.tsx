import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { STORE_CONTACT } from './home-config';

export default function ContactSection() {
  const emailSubject = encodeURIComponent('Hello from Beautya');
  return (
    <section id="contact" className="py-14 sm:py-20 bg-[#FDF6F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-pink-100 p-8 sm:p-12 lg:p-16">
          {/* Decorative blob */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C8547A]/10 blur-3xl pointer-events-none" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C8547A] mb-3 block">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] leading-snug mb-4">
                We'd love to hear from you
              </h2>
              <p className="text-sm text-[#888] leading-relaxed mb-7 max-w-md">
                Have a question about a product, your order, or our ingredients? Our team is here for you every step of the way.
              </p>
              <a
                href={`mailto:${STORE_CONTACT.email}?subject=${emailSubject}`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C8547A] text-white font-semibold text-sm hover:bg-[#b04468] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Us
              </a>
            </div>

            {/* Right: contact details */}
            <div className="grid gap-4 sm:grid-cols-1 border-t border-gray-100 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <a
                href={`mailto:${STORE_CONTACT.email}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FDF6F8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8547A]/10 transition-colors">
                  <Mail className="w-4 h-4 text-[#C8547A]" />
                </div>
                <span className="text-sm text-[#555] group-hover:text-[#C8547A] transition-colors">
                  {STORE_CONTACT.email}
                </span>
              </a>

              <a
                href={`tel:${STORE_CONTACT.phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FDF6F8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8547A]/10 transition-colors">
                  <Phone className="w-4 h-4 text-[#C8547A]" />
                </div>
                <span className="text-sm text-[#555] group-hover:text-[#C8547A] transition-colors">
                  {STORE_CONTACT.phone}
                </span>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FDF6F8] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#C8547A]" />
                </div>
                <span className="text-sm text-[#555]">{STORE_CONTACT.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
