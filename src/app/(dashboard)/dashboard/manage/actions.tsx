"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getTableName(itemType: string): string {
    switch (itemType) {
        case 'job': return 'jobs';
        case 'program': return 'programs';
        case 'service': return 'services';
        case 'idea': return 'ideas';
        case 'gallery': return 'galleries';
        case 'event': case 'project': case 'announcement': case 'grant': case 'tender': case 'initiative':
            return 'initiatives';
        default: return '';
    }
}

export async function deleteItem(id: string, type: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const tableName = getTableName(type);
    if (!tableName) return redirect('/dashboard/manage?error=Invalid item type.');

    const ownerColumn = (tableName === 'ideas' || tableName === 'heritage_sites') ? 'author_id' : 'organization_id';

    const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .eq(ownerColumn, user.id); // Security: Ensures you can only delete your own items.

    if (error) {
        return redirect(`/dashboard/manage?error=Failed to delete: ${error.message}`);
    }

    revalidatePath('/dashboard/manage');
    redirect('/dashboard/manage?message=Item deleted successfully!');
}