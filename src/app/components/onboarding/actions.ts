"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
}

export async function completeIndividualOnboarding(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to complete onboarding." };
  }

  // Collect all the new, detailed data from the form
  const dataToUpdate = {
    full_name: formData.get("full_name") as string,
    professional_title: formData.get("professional_title") as string,
    location: formData.get("location") as string,
    bio: formData.get("bio") as string,
    skills: formData.getAll("skills") as string[], // .getAll() is used for multiple fields with the same name
    website_url: formData.get("website_url") as string,
    linkedin_url: formData.get("linkedin_url") as string,
    github_url: formData.get("github_url") as string,
    onboarding_complete: true // Mark onboarding as complete
  };

  if (!dataToUpdate.full_name || !dataToUpdate.professional_title) {
    return { error: "Full Name and Professional Title are required." };
  }

  const { error } = await supabase
    .from("profiles")
    .update(dataToUpdate)
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error);
    return { error: `Database Error: ${error.message}` };
  }
  
  revalidatePath("/dashboard");
  redirect("/dashboard");
}