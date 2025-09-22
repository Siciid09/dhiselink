"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
}

export async function completeOrganizationOnboarding(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to complete onboarding." };
  }

  // Extract data from the form
  const organizationName = formData.get("organization_name") as string;
  const websiteUrl = formData.get("website_url") as string;
  const employeeCount = formData.get("employee_count") as string;

  if (!organizationName || !websiteUrl || !employeeCount) {
    return { error: "Please fill out all fields." };
  }
  
  // --- THIS IS THE FIX ---
  // We now perform a single update on the 'profiles' table,
  // just like we do for the individual user.
  const { error } = await supabase
    .from("profiles")
    .update({ 
        organization_name: organizationName,
        website_url: websiteUrl,
        employee_count: parseInt(employeeCount, 10),
        onboarding_complete: true // Mark onboarding as complete!
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error);
    return { error: `Database Error: ${error.message}` };
  }
  
  // On success, revalidate the dashboard path and redirect
  revalidatePath("/dashboard");
  redirect("/dashboard");
}