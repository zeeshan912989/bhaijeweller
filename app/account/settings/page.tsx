import React from "react";
import AccountSecurity from "@/components/account/AccountSecurity";

export const metadata = {
  title: "Account Security & Settings | BHAI Fine Jewellery",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <AccountSecurity />
    </div>
  );
}
