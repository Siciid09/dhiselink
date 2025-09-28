"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Helper function to generate a URL-friendly slug
const generateSlug = (text: string): string => {
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const slug = text
    .toString().toLowerCase().trim()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
  return `${slug}-${randomSuffix}`;
};

// Helper function to convert a comma-separated string to a clean array
const stringToArray = (str: string | null | undefined): string[] | null => {
    if (!str) return null;
    return str.split(',').map(item => item.trim()).filter(Boolean);
};

export async function completeOnboarding(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name') // We need full_name for the individual's slug
        .eq('id', user.id)
        .single();

    if (!profile) {
        return redirect('/login?message=Profile not found.');
    }
    
    const role = formData.get('role') as string;
    
    const dataToUpdate: { [key: string]: any } = {
        role: role,
        onboarding_complete: true
    };

    if (role === 'individual') {
        const professionalTitle = formData.get('professional_title') as string;
        const location = formData.get('location') as string;
        
        dataToUpdate.professional_title = professionalTitle;
        dataToUpdate.location = location;
        dataToUpdate.experience_level = formData.get('experience_level') as string;
        dataToUpdate.years_of_experience = Number(formData.get('years_of_experience'));
        dataToUpdate.skills = stringToArray(formData.get('skills') as string);
        dataToUpdate.bio = formData.get('bio') as string;
        
        // --- Generate slug for individuals ---
        if (profile.full_name) {
            dataToUpdate.slug = generateSlug(profile.full_name);
        }

        if (!professionalTitle || !location) {
            return redirect('/onboarding/complete-profile?error=Please fill out all required fields.');
        }

    } else if (role === 'organization') {
        const organizationName = formData.get('organization_name') as string;

        dataToUpdate.organization_type = formData.get('organization_type') as string;
        dataToUpdate.organization_name = organizationName;
        dataToUpdate.location = formData.get('location') as string;
        dataToUpdate.year_founded = Number(formData.get('year_founded'));
        dataToUpdate.employee_count = formData.get('employee_count') as string;
        dataToUpdate.website_url = formData.get('website_url') as string;
        dataToUpdate.industry = formData.get('industry') as string;
        dataToUpdate.bio = formData.get('bio') as string;

        // --- Generate slug for organizations ---
        if (organizationName) {
            dataToUpdate.slug = generateSlug(organizationName);
        }
        
        if (!dataToUpdate.organization_type || !organizationName) {
            return redirect('/onboarding/complete-profile?error=Please fill out all required fields.');
        }
    } else {
        return redirect('/onboarding/complete-profile?error=Please select a role.');
    }

    const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', user.id);

    if (error) {
        return redirect(`/onboarding/complete-profile?error=${error.message}`);
    }
    
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}