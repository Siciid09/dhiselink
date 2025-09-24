// File: app/settings/actions.ts

"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
  success: boolean;
}

const stringToArray = (str: string | null) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];
<<<<<<< HEAD
const parseJsonSafe = (jsonString: string | null) => {
    if (!jsonString) return [];
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        throw new Error("Invalid JSON format for dynamic entries.");
    }
};
=======
>>>>>>> 55fe139b3e819ae9c07bcabd58ac72a47b0d801d

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in.", success: false };

<<<<<<< HEAD
    const role = formData.get("role") as string;
=======
  if (!user) return { error: "You must be logged in.", success: false };
>>>>>>> 55fe139b3e819ae9c07bcabd58ac72a47b0d801d

    try {
        // --- 1. UPDATE THE MAIN 'profiles' TABLE DATA ---
        let profileData: { [key: string]: any } = {};
        const profileFields = [
            'full_name', 'professional_title', 'bio', 'location', 'email', 'phone', 'website_url',
            'linkedin_url', 'github_url', 'avatar_url', 'cover_image_url', 'organization_name',
            'tagline', 'industry', 'contact_email', 'phone_number', 'social_linkedin',
            'social_twitter', 'mission_statement', 'employee_count'
        ];
        
        profileFields.forEach(field => {
            if (formData.has(field)) {
                profileData[field] = formData.get(field);
            }
        });
        
        const arrayProfileFields = ['skills', 'languages', 'certifications', 'services'];
        arrayProfileFields.forEach(field => {
            if (formData.has(field)) {
                profileData[field] = stringToArray(formData.get(field) as string);
            }
        });
        
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id);
        if (profileUpdateError) throw profileUpdateError;

<<<<<<< HEAD

        // --- 2. UPDATE RELATED DYNAMIC DATA (Jobs, Programs, Initiatives) ---
        // We use 'upsert' to insert new items and update existing ones.
        if (formData.has('jobs')) {
            const jobs = parseJsonSafe(formData.get('jobs') as string);
            const { error: jobsError } = await supabase.from('jobs').upsert(
                jobs.map((job: any) => ({ ...job, organization_id: user.id }))
            );
            if (jobsError) throw jobsError;
        }

        if (formData.has('programs')) {
            const programs = parseJsonSafe(formData.get('programs') as string);
            const { error: programsError } = await supabase.from('programs').upsert(
                programs.map((prog: any) => ({ ...prog, organization_id: user.id }))
            );
            if (programsError) throw programsError;
        }

        if (formData.has('initiatives')) {
            const initiatives = parseJsonSafe(formData.get('initiatives') as string);
            const { error: initiativesError } = await supabase.from('initiatives').upsert(
                initiatives.map((init: any) => ({ ...init, organization_id: user.id }))
            );
            if (initiativesError) throw initiativesError;
        }

        // --- 3. REVALIDATE PATHS TO SHOW UPDATED DATA ---
        revalidatePath("/dashboard/settings");
        revalidatePath(`/organizations/${user.id}`);
        if (role === 'company') revalidatePath('/companies');

        return { error: null, success: true };

    } catch (error: any) {
        console.error("Update Profile Error:", error);
        return { error: `Update failed: ${error.message}`, success: false };
    }
}
=======
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
>>>>>>> 55fe139b3e819ae9c07bcabd58ac72a47b0d801d
