"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ActionState { error: string | null; }

export async function submitIdea(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in to submit an idea." };

    const tags = formData.get('tags') as string;

    const ideaData = {
        title: formData.get('title') as string,
        category: formData.get('category') as string,
        details: formData.get('details') as string,
        cover_image_url: formData.get('cover_image_url') as string,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        visibility: formData.get('visibility') as string,
        author_id: user.id,
    };

    if (!ideaData.title || !ideaData.details) {
        return { error: "Title and Details are required." };
    }

    const { data: newIdea, error } = await supabase
        .from('ideas')
        .insert(ideaData)
        .select('id')
        .single();
    
    if (error) {
        return { error: `Database Error: ${error.message}` };
    }

    revalidatePath('/ideas');
    redirect(`/ideas/${newIdea.id}`);
}