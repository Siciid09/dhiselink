"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Define the shape of the state our action will return
interface ActionState {
  error: string | null;
}

export async function completeIndividualOnboarding(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to complete onboarding." };
  }

  // Extract all data from the form
  const fullName = formData.get("full_name") as string;
  const professionalTitle = formData.get("professional_title") as string;
  const bio = formData.get("bio") as string;
  const skills = formData.getAll("skills") as string[];
  const cv_url = formData.get("cv_url") as string;

  // --- THIS IS THE FIX ---
  // We now perform a single, powerful update on the 'profiles' table
  const { error } = await supabase
    .from("profiles")
    .update({ 
        full_name: fullName,
        professional_title: professionalTitle,
        bio: bio,
        skills: skills,
        resume_url: cv_url, // Make sure your column is named resume_url
        onboarding_complete: true // This is the most important step
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