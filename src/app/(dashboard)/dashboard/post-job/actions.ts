"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface ActionState {
  error: string | null;
}

export async function postJob(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to post a job." };
  }

  // Get OLD and NEW data from the form
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const job_type = formData.get("job_type") as string;
  const description = formData.get("description") as string;
  const salary_range = formData.get("salary_range") as string;
  const deadline = formData.get("deadline") as string;
  const requirementsInput = formData.get("requirements") as string;

  // Simple validation
  if (!title || !location || !job_type || !description) {
    return { error: "Please fill out all required fields." };
  }
  
  // Convert comma-separated requirements into an array for the database
  const requirements = requirementsInput ? requirementsInput.split(',').map(req => req.trim()) : [];

  // Insert the new job into the 'jobs' table
  const { error } = await supabase
    .from("jobs")
    .insert({
      organization_id: user.id, // Link the job to the logged-in organization
      title,
      location,
      type: job_type, // NOTE: Your DB column is `type`, not `job_type`
      description,
      salary_range,
      deadline,
      requirements,
      status: 'active', // Automatically set the job as active
    });

  if (error) {
    console.error("Job Post Error:", error);
    return { error: `Database Error: ${error.message}` };
  }
  
  // On success, clear the cache and redirect
  revalidatePath("/opportunities");
  revalidatePath("/dashboard");
  redirect("/dashboard?message=Job posted successfully!");
}