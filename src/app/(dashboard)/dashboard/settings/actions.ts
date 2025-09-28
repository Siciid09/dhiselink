"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update your profile.", success: false };
    }
    
    try {
        const dataToUpdate: { [key:string]: any } = {};
        
        // Iterate over all form fields and build the update object
        for (const [key, value] of formData.entries()) {
            if (typeof value === 'string' && value === '') continue; // Skip empty fields
            
            // Handle specific data types
            if (['skills', 'tags', 'languages', 'operating_regions'].includes(key)) {
                dataToUpdate[key] = stringToArray(value as string);
            } else if (['work_experience', 'education', 'certifications', 'awards'].includes(key)) {
                dataToUpdate[key] = parseJsonSafe(value as string);
            } else if (['year_founded', 'years_of_experience'].includes(key)) {
                dataToUpdate[key] = Number(value);
            }
             else {
                dataToUpdate[key] = value;
            }
        }

        const { error } = await supabase
            .from('profiles')
            .update(dataToUpdate)
            .eq('id', user.id);
            
        if (error) throw error;

        // Revalidate paths to show updated info immediately
        revalidatePath("/dashboard/settings");
        if (dataToUpdate.slug) {
            const path = dataToUpdate.role === 'individual' ? `/professionals/${dataToUpdate.slug}` : `/organizations/${dataToUpdate.slug}`;
            revalidatePath(path);
        }
        
        return { error: null, success: true };

    } catch (error: any) {
        return { error: `Update failed: ${error.message}`, success: false };
    }
}