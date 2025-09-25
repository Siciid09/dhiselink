"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState { error: string | null; }

function getTableName(opportunityType: string): string {
    switch (opportunityType) {
        case 'Job': return 'jobs';
        case 'Program': return 'programs';
        case 'Service': return 'services';
        case 'Initiative': return 'initiatives';
        default: return '';
    }
}

export async function createOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in." };

    // --- THIS IS THE FIX ---
    // 1. Fetch the user's profile to get their ORGANIZATION'S info
    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_name, logo_url')
        .eq('id', user.id)
        .single();

    const opportunityType = formData.get("opportunity_type") as string;
    const tableName = getTableName(opportunityType);
    if (!tableName) return { error: `Invalid type: ${opportunityType}` };

    const dataToInsert: { [key: string]: any } = { 
        organization_id: user.id,
        // 2. Add the ORGANIZATION'S name and logo to the data being saved
        organization_name: profile?.organization_name,
        organization_logo_url: profile?.logo_url
    };
    
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('$') || key === 'opportunity_type') continue;
        dataToInsert[key] = value;
    }
    
    if (tableName === 'jobs') {
        dataToInsert.status = 'active';
    }

    const { error } = await supabase.from(tableName).insert(dataToInsert);
    if (error) {
        return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/dashboard/manage");
    revalidatePath("/opportunities");
    redirect(`/dashboard/manage?message=${opportunityType} created successfully!`);
}