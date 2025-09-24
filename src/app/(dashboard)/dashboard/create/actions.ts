"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
  success: boolean;
}

function getTableName(opportunityType: string): string {
    switch (opportunityType) {
        case 'Job': return 'jobs';
        case 'Program': return 'programs';
        case 'Service': return 'services';
        case 'Idea': return 'ideas';
        case 'Project':
        case 'Tender':
        case 'Announcement':
        case 'Event':
        case 'Grant':
            return 'initiatives';
        default:
            return '';
    }
}

// Helper function to process array-like fields
function processArrayFields(key: string, value: FormDataEntryValue): string[] {
    // --- FIX 2: Split by newline instead of comma ---
    return (value as string).split('\n').map(item => item.trim()).filter(Boolean);
}

export async function createOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in.", success: false };
    }

    const opportunityType = formData.get("opportunity_type") as string;
    const tableName = getTableName(opportunityType);

    if (!tableName) {
        return { error: `Invalid opportunity type: ${opportunityType}`, success: false };
    }

    const dataToInsert: { [key: string]: any } = {
        organization_id: user.id,
    };
    
    // For 'ideas', the author is an individual user
    if (tableName === 'ideas') {
        dataToInsert.author_id = user.id;
        delete dataToInsert.organization_id; // remove org id for ideas
    }

    const arrayFieldNames = ['requirements', 'skills', 'eligibility', 'tags'];

    formData.forEach((value, key) => {
        if (!key.startsWith('$')) { 
            // --- FIX 1: Check against a list of array fields, including 'eligibility' ---
            if (arrayFieldNames.includes(key)) {
                dataToInsert[key] = processArrayFields(key, value);
            } else if (key !== 'opportunity_type') {
                dataToInsert[key] = (key === 'deadline' || key === 'end_date') && value === '' ? null : value;
            }
        }
    });
    
    if (tableName === 'initiatives') {
        dataToInsert['type'] = opportunityType;
    }

    try {
        const { error } = await supabase.from(tableName).insert(dataToInsert);
        if (error) throw error;
    } catch (e: any) {
        return { error: `Database Error: ${e.message}`, success: false };
    }

    revalidatePath("/dashboard/manage");
    revalidatePath("/opportunities"); // Also revalidate ideas page if it exists
    redirect(`/dashboard/manage?message=Successfully created ${opportunityType}!`);
}

export async function updateOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in.", success: false };
    }

    const opportunityType = formData.get("opportunity_type") as string;
    const id = formData.get("id") as string;
    const tableName = getTableName(opportunityType);

    if (!tableName || !id) {
        return { error: "Invalid data for update.", success: false };
    }

    const dataToUpdate: { [key: string]: any } = {};
    const arrayFieldNames = ['requirements', 'skills', 'eligibility', 'tags'];
    
    formData.forEach((value, key) => {
        if (!key.startsWith('$') && key !== 'id' && key !== 'opportunity_type') {
            if (arrayFieldNames.includes(key)) {
                dataToUpdate[key] = processArrayFields(key, value);
            } else {
                dataToUpdate[key] = (key === 'deadline' || key === 'end_date') && value === '' ? null : value;
            }
        }
    });

    try {
        const { error } = await supabase
            .from(tableName)
            .update(dataToUpdate)
            .eq('id', id)
            .eq(tableName === 'ideas' ? 'author_id' : 'organization_id', user.id); // Security check
        if (error) throw error;
    } catch (e: any) {
        return { error: `Database Error: ${e.message}`, success: false };
    }

    revalidatePath("/dashboard/manage");
    revalidatePath(`/opportunities/${id}`); // And idea detail page
    redirect(`/dashboard/manage?message=Successfully updated ${opportunityType}!`);
}

// (Delete function remains unchanged, it works as is)
export async function deleteOpportunity(formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return; }

    const id = formData.get('id') as string;
    const type = formData.get('type') as string;
    const tableName = getTableName(type.charAt(0).toUpperCase() + type.slice(1));
    if (!tableName || !id) {
        redirect(`/dashboard/manage?error=Invalid data for deletion.`);
        return;
    }
    await supabase.from(tableName).delete().eq('id', id).eq(tableName === 'ideas' ? 'author_id' : 'organization_id', user.id);
    revalidatePath('/dashboard/manage');
    redirect(`/dashboard/manage?message=Item successfully deleted.`);
}
