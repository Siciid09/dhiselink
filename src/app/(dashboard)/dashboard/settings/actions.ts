"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
  success: boolean;
}

// Helper function to convert comma-separated string to array
const stringToArray = (str: string | null) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim()).filter(Boolean);
};

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in.", success: false };
  }

  const role = formData.get("role") as string;
  let updateData: { [key: string]: any } = {};

  // Gather data based on the user's role
  switch (role) {
    case 'individual':
      updateData = {
        full_name: formData.get("full_name"),
        professional_title: formData.get("professional_title"),
        bio: formData.get("bio"),
        location: formData.get("location"),
        website_url: formData.get("website_url"),
        linkedin_url: formData.get("linkedin_url"),
        github_url: formData.get("github_url"),
        skills: stringToArray(formData.get("skills") as string),
        languages: stringToArray(formData.get("languages") as string),
        certifications: stringToArray(formData.get("certifications") as string),
      };
      break;
    
    // We can group all organization types as they share many fields
    case 'company':
    case 'university':
    case 'ngo_gov':
    case 'other':
      updateData = {
        organization_name: formData.get("organization_name"),
        industry: formData.get("industry"),
        bio: formData.get("bio"),
        location: formData.get("location"),
        website_url: formData.get("website_url"),
        logo_url: formData.get("logo_url"),
        banner_url: formData.get("banner_url"),
        // Add more specific fields here if needed in the future
      };
      break;

    default:
      return { error: "Invalid user role.", success: false };
  }

  // Update the user's row in the 'profiles' table
  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error);
    return { error: `Database Error: ${error.message}`, success: false };
  }
  
  revalidatePath("/dashboard/settings"); // Revalidate the settings page itself
  return { error: null, success: true };
}