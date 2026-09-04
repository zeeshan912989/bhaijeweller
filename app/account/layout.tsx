import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import { getUserProfile } from "@/lib/auth/auth-service";

export const metadata = {
  title: "My Account | BHAI Luxury Fine Jewellery",
  description: "Manage your BHAI account, orders, addresses, and bespoke preferences.",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-neutral-900">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-6">
            
            {/* Sidebar Column (4 Columns on Desktop) */}
            <div className="lg:col-span-4">
              <AccountSidebar
                userEmail={profile?.email}
                userName={profile?.fullName}
              />
            </div>

            {/* Account Main Content (8 Columns on Desktop) */}
            <div className="lg:col-span-8">
              {children}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
