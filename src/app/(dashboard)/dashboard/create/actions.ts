"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

    const opportunity_type = formData.get("opportunity_type") as string;
    
    if (opportunity_type === 'Service') {
        const serviceData = {
            organization_id: user.id,
            title: formData.get("title") as string,
            category: formData.get("category") as string,
            subcategory: formData.get("subcategory") as string,
            description: formData.get("description") as string,
            price: formData.get("price") as string,
        };

        if (!serviceData.title || !serviceData.category) {
            return { error: "Please fill out all required service fields.", success: false };
        }
        
        const { error } = await supabase.from("services").insert(serviceData);

        if (error) {
            console.error("Service Post Error:", error);
            return { error: `Database Error: ${error.message}`, success: false };
        }

        revalidatePath("/dashboard/manage");
        revalidatePath("/dashboard");
        return redirect("/dashboard/manage?message=Service created successfully!");
    }
    
    const opportunityData = {
        title: formData.get("title") as string,
        location: formData.get("location") as string,
        opportunity_type: formData.get("opportunity_type") as string,
        description: formData.get("description") as string,
        requirements: (formData.get("requirements") as string)?.split(',').map(req => req.trim()).filter(Boolean),
        deadline: formData.get("deadline") as string || null,
        compensation: formData.get("compensation") as string,
        category: formData.get("category") as string,
        duration: formData.get("duration") as string,
        application_method: formData.get("application_method") as string,
    };

    if (!opportunityData.title || !opportunityData.opportunity_type || !opportunityData.description) {
        return { error: "Please fill out all required fields.", success: false };
    }

    let error;

    switch (opportunityData.opportunity_type) {
        case 'Job':
        case 'Internship':
            ({ error } = await supabase.from("jobs").insert({ organization_id: user.id, title: opportunityData.title, location: opportunityData.location, job_type: opportunityData.opportunity_type, description: opportunityData.description, requirements: opportunityData.requirements, salary_range: opportunityData.compensation, deadline: opportunityData.deadline }));
            break;
        case 'Program':
            ({ error } = await supabase.from("programs").insert({ organization_id: user.id, title: opportunityData.title, department: opportunityData.category, description: opportunityData.description, duration: opportunityData.duration, eligibility: opportunityData.requirements, deadline: opportunityData.deadline }));
            break;
        case 'Project':
        case 'Grant':
        case 'Tender':
        case 'Other':
            ({ error } = await supabase.from("initiatives").insert({ organization_id: user.id, title: opportunityData.title, type: opportunityData.opportunity_type, description: opportunityData.description, requirements: opportunityData.requirements, budget_range: opportunityData.compensation, end_date: opportunityData.deadline, application_method: opportunityData.application_method }));
            break;
        default:
            return { error: "Invalid opportunity type selected.", success: false };
    }

    if (error) {
        console.error("Opportunity Post Error:", error);
        return { error: `Database Error: ${error.message}`, success: false };
    }
    
    revalidatePath("/dashboard/manage");
    redirect("/dashboard/manage?message=Item created successfully!");
}

export async function updateOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update an opportunity.", success: false };
    }

    const id = formData.get('id') as string;
    const type = formData.get('opportunity_type') as string;

    if (!id || !type) {
        return { error: "Missing ID or type for update.", success: false };
    }

    const updateData: { [key: string]: any } = {
        title: formData.get('title'),
        location: formData.get('location'),
        description: formData.get('description'),
        requirements: (formData.get('requirements') as string)?.split(',').map(req => req.trim()).filter(Boolean),
        deadline: formData.get('deadline') || null,
        compensation: formData.get('compensation'),
        category: formData.get('category'),
        duration: formData.get('duration'),
        application_method: formData.get('application_method'),
    };

    let error;
    let tableName = '';
    let specificUpdateData = {};

    switch (type) {
        case 'Job':
        case 'Internship':
            tableName = 'jobs';
            specificUpdateData = { title: updateData.title, location: updateData.location, description: updateData.description, requirements: updateData.requirements, salary_range: updateData.compensation, deadline: updateData.deadline };
            break;
        case 'Program':
            tableName = 'programs';
            specificUpdateData = { title: updateData.title, department: updateData.category, description: updateData.description, duration: updateData.duration, eligibility: updateData.requirements, deadline: updateData.deadline };
            break;
        default:
            tableName = 'initiatives';
            specificUpdateData = { title: updateData.title, description: updateData.description, requirements: updateData.requirements, budget_range: updateData.compensation, end_date: updateData.deadline, application_method: updateData.application_method };
            break;
    }
    
    ({ error } = await supabase.from(tableName)
        .update(specificUpdateData)
        .eq('id', id)
        .eq('organization_id', user.id)
    );
    
    if (error) {
        console.error("Update Error:", error);
        return { error: `Database Error: ${error.message}`, success: false };
    }
    
    revalidatePath("/dashboard/manage");
    redirect("/dashboard/manage?message=Item updated successfully!");
}

export async function deleteOpportunity(formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in to delete items.");
    }
    
    const id = formData.get('id') as string;
    const type = formData.get('type') as string;

    if (!id || !type) {
        throw new Error("Missing ID or type for deletion.");
    }
    
    let tableName = '';
    switch (type) {
        case 'job': tableName = 'jobs'; break;
        case 'program': tableName = 'programs'; break;
        default: tableName = 'initiatives'; break;
    }
    
    const { error } = await supabase.from(tableName)
        .delete()
        .eq('id', id)
        .eq('organization_id', user.id);

    if (error) {
        console.error("Delete Error:", error);
        return redirect(`/dashboard/manage?error=Could not delete item.`);
    }

    revalidatePath('/dashboard/manage');
    redirect('/dashboard/manage?message=Item deleted successfully.');
}