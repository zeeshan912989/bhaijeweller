"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MessageCircle, MapPin, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              We&apos;re Here To Assist
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Contact Our Concierge
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Have a question about an order, custom sizing, or styling advice? Our London advisory team is at your service.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Details (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-6">
                
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-[#997b24] mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-950">Email Support</h4>
                    <p className="text-xs text-neutral-600 font-light mt-0.5">concierge@bhaijeweller.com</p>
                    <p className="text-[11px] text-neutral-400 font-light">Response within 24 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle className="w-5 h-5 text-[#997b24] mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-950">Live WhatsApp</h4>
                    <p className="text-xs text-neutral-600 font-light mt-0.5">+44 (0) 20 7946 0912</p>
                    <p className="text-[11px] text-neutral-400 font-light">Mon - Fri: 9am - 6pm GMT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#997b24] mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-950">Flagship Studio</h4>
                    <p className="text-xs text-neutral-600 font-light mt-0.5">Mayfair Atelier, London W1K, UK</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-[#997b24] mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-950">Opening Hours</h4>
                    <p className="text-xs text-neutral-600 font-light mt-0.5">Monday – Friday: 9:00am – 6:00pm</p>
                    <p className="text-xs text-neutral-600 font-light">Saturday: 10:00am – 4:00pm</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Form (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="border border-neutral-200 p-6 sm:p-8 rounded-2xl bg-white shadow-xs">
                <h3 
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                  className="text-xl font-bold text-neutral-950 mb-4"
                >
                  Send a Direct Message
                </h3>

                {submitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-2 animate-in fade-in">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p className="font-bold text-sm text-emerald-900">Message Delivered Successfully</p>
                    <p className="text-xs text-emerald-700">Thank you, {name}! Our concierge advisor will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Charlotte Vance"
                          className="w-full p-3 bg-white border border-neutral-300 text-xs outline-none focus:border-black rounded-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full p-3 bg-white border border-neutral-300 text-xs outline-none focus:border-black rounded-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Inquiry Topic
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Ring sizing or order inquiry"
                        className="w-full p-3 bg-white border border-neutral-300 text-xs outline-none focus:border-black rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we assist you today?"
                        className="w-full p-3 bg-white border border-neutral-300 text-xs outline-none focus:border-black rounded-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer rounded-none"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
