"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Check, ShieldCheck } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: string;
}

export default function CookieConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    functional: true,
    marketing: true,
  });

  useEffect(() => {
    // Check if consent has already been saved
    try {
      const saved = localStorage.getItem("bhai_cookie_consent");
      if (!saved) {
        // Delay slightly for smooth page entrance
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is disabled/restricted
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (prefs: typeof preferences) => {
    try {
      const payload: CookiePreferences = {
        ...prefs,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("bhai_cookie_consent", JSON.stringify(payload));
      // Also set real browser cookie
      document.cookie = `bhai_cookie_consent=true; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch (e) {
      console.error("Error saving cookie consent", e);
    }
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(allEnabled);
    saveConsent(allEnabled);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 z-[9999] flex items-end justify-center px-0 sm:px-4 pointer-events-none animate-in fade-in duration-300">
      {/* Modal Container - Wide & Square style */}
      <div className="w-full sm:max-w-2xl bg-white rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.18)] border sm:border border-neutral-900/20 p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto pointer-events-auto animate-in slide-in-from-bottom-6 duration-300 text-neutral-900">
        
        {/* Top Close Button */}
        <button
          onClick={handleRejectAll}
          aria-label="Close cookie banner"
          className="absolute right-4 sm:right-5 top-4 sm:top-5 p-1 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2]" />
        </button>

        {!showManage ? (
          /* 1. MAIN CONSENT BANNER (Wide & Square Box Layout) */
          <div className="space-y-4 pt-1">
            {/* Header Icon / Title */}
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-neutral-950" />
              <h3 className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-neutral-950">
                Cookie Preferences
              </h3>
            </div>

            {/* Paragraph 1 */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-700 font-normal">
              We use cookies and similar technologies on our website to provide the service you request, and to aim to offer you the best website experience possible. You can &ldquo;Reject All&rdquo;, &ldquo;Accept All&rdquo;, or set your cookie preference any time at your choice. By selecting &ldquo;Accept All&rdquo;, we will set all optional cookies, which help us analyse traffic, offer enhanced functionality, and personalize content and ads to complement your shopping experience with BHAI.
            </p>

            {/* Paragraph 2 */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-700 font-normal">
              By selecting &ldquo;Reject All&rdquo;, you allow the use of strictly necessary cookies that make our website work. You may disable these by changing your browser settings, but this may affect how the website functions. To learn more about the cookies we use and to adjust your optional cookie settings, please select &ldquo;Manage Cookies.&rdquo;
            </p>

            {/* Privacy Link */}
            <p className="text-xs sm:text-[13px] text-neutral-700">
              For more information about how we process the data we collect,{" "}
              <Link
                href="/privacy"
                className="text-[#1a4a9c] hover:text-black underline font-semibold"
              >
                Click here to see our Privacy Policy.
              </Link>
            </p>

            {/* Action Buttons (Square styling - 3 Clean Buttons) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {/* Reject All Button */}
              <button
                type="button"
                onClick={handleRejectAll}
                className="w-full py-3 bg-black text-white text-xs sm:text-[13px] font-bold tracking-wider uppercase rounded-none hover:bg-neutral-850 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
              >
                Reject All
              </button>

              {/* Accept All Button */}
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full py-3 bg-black text-white text-xs sm:text-[13px] font-bold tracking-wider uppercase rounded-none hover:bg-neutral-850 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
              >
                Accept All
              </button>

              {/* Manage Cookies Button */}
              <button
                type="button"
                onClick={() => setShowManage(true)}
                className="w-full py-3 bg-white border border-neutral-900 text-neutral-950 text-xs sm:text-[13px] font-bold tracking-wider uppercase rounded-none hover:bg-neutral-50 active:scale-[0.99] transition-all cursor-pointer"
              >
                Manage Cookies
              </button>
            </div>
          </div>
        ) : (
          /* 2. MANAGE COOKIES PREFERENCE PANEL */
          <div className="space-y-5 pt-1">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-950">
                Manage Cookie Preferences
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Customize your cookie preferences for browsing BHAI Jewellers.
              </p>
            </div>

            <div className="space-y-3 divide-y divide-neutral-100">
              {/* Strictly Necessary */}
              <div className="pt-3 flex items-start justify-between gap-3">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-900">
                      Strictly Necessary Cookies
                    </span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded-none font-semibold">
                      Always Active
                    </span>
                  </div>
                  <p className="text-[11.5px] text-neutral-600 mt-1 leading-normal">
                    Essential for secure login, cart functionality, and navigation.
                  </p>
                </div>
                <div className="w-9 h-5 bg-black rounded-none flex items-center justify-center opacity-80 cursor-not-allowed">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="pt-3 flex items-start justify-between gap-3">
                <div className="flex-1 pr-2">
                  <span className="text-xs font-bold text-neutral-900">
                    Analytics & Performance
                  </span>
                  <p className="text-[11.5px] text-neutral-600 mt-1 leading-normal">
                    Helps us understand how customers interact with our website to improve speed and design.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }))
                  }
                  className={`w-9 h-5 rounded-none flex items-center justify-center transition-colors cursor-pointer ${
                    preferences.analytics ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                  }`}
                >
                  {preferences.analytics ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3" />}
                </button>
              </div>

              {/* Functional Cookies */}
              <div className="pt-3 flex items-start justify-between gap-3">
                <div className="flex-1 pr-2">
                  <span className="text-xs font-bold text-neutral-900">
                    Functional & Personalization
                  </span>
                  <p className="text-[11.5px] text-neutral-600 mt-1 leading-normal">
                    Remembers your preferred currency, language, and custom filter settings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, functional: !prev.functional }))
                  }
                  className={`w-9 h-5 rounded-none flex items-center justify-center transition-colors cursor-pointer ${
                    preferences.functional ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                  }`}
                >
                  {preferences.functional ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3" />}
                </button>
              </div>

              {/* Marketing & Ads */}
              <div className="pt-3 flex items-start justify-between gap-3">
                <div className="flex-1 pr-2">
                  <span className="text-xs font-bold text-neutral-900">
                    Marketing & Advertising
                  </span>
                  <p className="text-[11.5px] text-neutral-600 mt-1 leading-normal">
                    Enables tailored jewellery recommendations and discount offers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }))
                  }
                  className={`w-9 h-5 rounded-none flex items-center justify-center transition-colors cursor-pointer ${
                    preferences.marketing ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                  }`}
                >
                  {preferences.marketing ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Save & Back Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowManage(false)}
                className="flex-1 py-2.5 bg-neutral-100 text-neutral-900 text-xs font-bold uppercase rounded-none hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2.5 bg-black text-white text-xs font-bold uppercase rounded-none hover:bg-neutral-850 transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
