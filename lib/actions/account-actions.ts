"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  profileSchema,
  addressSchema,
  changePasswordSchema,
} from "@/lib/validations/auth";
import { checkAuthRateLimit } from "@/lib/auth/auth-security";

export interface AccountActionResult {
  success: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Server-side User Session Resolver
 * NEVER TRUSTS CLIENT DATA FOR USER IDENTIFICATION
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Update Profile Action
 */
export async function updateProfileAction(
  prevState: AccountActionResult | null,
  formData: FormData
): Promise<AccountActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized session. Please log in." };
  }

  const rawData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone") || undefined,
  };

  const parsed = profileSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid profile data",
      fieldErrors: parsed.error.issues.reduce((acc, issue) => {
        acc[issue.path[0] as string] = issue.message;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error.message);
    return { success: false, error: "Failed to update profile." };
  }

  revalidatePath("/account");
  revalidatePath("/account/profile");

  return { success: true, message: "Profile updated successfully." };
}

/**
 * Add Address Action
 */
export async function addAddressAction(
  prevState: AccountActionResult | null,
  formData: FormData
): Promise<AccountActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized session." };
  }

  const rawData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "United Kingdom",
    isDefault: formData.get("isDefault") === "true" || formData.get("isDefault") === "on",
  };

  const parsed = addressSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid address data",
      fieldErrors: parsed.error.issues.reduce((acc, issue) => {
        acc[issue.path[0] as string] = issue.message;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  const supabase = await createClient();

  // If default is selected, reset existing default addresses for this user
  if (parsed.data.isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    address_line1: parsed.data.addressLine1,
    address_line2: parsed.data.addressLine2 || null,
    city: parsed.data.city,
    state: parsed.data.state,
    postal_code: parsed.data.postalCode,
    country: parsed.data.country,
    is_default: parsed.data.isDefault,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Address insert error:", error.message);
    return { success: false, error: "Failed to save address." };
  }

  revalidatePath("/account/addresses");
  return { success: true, message: "New address saved." };
}

/**
 * Update Address Action
 */
export async function updateAddressAction(
  addressId: string,
  prevState: AccountActionResult | null,
  formData: FormData
): Promise<AccountActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized session." };
  }

  const rawData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "United Kingdom",
    isDefault: formData.get("isDefault") === "true" || formData.get("isDefault") === "on",
  };

  const parsed = addressSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid address data",
    };
  }

  const supabase = await createClient();

  if (parsed.data.isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      address_line1: parsed.data.addressLine1,
      address_line2: parsed.data.addressLine2 || null,
      city: parsed.data.city,
      state: parsed.data.state,
      postal_code: parsed.data.postalCode,
      country: parsed.data.country,
      is_default: parsed.data.isDefault,
      updated_at: new Date().toISOString(),
    })
    .eq("id", addressId)
    .eq("user_id", user.id); // Strict ownership verification

  if (error) {
    return { success: false, error: "Failed to update address." };
  }

  revalidatePath("/account/addresses");
  return { success: true, message: "Address updated successfully." };
}

/**
 * Delete Address Action (IDOR Protected)
 */
export async function deleteAddressAction(addressId: string): Promise<AccountActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized session." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id); // IDOR protection

  if (error) {
    return { success: false, error: "Unable to delete address." };
  }

  revalidatePath("/account/addresses");
  return { success: true, message: "Address removed." };
}

/**
 * Set Default Address Action (IDOR Protected)
 */
export async function setDefaultAddressAction(addressId: string): Promise<AccountActionResult> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: "Unauthorized session." };
  }

  const supabase = await createClient();

  // Reset existing defaults
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);

  // Set new default with ownership check
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Unable to set default address." };
  }

  revalidatePath("/account/addresses");
  return { success: true, message: "Default address updated." };
}

/**
 * Change Password Action (Requires Current Password Verification)
 */
export async function changePasswordAction(
  prevState: AccountActionResult | null,
  formData: FormData
): Promise<AccountActionResult> {
  const user = await getAuthenticatedUser();
  if (!user || !user.email) {
    return { success: false, error: "Unauthorized session. Please log in." };
  }

  const rawData = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  };

  const parsed = changePasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid password data",
      fieldErrors: parsed.error.issues.reduce((acc, issue) => {
        acc[issue.path[0] as string] = issue.message;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  const supabase = await createClient();

  // 1. Verify current password by signing in with current credentials
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (verifyError) {
    return {
      success: false,
      error: "Your current password is incorrect.",
    };
  }

  // 2. Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (updateError) {
    return {
      success: false,
      error: "Failed to update password. Please try again.",
    };
  }

  return {
    success: true,
    message: "Password updated successfully.",
  };
}
