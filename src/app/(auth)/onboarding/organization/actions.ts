"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
}

export async function completeOrganizationOnboarding(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const dataToUpdate = {
    // Tab 1
    organization_name: formData.get("organization_name") as string,
    location: formData.get("location") as string,
    year_founded: Number(formData.get("year_founded")),
    // Tab 2
    organization_subtype: formData.get("organization_subtype") as string,
    bio: formData.get("bio") as string,
    employee_count: formData.get("employee_count") as string,
    // Tab 3 (Dynamic)
    industry: formData.get("industry") as string | null,
    accreditation: formData.get("accreditation") as string | null,
    community_focus: formData.get("community_focus") as string | null,
    services: formData.get("services") as string,
    // Other
    organization_type: formData.get("organization_type") as string,
    onboarding_complete: true
  };

  // Basic validation
  const requiredFields = [dataToUpdate.organization_name, dataToUpdate.location, dataToUpdate.year_founded, dataToUpdate.organization_subtype, dataToUpdate.bio, dataToUpdate.employee_count];
  if (requiredFields.some(f => !f)) {
    return { error: "Please ensure all required fields are filled out." };
  }
  
  const { error } = await supabase
    .from("profiles")
    .update(dataToUpdate)
    .eq("id", user.id);

  if (error) {
    return { error: `Database Error: ${error.message}` };
  }
  
  revalidatePath("/dashboard");
  revalidatePath("/organizations");
  redirect("/dashboard");
}