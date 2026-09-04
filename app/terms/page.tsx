import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms & Conditions | Bhai Luxury Jewellery',
  description: 'Terms of service, sales policy, intellectual property, and legal conditions governing Bhai Luxury Jewellery.',
};

export default function TermsPage() {
  const sections = [
    {
      id: 'general',
      title: '1. General Terms of Service',
      content: 'Welcome to Bhai Luxury Jewellery ("Bhai", "we", "us", "our"). By accessing or placing orders through our website, mobile application, or in-person boutiques, you agree to be bound by these Terms and Conditions. Please review them carefully before concluding any transaction.',
    },
    {
      id: 'ordering-pricing',
      title: '2. Orders & Pricing',
      content: 'All prices are listed in local currency inclusive of applicable VAT unless stated otherwise. We reserve the right to modify prices at any time. In the event of an inadvertent typographical error in pricing, we retain the right to cancel or amend orders prior to dispatch, with immediate notification and refund.',
    },
    {
      id: 'payment-security',
      title: '3. Payment & Security',
      content: 'We accept major credit/debit cards (Visa, MasterCard, American Express), Apple Pay, and Google Pay. All transactions are encrypted via 256-bit SSL protocols and processed through PCI-DSS Tier 1 certified payment gateways. We do not store full payment card details on our local servers.',
    },
    {
      id: 'shipping-delivery',
      title: '4. Shipping & Delivery',
      content: 'Delivery timelines are estimates provided in good faith. Bhai is not liable for customs delays, severe weather disruptions, or force majeure events. All shipments are comprehensively insured until delivered and signed for.',
    },
    {
      id: 'returns-cancellations',
      title: '5. Returns, Exchanges & Warranty',
      content: 'We offer a 30-day return policy on unworn, pristine items with security tags attached. Custom engraved, personalized, or pierced earrings (unless unopened for hygiene reasons) are non-returnable. All pieces carry our 2-Year Craftsmanship Warranty covering structural defects.',
    },
    {
      id: 'intellectual-property',
      title: '6. Intellectual Property',
      content: 'All jewellery designs, CAD models, photography, brand trademarks, logos, and textual content are the exclusive intellectual property of Bhai Luxury Jewellery and protected by international copyright laws. Unauthorized reproduction or resale is strictly prohibited.',
    },
    {
      id: 'governing-law',
      title: '7. Governing Law & Jurisdiction',
      content: 'These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the English courts.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#f4efe6] flex flex-col selection:bg-[#c5a880] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 md:py-24 w-full">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#c5a880]">Legal & Governance</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-[#f4efe6]">
            Terms & Conditions
          </h1>
          <p className="text-xs text-neutral-400 font-light">
            Last Updated: January 2026 • Version 4.2
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {sections.map((sec) => (
            <section key={sec.id} className="p-6 md:p-8 rounded-2xl bg-[#141419]/70 border border-neutral-800/80 space-y-3">
              <h2 className="font-serif text-lg md:text-xl text-[#c5a880] font-normal">{sec.title}</h2>
              <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
                {sec.content}
              </p>
            </section>
          ))}
        </div>

        {/* Contact info box */}
        <div className="mt-14 p-6 rounded-2xl bg-[#141419]/40 border border-neutral-800/60 text-center space-y-3">
          <h3 className="font-serif text-base text-neutral-200">Questions Regarding Terms?</h3>
          <p className="text-xs text-neutral-400 font-light max-w-md mx-auto">
            Our legal compliance team is available to assist you with any questions regarding our commercial terms.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-2 text-xs text-[#c5a880] uppercase tracking-widest hover:underline"
          >
            Contact Legal Desk →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
