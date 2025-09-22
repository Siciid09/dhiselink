"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Action to delete a job post
export async function deleteJobAction(jobId: string) {
  const supabase = createServerActionClient({ cookies });
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  return { success: true, message: "Job deleted successfully." };
}

// Action to "ban" a user (by updating their profile)
// Note: True banning involves more complex logic with Supabase Auth.
// This is a simple implementation that marks them in your public table.
export async function banUserAction(userId: string) {
  const supabase = createServerActionClient({ cookies });
  const { error } = await supabase
    .from("profiles")
    .update({ is_banned: true }) // Assumes you add an `is_banned` boolean column to your profiles table
    .eq("id", userId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  return { success: true, message: "User banned successfully." };
}