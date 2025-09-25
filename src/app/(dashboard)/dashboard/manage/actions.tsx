"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getTableName(itemType: string): string {
    switch (itemType) {
        case 'job': return 'jobs';
        case 'program': return 'programs';
        case 'service': return 'services';
        case 'idea': return 'ideas';
        default: return 'initiatives'; // For Project, Event, etc.
    }
}

export async function deleteItem(id: string, type: string) {
    const supabase = createServerActionClient({ cookies });
    const tableName = getTableName(type);

    if (!tableName) {
        return redirect('/dashboard/manage?error=Invalid item type for deletion.');
    }

    const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

    if (error) {
        return redirect(`/dashboard/manage?error=Failed to delete: ${error.message}`);
    }

    revalidatePath('/dashboard/manage');
    redirect('/dashboard/manage?message=Item deleted successfully!');
}