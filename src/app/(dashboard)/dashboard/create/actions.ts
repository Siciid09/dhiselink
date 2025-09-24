"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface ActionState {
  error?: string | null;
  success?: boolean;
}

const contentConfig: { [key: string]: { tableName: string; } } = {
    jobs: { tableName: 'jobs' },
    programs: { tableName: 'programs' },
    initiatives: { tableName: 'initiatives' },
    services: { tableName: 'services' },
};

export async function manageContent(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to manage content." };
    }

    const intent = formData.get('intent') as string;
    const contentType = formData.get('contentType') as string;
    const id = formData.get('id') as string;

    const config = contentConfig[contentType];
    if (!config) {
        return { error: "Invalid content type." };
    }

    try {
        if (intent === 'delete') {
            const { error } = await supabase.from(config.tableName)
                .delete()
                .eq('id', id)
                .eq('organization_id', user.id);
            if (error) throw error;
        }

        if (intent === 'create' || intent === 'update') {
            // A simplified data object for inline editing
            const dataToUpsert = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                // Use a generic secondary field for location, type, department etc.
                location: formData.get('secondary_field') as string, 
                // Ensure organization_id is set for new entries
                organization_id: user.id 
            };
            
            if (!dataToUpsert.title) {
                return { error: "Title is a required field." };
            }

            if (intent === 'update') {
                const { error } = await supabase.from(config.tableName)
                    .update(dataToUpsert)
                    .eq('id', id)
                    .eq('organization_id', user.id);
                if (error) throw error;
            } else { // intent === 'create'
                 const { error } = await supabase.from(config.tableName)
                    .insert(dataToUpsert);
                if (error) throw error;
            }
        }
        
        revalidatePath(`/dashboard/manage/${contentType}`);
        return { success: true };

    } catch (e: any) {
        return { error: `Database Error: ${e.message}` };
    }
}


/*/ =================================================================================
// Hadiiiiii aan qalday 




// All interactive logic (state, forms, buttons) is in this component.
// =================================================================================*/
