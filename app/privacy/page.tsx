import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, KeyRound, UserCheck, BellRing } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy & Security Policy | Bhai Luxury Jewellery',
  description: 'Learn how Bhai protects your personal information, payment security, cookies policy, and GDPR compliance.',
};

export default function PrivacyPage() {
  const securityPillars = [
    { title: 'Data Encryption', desc: 'End-to-end 256-bit TLS/SSL encryption for all data transit and encrypted vaults for client profiles.', icon: Lock },
    { title: 'Strict Confidentiality', desc: 'We never sell, lease, or monetize your personal shopping habits or personal information to third parties.', icon: ShieldCheck },
    { title: 'Payment Vaulting', desc: 'All credit card data is handled exclusively by Tier-1 PCI-DSS certified payment processors.', icon: KeyRound },
    { title: 'GDPR & Privacy Rights', desc: 'Full control over your data: easily request data export or deletion under GDPR / CCPA anytime.', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#f4efe6] flex flex-col selection:bg-[#c5a880] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 md:py-24 w-full">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a880]/30 bg-[#c5a880]/10 text-xs tracking-widest text-[#c5a880] uppercase">
            <Lock className="w-3.5 h-3.5" /> Data Protection & Security
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-[#f4efe6]">
            Privacy & Security Policy
          </h1>
          <p className="text-xs text-neutral-400 font-light">
            Effective Date: January 1, 2026 • GDPR & CCPA Compliant
          </p>
        </div>

        {/* Security Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {securityPillars.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#141419] border border-neutral-800/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#c5a880]/10 flex items-center justify-center text-[#c5a880]">
                <item.icon className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-base text-[#f4efe6]">{item.title}</h2>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-neutral-300">
          <section className="p-6 md:p-8 rounded-2xl bg-[#141419]/70 border border-neutral-800/80 space-y-3">
            <h2 className="font-serif text-lg md:text-xl text-[#c5a880] font-normal">1. Information We Collect</h2>
            <p className="text-xs md:text-sm font-light leading-relaxed">
              When you browse our catalogue, make a purchase, or create a client profile, we collect details including your name, shipping/billing address, email, telephone number, ring/bracelet size preferences, and order history.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl bg-[#141419]/70 border border-neutral-800/80 space-y-3">
            <h2 className="font-serif text-lg md:text-xl text-[#c5a880] font-normal">2. How We Use Your Data</h2>
            <ul className="text-xs md:text-sm font-light space-y-2 list-disc list-inside text-neutral-400">
              <li>To seamlessly fulfill, insure, and deliver your bespoke jewellery orders.</li>
              <li>To provide concierge customer support and sizing guidance.</li>
              <li>To detect and prevent fraudulent transactions.</li>
              <li>To send curated seasonal lookbooks and VIP previews (only if opted in).</li>
            </ul>
          </section>

          <section className="p-6 md:p-8 rounded-2xl bg-[#141419]/70 border border-neutral-800/80 space-y-3">
            <h2 className="font-serif text-lg md:text-xl text-[#c5a880] font-normal">3. Cookies & Tracking Technologies</h2>
            <p className="text-xs md:text-sm font-light leading-relaxed">
              We employ essential cookies to remember your bag items and currency preferences, as well as anonymized analytics cookies to measure and refine our store performance. You can manage or disable cookie preferences at any time in your browser settings.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl bg-[#141419]/70 border border-neutral-800/80 space-y-3">
            <h2 className="font-serif text-lg md:text-xl text-[#c5a880] font-normal">4. Your Privacy Rights</h2>
            <p className="text-xs md:text-sm font-light leading-relaxed">
              Under UK GDPR and European data protection law, you have the right to request access to your personal information, object to processing, rectify inaccurate data, or request permanent deletion (the &apos;right to be forgotten&apos;).
            </p>
          </section>
        </div>

        {/* Action Link */}
        <div className="mt-14 p-6 rounded-2xl bg-[#141419]/40 border border-neutral-800/60 text-center space-y-3">
          <h3 className="font-serif text-base text-neutral-200">Data Subject Access Requests</h3>
          <p className="text-xs text-neutral-400 font-light max-w-md mx-auto">
            To submit a formal data deletion or export request, contact our appointed Data Protection Officer.
          </p>
          <a
            href="mailto:dpo@bhaijewellery.com"
            className="inline-block mt-2 text-xs text-[#c5a880] uppercase tracking-widest hover:underline"
          >
            Email DPO (dpo@bhaijewellery.com) →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
