"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateUserRole(formData: FormData) {
  const role = formData.get("role");
  const supabase = createServerActionClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (user && role) {
    const { error } = await supabase
      .from("profiles")
      .update({ role: role as string })
      .eq("id", user.id);

    if (error) {
      return redirect(`/select-role?message=Database Error: ${error.message}`);
    }
    
    // --- THIS IS THE FIX ---
    // Explicitly refresh the session to ensure the user stays logged in
    // after the server action completes.
    await supabase.auth.refreshSession();
    
  } else {
    return redirect("/select-role?message=An error occurred.");
  }

  revalidatePath("/onboarding");
  redirect("/onboarding");
}