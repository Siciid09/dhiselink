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
    organization_name: formData.get("organization_name") as string,
    location: formData.get("location") as string,
    year_founded: formData.get("year_founded") as string,
    organization_subtype: formData.get("organization_subtype") as string,
    bio: formData.get("bio") as string,
    employee_count: formData.get("employee_count") as string,
    website_url: formData.get("website_url") as string,
    email: formData.get("email") as string,
    organization_type: formData.get("organization_type") as string,
    onboarding_complete: true
  };

  if (!dataToUpdate.organization_name || !dataToUpdate.location || !dataToUpdate.bio) {
    return { error: "Name, Location, and Bio are required fields." };
  }
  
  const { error } = await supabase
    .from("profiles")
    .update(dataToUpdate)
    .eq("id", user.id);

  if (error) {
    return { error: `Database Error: ${error.message}` };
  }
  
  revalidatePath("/dashboard");
  revalidatePath("/organizations"); // Also revalidate the listing page
  redirect("/dashboard");
}