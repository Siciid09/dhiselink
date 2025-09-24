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
    return { error: "You must be logged in to complete onboarding." };
  }

  // Convert FormData to a plain object to handle all fields dynamically
  const formObject = Object.fromEntries(formData.entries());
  
  // You can add more robust validation here if needed
  if (!formObject.organization_name || !formObject.organization_subtype) {
    return { error: "Please ensure all required fields are filled out." };
  }
  
  // Add the onboarding_complete flag
  const dataToUpdate = {
    ...formObject,
    onboarding_complete: true
  };
  
  const { error } = await supabase
    .from("profiles")
    .update(dataToUpdate) // Update with all the collected data
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error);
    return { error: `Database Error: ${error.message}` };
  }
  
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
