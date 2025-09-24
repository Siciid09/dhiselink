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
        case 'Project': case 'Event': case 'Grant': case 'Tender': case 'Announcement':
            return 'initiatives';
        default:
            return '';
    }
}

// --- THIS IS THE FIX ---
// This new, smarter function correctly handles all array-like fields.
function processArrayFields(key: string, value: FormDataEntryValue): string[] {
    const strValue = value as string;
    
    // If the input is empty, return a proper empty array that the database understands.
    if (!strValue) {
        return [];
    }
    
    // Attachments are a comma-separated list of URLs, others are newline-separated text.
    const separator = key === 'attachments' ? ',' : '\n';
    return strValue.split(separator).map(item => item.trim()).filter(Boolean);
}

export async function createOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "You must be logged in.", success: false };

    const opportunityType = formData.get("opportunity_type") as string;
    const tableName = getTableName(opportunityType);

    if (!tableName) return { error: `Invalid opportunity type: ${opportunityType}`, success: false };

    const dataToInsert: { [key: string]: any } = {};
    const arrayFieldNames = ['requirements', 'skills', 'eligibility', 'tags', 'attachments'];
    
    dataToInsert[tableName === 'ideas' ? 'author_id' : 'organization_id'] = user.id;

    for (const [key, value] of formData.entries()) {
        if (key.startsWith('$') || key === 'opportunity_type') continue;

        if (arrayFieldNames.includes(key)) {
            dataToInsert[key] = processArrayFields(key, value); // Use the new helper function
        } else if ((key === 'deadline' || key === 'end_date' || key === 'event_datetime') && value === '') {
            dataToInsert[key] = null;
        } else {
            dataToInsert[key] = value;
        }
    }
    
    if (tableName === 'initiatives') dataToInsert['type'] = opportunityType;

    try {
        const { error } = await supabase.from(tableName).insert(dataToInsert);
        if (error) throw error;
    } catch (e: any) {
        console.error("Database Insert Error:", e);
        return { error: `Database Error: ${e.message}`, success: false };
    }

    revalidatePath("/dashboard/manage");
    redirect(`/dashboard/manage?message=${opportunityType} created successfully!`);
}

// (Update and Delete functions are also updated to use the new robust helper)
export async function updateOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in.", success: false };

    const opportunityType = formData.get("opportunity_type") as string;
    const id = formData.get("id") as string;
    const tableName = getTableName(opportunityType);
    if (!tableName || !id) return { error: "Invalid data for update.", success: false };

    const dataToUpdate: { [key: string]: any } = {};
    const arrayFieldNames = ['requirements', 'skills', 'eligibility', 'tags', 'attachments'];
    
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('$') || key === 'id' || key === 'opportunity_type') continue;
        
        if (arrayFieldNames.includes(key)) {
            dataToUpdate[key] = processArrayFields(key, value); // Use the new helper function
        } else if ((key === 'deadline' || key === 'end_date' || key === 'event_datetime') && value === '') {
            dataToUpdate[key] = null;
        } else {
            dataToUpdate[key] = value;
        }
    }

    try {
        const { error } = await supabase.from(tableName).update(dataToUpdate).eq('id', id).eq(tableName === 'ideas' ? 'author_id' : 'organization_id', user.id);
        if (error) throw error;
    } catch (e: any) {
        return { error: `Database Error: ${e.message}`, success: false };
    }

    revalidatePath("/dashboard/manage");
    redirect(`/dashboard/manage?message=${opportunityType} updated successfully!`);
}

export async function deleteOpportunity(formData: FormData) { /* ... delete logic remains the same ... */ }