// File: app/settings/actions.ts

"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
  success: boolean;
}

// Helper function to convert comma-separated strings into a text array
const stringToArray = (str: string | null) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];

// Helper function to safely parse JSON strings from the form
const parseJsonSafe = (jsonString: string | null) => {
    if (!jsonString) return [];
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        throw new Error("Invalid JSON format for dynamic entries.");
    }
};

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in.", success: false };

    const role = formData.get("role") as string;

    try {
        // --- 1. UPDATE THE MAIN 'profiles' TABLE DATA ---
        let profileData: { [key: string]: any } = {};
        
        // List of all possible text-based fields
        const profileFields = [
            'full_name', 'professional_title', 'bio', 'location', 'email', 'phone', 'website_url',
            'linkedin_url', 'github_url', 'avatar_url', 'cover_image_url', 'organization_name',
            'tagline', 'industry', 'contact_email', 'phone_number', 'mission_statement', 
            'employee_count'
        ];
        
        profileFields.forEach(field => {
            if (formData.has(field)) {
                profileData[field] = formData.get(field);
            }
        });
        
        // List of fields that should be stored as arrays
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
        revalidatePath(`/professionals/${user.id}`);
        if (role === 'company') revalidatePath('/companies');

        return { error: null, success: true };

    } catch (error: any) {
        console.error("Update Profile Error:", error);
        return { error: `Update failed: ${error.message}`, success: false };
    }
}