"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ActionState { error: string | null; }

const stringToArray = (str: string | null) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];

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
        tags: stringToArray(tags),
        visibility: formData.get('visibility') as string,
        author_id: user.id,
    };

    if (!ideaData.title || !ideaData.details) {
        return { error: "Title and Details are required." };
    }

    const { data: newIdea, error } = await supabase.from('ideas').insert(ideaData).select('id').single();
    if (error) return { error: `Database Error: ${error.message}` };

    revalidatePath('/ideas');
    redirect(`/ideas/${newIdea.id}`);
}

export async function updateIdea(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in to update an idea." };

    const ideaId = formData.get('id') as string;
    if (!ideaId) return { error: "Idea ID is missing." };

    const tags = formData.get('tags') as string;
    const ideaData = {
        title: formData.get('title') as string,
        category: formData.get('category') as string,
        details: formData.get('details') as string,
        cover_image_url: formData.get('cover_image_url') as string,
        tags: stringToArray(tags),
        visibility: formData.get('visibility') as string,
    };
    
    const { error } = await supabase.from('ideas').update(ideaData).eq('id', ideaId).eq('author_id', user.id);
    if (error) return { error: `Database Error: ${error.message}` };

    revalidatePath('/ideas');
    revalidatePath(`/ideas/${ideaId}`);
    redirect(`/ideas/${ideaId}`);
}