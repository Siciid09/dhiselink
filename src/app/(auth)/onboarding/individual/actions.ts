"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState { error: string | null; }

export async function completeIndividualOnboarding(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { return { error: "You must be logged in." }; }

  // Get the data from the simple form
  const fullName = formData.get("full_name") as string;
  const professionalTitle = formData.get("professional_title") as string;
  const bio = formData.get("bio") as string;

  if (!fullName || !professionalTitle) {
    return { error: "Full Name and Professional Title are required." };
  }
  
  // Perform a single update to the 'profiles' table
  const { error } = await supabase
    .from("profiles")
    .update({ 
        full_name: fullName,
        professional_title: professionalTitle,
        bio: bio,
        onboarding_complete: true // Mark onboarding as complete!
    })
    .eq("id", user.id);

  if (error) {
    return { error: `Database Error: ${error.message}` };
  }
  
  revalidatePath("/dashboard");
  redirect("/dashboard");
}