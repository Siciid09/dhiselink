"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState { error: string | null; }

export async function completeOtherOnboarding(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) { return { error: "You must be logged in." }; }

    const organizationName = formData.get("organization_name") as string;
    const websiteUrl = formData.get("website_url") as string;
    const organizationSubtype = formData.get("organization_subtype") as string;

    if (!organizationName || !websiteUrl || !organizationSubtype) { return { error: "Please fill out all fields." }; }
    
    // Update the user's row in the 'profiles' table with the new subtype
    const { error } = await supabase
        .from("profiles")
        .update({ 
            organization_name: organizationName,
            website_url: websiteUrl,
            organization_subtype: organizationSubtype,
            onboarding_complete: true
        })
        .eq("id", user.id);

    if (error) {
        return { error: `Database Error: ${error.message}` };
    }
    
    revalidatePath("/dashboard");
    redirect("/dashboard");
}
