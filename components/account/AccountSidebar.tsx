"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MapPin, 
  User, 
  ShieldCheck, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Award
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth-actions";

interface AccountSidebarProps {
  userEmail?: string;
  userName?: string;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Security & Settings", href: "/account/settings", icon: ShieldCheck },
];

export default function AccountSidebar({
  userEmail = "client@bhaijewellery.com",
  userName = "Valued Client",
}: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    await signOutAction();
    router.push("/");
    router.refresh();
  };

  const currentItem = NAV_ITEMS.find((item) => item.href === pathname) || NAV_ITEMS[0];

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "B";

  return (
    <aside className="w-full">
      
      {/* 1. Mobile Quick Nav Dropdown Pill */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="w-full p-4 bg-white border border-neutral-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <currentItem.icon className="w-4 h-4 text-[#997b24]" />
            <span>Menu: {currentItem.label}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform ${
              isMobileNavOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isMobileNavOpen && (
          <div className="mt-1 bg-white border border-neutral-200 divide-y divide-neutral-100 shadow-lg animate-in fade-in duration-200">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`p-3.5 flex items-center gap-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-black"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#d4af37]" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full p-3.5 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Desktop Luxury Sidebar Card */}
      <div className="hidden lg:block bg-white border border-neutral-200 shadow-xs overflow-hidden sticky top-28">
        
        {/* User Profile Header */}
        <div className="p-6 bg-neutral-950 text-white text-center border-b border-neutral-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-neutral-950 font-bold font-mono text-lg flex items-center justify-center mx-auto border-2 border-[#d4af37]">
            {initials}
          </div>
          <div>
            <h2 className="font-bold text-sm uppercase tracking-wider truncate">
              {userName}
            </h2>
            <p className="text-[11px] text-neutral-400 font-light truncate mt-0.5">
              {userEmail}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-[#d4af37] text-[10px] font-extrabold uppercase tracking-widest border border-[#d4af37]/30">
            <Award className="w-3 h-3" />
            <span>VIP Gold Member</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#d4af37]" : "text-neutral-400"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="p-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

    </aside>
  );
}
