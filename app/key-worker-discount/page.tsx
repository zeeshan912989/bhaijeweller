import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, CheckCircle, ArrowRight, Award, Stethoscope } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Key Worker & Essential Services Discount | Bhai Luxury Jewellery',
  description: 'Exclusive 15% discount for healthcare workers, emergency services, teachers, and charity workers at Bhai Jewellery.',
};

export default function KeyWorkerDiscountPage() {
  const eligibleGroups = [
    { title: 'Healthcare & NHS', desc: 'Doctors, nurses, paramedics, hospital staff and clinical specialists.', icon: Stethoscope },
    { title: 'Emergency Services', desc: 'Police officers, fire and rescue personnel, search and rescue teams.', icon: ShieldCheck },
    { title: 'Education & Teachers', desc: 'Primary and secondary school teachers, college professors, university staff.', icon: Award },
    { title: 'Charity & Social Care', desc: 'Registered charity employees, care home staff, and community social workers.', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#f4efe6] flex flex-col selection:bg-[#c5a880] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 md:py-24 w-full">
        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a880]/30 bg-[#c5a880]/10 text-xs tracking-widest text-[#c5a880] uppercase">
            <Heart className="w-3.5 h-3.5" /> A Token of Our Gratitude
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-[#f4efe6]">
            Key Worker Discount
          </h1>
          <p className="text-sm md:text-base text-neutral-400 font-light max-w-xl mx-auto">
            To thank you for your relentless dedication and community service, enjoy 15% off all full-price Bhai jewellery creations.
          </p>
        </div>

        {/* Hero Card */}
        <div className="bg-[#141419] border border-neutral-800/80 rounded-2xl p-8 md:p-12 mb-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <span className="text-4xl md:text-6xl font-serif text-[#c5a880]">15% OFF</span>
            <p className="text-neutral-300 text-sm md:text-base max-w-md mx-auto">
              Verify your professional identity through GoCertify or Blue Light Card to unlock your single-use discount code instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button className="px-8 py-3.5 rounded-full bg-[#c5a880] text-[#0d0d0f] text-xs uppercase tracking-widest font-medium hover:bg-[#d6bc96] transition-colors shadow-lg shadow-[#c5a880]/10 flex items-center justify-center gap-2">
                Verify via GoCertify <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button className="px-8 py-3.5 rounded-full border border-neutral-700 bg-neutral-900/60 text-xs uppercase tracking-widest font-medium hover:border-[#c5a880] text-neutral-300 hover:text-white transition-colors">
                Verify with Blue Light Card
              </button>
            </div>
          </div>
        </div>

        {/* Who is eligible */}
        <div className="mb-14">
          <h2 className="font-serif text-2xl font-light text-center mb-8">Who Is Eligible?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibleGroups.map((group, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-[#141419]/60 border border-neutral-800/60 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c5a880]/10 flex items-center justify-center shrink-0 text-[#c5a880]">
                  <group.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-[#f4efe6] mb-1">{group.title}</h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">{group.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="bg-[#141419]/40 border border-neutral-800/60 rounded-2xl p-8 mb-12">
          <h3 className="font-serif text-xl font-light text-center mb-6">How to Claim</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 text-[#c5a880] text-xs font-mono font-medium mx-auto flex items-center justify-center">01</div>
              <h4 className="text-xs uppercase tracking-wider text-neutral-200">Verify Identity</h4>
              <p className="text-xs text-neutral-400 font-light">Use your work email address or official employment ID.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 text-[#c5a880] text-xs font-mono font-medium mx-auto flex items-center justify-center">02</div>
              <h4 className="text-xs uppercase tracking-wider text-neutral-200">Receive Code</h4>
              <p className="text-xs text-neutral-400 font-light">Get a unique single-use promotional code generated instantly.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 text-[#c5a880] text-xs font-mono font-medium mx-auto flex items-center justify-center">03</div>
              <h4 className="text-xs uppercase tracking-wider text-neutral-200">Shop & Enjoy</h4>
              <p className="text-xs text-neutral-400 font-light">Apply the code at checkout for 15% off your cart.</p>
            </div>
          </div>
        </div>

        {/* Terms footer */}
        <p className="text-xs text-neutral-500 text-center font-light leading-relaxed">
          *Discount applies to full-price items only. Excludes solid fine gold fine-jewellery custom commissions, gift cards, and sale archive pieces. Cannot be combined with other promotional codes.
        </p>
      </main>

      <Footer />
    </div>
  );
}
