import React from "react";
import ProfileForm from "@/components/account/ProfileForm";
import { getUserProfile } from "@/lib/auth/auth-service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile Details | BHAI Fine Jewellery",
};

export default async function ProfilePage() {
  const profile = await getUserProfile();
  if (!profile) {
    redirect("/auth?redirect=/account/profile");
  }

  return (
    <div className="space-y-6">
      <ProfileForm initialProfile={profile} />
    </div>
  );
}
