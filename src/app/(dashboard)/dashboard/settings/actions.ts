"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
  success: boolean;
}

const stringToArray = (str: string | null) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in.", success: false };

  const role = formData.get("role") as string;
  let updateData: { [key: string]: any } = {};

  if (role === 'individual') {
    updateData = {
      full_name: formData.get("full_name"),
      professional_title: formData.get("professional_title"),
      bio: formData.get("bio"),
      location: formData.get("location"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      skills: stringToArray(formData.get("skills") as string),
      languages: stringToArray(formData.get("languages") as string),
      website_url: formData.get("website_url"),
      linkedin_url: formData.get("linkedin_url"),
      github_url: formData.get("github_url"),
      avatar_url: formData.get("avatar_url"), // Fixed: Save avatar URL
      banner_url: formData.get("banner_url"), // Fixed: Save banner URL
      work_experience: JSON.parse(formData.get("work_experience") as string || '[]'),
      education: JSON.parse(formData.get("education") as string || '[]'),
    };
  } else { // For all organization types
    updateData = {
      organization_name: formData.get("organization_name"),
      industry: formData.get("industry"),
      bio: formData.get("bio"),
      location: formData.get("location"),
      website_url: formData.get("website_url"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      logo_url: formData.get("logo_url"), // Fixed: Save logo URL
      banner_url: formData.get("banner_url"),// Fixed: Save banner URL
    };
  }

  const { error } = await supabase.from("profiles").update(updateData).eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error);
    return { error: `Database Error: ${error.message}`, success: false };
  }
  
  revalidatePath("/dashboard/settings");
  revalidatePath(`/professionals/${user.id}`); // Revalidate public profile
  return { error: null, success: true };
}
