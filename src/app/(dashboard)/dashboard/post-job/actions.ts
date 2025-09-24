// File: app/dashboard/post-job/actions.ts

"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
  success: boolean;
}

export async function createOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to post an opportunity.", success: false };
    }

    // --- Get all universal data from the form ---
    const opportunityData = {
        title: formData.get("title") as string,
        location: formData.get("location") as string,
        opportunity_type: formData.get("opportunity_type") as string,
        description: formData.get("description") as string,
        requirements: (formData.get("requirements") as string)?.split(',').map(req => req.trim()).filter(Boolean),
        deadline: formData.get("deadline") as string || null,
        compensation: formData.get("compensation") as string,
        category: formData.get("category") as string,
        application_method: formData.get("application_method") as string,
        tags: (formData.get("tags") as string)?.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (!opportunityData.title || !opportunityData.opportunity_type || !opportunityData.description) {
        return { error: "Please fill out all required fields.", success: false };
    }

    let error;

    // --- Smartly save to the correct table based on type ---
    switch (opportunityData.opportunity_type) {
        case 'Job':
        case 'Internship':
            ({ error } = await supabase.from("jobs").insert({
                organization_id: user.id,
                title: opportunityData.title,
                location: opportunityData.location,
                job_type: opportunityData.opportunity_type,
                description: opportunityData.description,
                salary_range: opportunityData.compensation,
                deadline: opportunityData.deadline,
                requirements: opportunityData.requirements,
            }));
            break;
        
        case 'Program':
        case 'Fellowship':
            ({ error } = await supabase.from("programs").insert({
                organization_id: user.id,
                title: opportunityData.title,
                department: opportunityData.category,
                description: opportunityData.description,
                duration: formData.get("duration") as string, // Specific field for programs
                deadline: opportunityData.deadline,
                eligibility: opportunityData.requirements,
            }));
            break;

        case 'Project':
        case 'Grant':
        case 'Other':
            ({ error } = await supabase.from("initiatives").insert({
                organization_id: user.id,
                title: opportunityData.title,
                type: opportunityData.opportunity_type,
                description: opportunityData.description,
                budget_range: opportunityData.compensation,
                end_date: opportunityData.deadline,
                requirements: opportunityData.requirements,
            }));
            break;

        default:
            return { error: "Invalid opportunity type selected.", success: false };
    }

    if (error) {
        console.error("Opportunity Post Error:", error);
        return { error: `Database Error: ${error.message}`, success: false };
    }
    
    revalidatePath("/opportunities");
    revalidatePath("/dashboard");
    redirect("/dashboard?message=Opportunity posted successfully!");
}