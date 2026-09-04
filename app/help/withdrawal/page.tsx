"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function WithdrawalPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Statutory Consumer Rights
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              EU Right of Withdrawal
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Information regarding the right of withdrawal for consumers residing within the European Union.
            </p>
          </div>
        </section>

        {/* Legal Text Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 space-y-8 text-xs sm:text-[13.5px] text-neutral-700 font-light leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              1. Right of Withdrawal
            </h2>
            <p>
              Under European Union consumer protection regulations, you have the statutory right to withdraw from your contract with Bhai Fine Jewellery within 14 days without giving any reason.
            </p>
            <p>
              The withdrawal period will expire after 14 days from the day on which you acquire, or a third party indicated by you acquires, physical possession of the goods.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              2. Exercising Your Right
            </h2>
            <p>
              To exercise your right of withdrawal, you must inform us of your decision to withdraw from this contract by an unequivocal statement (e.g. by email to <strong className="text-neutral-900">concierge@bhaijeweller.com</strong>).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              3. Effects of Withdrawal &amp; Reimbursement
            </h2>
            <p>
              If you withdraw from this contract, we shall reimburse all payments received from you, including standard delivery costs, without undue delay and not later than 14 days from the day on which we are informed about your decision to withdraw.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              4. Exceptions
            </h2>
            <p>
              The right of withdrawal does not apply to goods made to the consumer&apos;s specifications, clearly personalized/engraved pieces, or sealed goods which are not suitable for return due to hygiene reasons (such as pierced earrings) once unsealed after delivery.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
