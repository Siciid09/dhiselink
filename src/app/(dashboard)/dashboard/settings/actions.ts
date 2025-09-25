"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
  success: boolean;
}

const parseJsonSafe = (jsonString: string | null) => {
    if (!jsonString) return [];
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
};

const stringToArray = (str: string | null) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in.", success: false };

    try {
        const dataToUpdate: { [key:string]: any } = {};
        const getField = (key: string) => formData.get(key) as string | null;

        // Collect all single-value fields from the form
        const allFields = [
            'full_name', 'professional_title', 'location', 'experience_level', 'bio', 'industry', 
            'years_of_experience', 'phone', 'website_url', 'linkedin_url', 'github_url', 'avatar_url', 'resume_url',
            'organization_name', 'year_founded', 'employee_count', 'accreditation', 
            'community_focus', 'email', 'services', 'vision', 'operating_regions', 'social_media_links',
            'logo_url', 'cover_image_url'
        ];
        allFields.forEach(field => {
            if (formData.has(field)) dataToUpdate[field] = getField(field);
        });
        
        // Handle array fields from comma-separated strings
        if (formData.has('skills')) dataToUpdate.skills = stringToArray(getField('skills'));

        // Handle JSON fields for dynamic entries
        if (formData.has('work_experience')) dataToUpdate.work_experience = parseJsonSafe(getField('work_experience'));
        if (formData.has('education')) dataToUpdate.education = parseJsonSafe(getField('education'));
        if (formData.has('certifications')) dataToUpdate.certifications = parseJsonSafe(getField('certifications'));
        
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update(dataToUpdate)
            .eq('id', user.id);
            
        if (profileUpdateError) throw profileUpdateError;

        revalidatePath("/dashboard/settings");
        revalidatePath(`/professionals/${user.id}`);

        return { error: null, success: true };

    } catch (error: any) {
        return { error: `Update failed: ${error.message}`, success: false };
    }
}