"use server";

import { createClient as createServerClient } from '@/lib/supabase/server'; // <-- CORRECTED IMPORT
import { revalidatePath } from "next/cache";
import { createClient } from '@supabase/supabase-js';

// Admin client for elevated privileges (like deleting auth users) - THIS IS CORRECT
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This is the corrected client for standard actions. It now matches the rest of your app.
const supabase = createServerClient(); // <-- CORRECTED INITIALIZATION

// --- GENERAL HELPER ---
async function handleSupabaseError(error: any, successMessage: string) {
  if (error) {
    console.error("Supabase Action Error:", error.message);
    return { success: false, message: error.message };
  }
  revalidatePath("/admin");
  return { success: true, message: successMessage };
}

// --- USER ACTIONS ---
export async function banUserAction(userId: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ is_banned: true })
    .eq("id", userId);
  return handleSupabaseError(error, "User banned successfully.");
}

export async function deleteUserAction(userId: string) {
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) {
    console.error("Error deleting auth user:", authError.message);
  }
  const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);
  return handleSupabaseError(profileError, "User deleted successfully.");
}


// --- JOBS ACTIONS ---
export async function approveJobAction(jobId: string) {
  const { error } = await supabase.from("jobs").update({ status: 'active' }).eq("id", jobId);
  return handleSupabaseError(error, "Job approved successfully.");
}
export async function rejectJobAction(jobId: string) {
  const { error } = await supabase.from("jobs").update({ status: 'closed' }).eq("id", jobId);
  return handleSupabaseError(error, "Job rejected successfully.");
}
export async function deleteJobAction(jobId: string) {
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  return handleSupabaseError(error, "Job deleted successfully.");
}

// --- IDEAS ACTIONS ---
export async function approveIdeaAction(ideaId: string) {
  const { error } = await supabase.from("ideas").update({ status: 'approved' }).eq("id", ideaId);
  return handleSupabaseError(error, "Idea approved successfully.");
}
export async function rejectIdeaAction(ideaId: string) {
  const { error } = await supabase.from("ideas").update({ status: 'rejected' }).eq("id", ideaId);
  return handleSupabaseError(error, "Idea rejected successfully.");
}
export async function deleteIdeaAction(ideaId: string) {
  const { error } = await supabase.from("ideas").delete().eq("id", ideaId);
  return handleSupabaseError(error, "Idea deleted successfully.");
}

// --- HERITAGE SITES ACTIONS ---
export async function approveSiteAction(siteId: string) {
  const { error } = await supabase.from("heritage_sites").update({ status: 'approved' }).eq("id", siteId);
  return handleSupabaseError(error, "Site approved successfully.");
}
export async function rejectSiteAction(siteId: string) {
  const { error } = await supabase.from("heritage_sites").update({ status: 'rejected' }).eq("id", siteId);
  return handleSupabaseError(error, "Site rejected successfully.");
}
export async function deleteSiteAction(siteId: string) {
  const { error } = await supabase.from("heritage_sites").delete().eq("id", siteId);
  return handleSupabaseError(error, "Site deleted successfully.");
}

// --- PARTNERS ACTIONS ---
export async function createPartnerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const logo_url = formData.get('logo_url') as string;
  if (!name) { return { success: false, message: "Partner name is required." }; }
  const { error } = await supabase.from("partners").insert({ name, logo_url });
  return handleSupabaseError(error, "Partner created successfully.");
}
export async function deletePartnerAction(partnerId: string) {
  const { error } = await supabase.from("partners").delete().eq("id", partnerId);
  return handleSupabaseError(error, "Partner deleted successfully.");
}

// --- TESTIMONIALS ACTIONS ---
export async function createTestimonialAction(formData: FormData) {
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const quote = formData.get('quote') as string;
  if (!name || !quote) { return { success: false, message: "Name and quote are required." }; }
  const { error } = await supabase.from("testimonials").insert({ name, role, quote });
  return handleSupabaseError(error, "Testimonial created successfully.");
}

export async function deleteTestimonialAction(testimonialId: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", testimonialId);
  return handleSupabaseError(error, "Testimonial deleted successfully.");
}

export async function toggleFeatureAction(testimonialId: string, isFeatured: boolean) {
  const { error } = await supabase.from("testimonials").update({ is_featured: isFeatured }).eq("id", testimonialId);
  return handleSupabaseError(error, `Testimonial feature status updated.`);
}
