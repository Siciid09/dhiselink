"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateUserRole(formData: FormData) {
    const mainSelection = formData.get("role"); // This will be 'individual' or 'organization'
    const orgType = formData.get("organization_type") as string | null; // This is the new dropdown value

    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/select-role?message=User not found.");
    }

    let roleToSave: string | null = null;
    let orgTypeToSave: string | null = orgType;

    if (mainSelection === 'individual') {
        roleToSave = 'individual';
        orgTypeToSave = null; // Individuals don't have an org type
    } else if (mainSelection === 'organization' && orgType) {
        // Map the new orgType to your original role system for compatibility
        const roleMapping: { [key: string]: string } = {
            'Company': 'company',
            'University': 'university',
            'NGO': 'ngo_gov',
            'Government': 'ngo_gov',
            'Other': 'other'
        };
        roleToSave = roleMapping[orgType] || 'other';
    } else {
        return redirect("/select-role?message=Please make a valid selection.");
    }

    const { error } = await supabase
        .from("profiles")
        .update({ 
            role: roleToSave,
            organization_type: orgTypeToSave 
        })
        .eq("id", user.id);

    if (error) {
        return redirect(`/select-role?message=Database Error: ${error.message}`);
    }

    await supabase.auth.refreshSession();

    revalidatePath("/onboarding");
    redirect("/onboarding");
}