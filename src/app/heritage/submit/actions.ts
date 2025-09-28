"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface ActionState { error: string | null; }

export async function submitHeritageSite(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in to submit a site." };
    }

    const siteData = {
        title: formData.get('title') as string,
        category: formData.get('category') as string,
        location: formData.get('location') as string,
        summary: formData.get('summary') as string,
        description: formData.get('description') as string,
        cover_image_url: formData.get('cover_image_url') as string,
        gallery_images: JSON.parse(formData.get('gallery_images') as string || '[]'),
        author_id: user.id,
    };

    if (!siteData.title || !siteData.category || !siteData.location || !siteData.summary || !siteData.cover_image_url) {
        return { error: "Please fill out all required fields." };
    }

    const { data: newSite, error } = await supabase
        .from('heritage_sites')
        .insert(siteData)
        .select('id')
        .single();
    
    if (error) {
        return { error: `Database Error: ${error.message}` };
    }

    revalidatePath('/heritage');
    redirect(`/heritage/${newSite.id}`);
}