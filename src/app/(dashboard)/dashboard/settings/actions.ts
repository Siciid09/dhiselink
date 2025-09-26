"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- NEW: Helper function to generate a URL-friendly slug ---
const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
};


interface ActionState {
  error: string | null;
  success: boolean;
}

const parseJsonSafe = (jsonString: string | null) => {
    if (!jsonString) return [];
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
    } catch (e) {
        console.error("Failed to parse JSON string:", e);
        return [];
    }
};

const stringToArray = (str: string | null) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];
const multilineStringToArray = (str: string | null) => str ? str.split('\n').map(item => item.trim()).filter(Boolean) : [];

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in to update your profile.", success: false };

    try {
        const dataToUpdate: { [key:string]: any } = {};
        const getField = (key: string) => formData.get(key) as string | null;
        
        // Fetch the current profile to check if a slug already exists
        const { data: currentProfile } = await supabase.from('profiles').select('slug').eq('id', user.id).single();

        // --- SLUG GENERATION LOGIC ---
        // Only generate a slug if one doesn't already exist.
        if (!currentProfile?.slug) {
            const nameForSlug = getField('organization_name') || getField('full_name');
            if (nameForSlug) {
                // We'll add a short random string to reduce the chance of duplicates
                const randomSuffix = Math.random().toString(36).substring(2, 6);
                dataToUpdate.slug = `${generateSlug(nameForSlug)}-${randomSuffix}`;
            }
        }
        
        const singleValueFields = [
            'full_name', 'professional_title', 'location', 'experience_level', 'bio', 'industry', 
            'years_of_experience', 'phone', 'website_url', 'linkedin_url', 'github_url', 'portfolio_url', 
            'avatar_url', 'resume_url', 'organization_name', 'tagline', 'year_founded', 'organization_subtype',
            'employee_count', 'accreditation', 'community_focus', 'email', 'mission_vision',
            'logo_url', 'cover_image_url', 'members_count', 'announcements', 'featured'
        ];
        singleValueFields.forEach(field => {
            if (formData.has(field)) {
                dataToUpdate[field] = getField(field) || null;
            }
        });
        
        const arrayFields = { 'skills': stringToArray, 'languages': stringToArray, 'tags': stringToArray, 'operating_regions': stringToArray, 'key_services': stringToArray, 'products_offerings': stringToArray, 'faculties': stringToArray, 'departments': stringToArray, 'programs': stringToArray, 'research_projects': stringToArray, 'public_services': stringToArray };
        for (const [field, parser] of Object.entries(arrayFields)) {
            if (formData.has(field)) dataToUpdate[field] = parser(getField(field));
        }

        if (formData.has('social_links')) {
            dataToUpdate.social_links = multilineStringToArray(getField('social_links'));
        }

        const jsonFields = [ 'work_experience', 'education', 'certifications', 'awards', 'key_contacts', 'notable_alumni', 'projects' ];
        jsonFields.forEach(field => {
            if (formData.has(field)) dataToUpdate[field] = parseJsonSafe(getField(field));
        });
        
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update(dataToUpdate)
            .eq('id', user.id);
            
        if (profileUpdateError) throw profileUpdateError;

        revalidatePath("/dashboard/settings");
        if (dataToUpdate.slug) {
            revalidatePath(`/organizations/${dataToUpdate.slug}`);
        }

        return { error: null, success: true };

    } catch (error: any) {
        return { error: `Update failed: ${error.message}`, success: false };
    }
}

// ... your deleteAccount function remains the same ...
export async function deleteAccount(): Promise<void> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { throw new Error("User not authenticated."); }
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) { throw new Error(`Could not delete account: ${deleteError.message}`); }
    redirect('/');
}