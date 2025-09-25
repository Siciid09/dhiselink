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
    return { error: "You must be logged in." };
  }

  // NOTE: File uploads (like resume_url) must be handled separately on the client
  // before this action is called. This action saves the final URL.

  const skills = formData.get("skills") as string;

  const dataToUpdate = {
    // Tab 1
    full_name: formData.get("full_name") as string,
    professional_title: formData.get("professional_title") as string,
    location: formData.get("location") as string,
    experience_level: formData.get("experience_level") as string,
    // Tab 2
    bio: formData.get("bio") as string,
    industry: formData.get("industry") as string,
    years_of_experience: Number(formData.get("years_of_experience")),
    skills: skills ? skills.split(',').map(s => s.trim()) : [],
    // Tab 3
    degree: formData.get("degree") as string,
    field_of_study: formData.get("field_of_study") as string,
    certifications: (formData.get("certifications") as string)?.split(',').map(c => c.trim()),
    // We assume resume_url is handled on the client and the URL is passed
    // resume_url: formData.get("resume_url") as string, 
    onboarding_complete: true
  };

  // Basic validation for required fields
  const requiredFields = [dataToUpdate.full_name, dataToUpdate.professional_title, dataToUpdate.location, dataToUpdate.experience_level, dataToUpdate.bio, dataToUpdate.industry, dataToUpdate.years_of_experience, dataToUpdate.degree];
  if (requiredFields.some(f => !f)) {
    return { error: "Please ensure all required fields are filled out." };
  }

  const { error } = await supabase
    .from("profiles")
    .update(dataToUpdate)
    .eq("id", user.id);

  if (error) {
    return { error: `Database Error: ${error.message}` };
  }
  
  revalidatePath("/dashboard");
  redirect("/dashboard");
}