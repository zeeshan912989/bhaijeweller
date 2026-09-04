import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Jewellery Collections | Bhai Luxury Jewellery',
  description: 'Explore curated jewellery collections from handcrafted earrings and layered necklaces to statement rings and gold bracelets.',
};

export default function CollectionsIndexPage() {
  const collections = [
    {
      title: 'Earrings',
      slug: 'earrings',
      tagline: 'Hoops, huggies, studs, and ear cuffs designed for everyday stacking.',
      count: '48 Designs',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000',
    },
    {
      title: 'Necklaces & Pendants',
      slug: 'necklaces',
      tagline: 'Iconic coin medallions, delicate chains, and gemstone chokers.',
      count: '62 Designs',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000',
    },
    {
      title: 'Bracelets & Bangles',
      slug: 'bracelets',
      tagline: 'Twisted rope chains, tennis bracelets, and bold sculptural cuffs.',
      count: '34 Designs',
      image: 'https://images.unsplash.com/photo-1611591475104-a690e1f70d24?auto=format&fit=crop&q=80&w=1000',
    },
    {
      title: 'Rings & Bands',
      slug: 'rings',
      tagline: 'Molten signets, pavé eternity bands, and tactile statement dome rings.',
      count: '41 Designs',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000',
    },
    {
      title: 'Solid 14ct Gold',
      slug: 'fine-jewellery',
      tagline: 'Forever heirlooms crafted in 100% recycled 14ct yellow and white gold.',
      count: '18 Heirlooms',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000',
    },
    {
      title: 'Gift Sets & Curations',
      slug: 'gifts',
      tagline: 'Pre-layered bestselling pairings presented in velvet keepsake boxes.',
      count: '12 Sets',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#f4efe6] flex flex-col selection:bg-[#c5a880] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a880]/30 bg-[#c5a880]/10 text-xs tracking-widest text-[#c5a880] uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Curated Edits
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-[#f4efe6]">
            Our Collections
          </h1>
          <p className="text-sm md:text-base text-neutral-400 font-light max-w-lg mx-auto">
            Explore conscious demi-fine jewellery crafted with recycled metals, designed for effortless layering.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collections.map((col, idx) => (
            <Link
              key={idx}
              href={`/collections/${col.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-[#141419] border border-neutral-800/80 hover:border-[#c5a880]/60 transition-all duration-500 flex flex-col aspect-[4/5]"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/50 to-transparent" />
              </div>

              {/* Top tag */}
              <div className="relative z-10 p-6 flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-400 bg-[#0d0d0f]/60 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-800">
                  {col.count}
                </span>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 mt-auto p-6 md:p-8 space-y-2">
                <h2 className="font-serif text-2xl text-[#f4efe6] group-hover:text-[#c5a880] transition-colors flex items-center justify-between">
                  {col.title}
                  <ArrowRight className="w-5 h-5 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#c5a880]" />
                </h2>
                <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-2">
                  {col.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
