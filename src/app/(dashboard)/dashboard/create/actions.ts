"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ActionState { error: string | null; }

function getTableName(opportunityType: string): string {
  switch (opportunityType) {
    case 'Job': return 'jobs';
    case 'Program': return 'programs';
    case 'Service': return 'services';
    case 'Initiative': return 'initiatives';
    case 'Idea': return 'ideas';
    case 'Heritage Site': return 'heritage_sites';
    case 'Gallery': return 'galleries';
    default: return '';
  }
}

// Helper to convert comma-separated strings to an array of strings
const stringToArray = (str: string | null) => str ? str.split(',').map(item => item.trim()).filter(Boolean) : null;

export async function createOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organization_name, logo_url')
    .eq('id', user.id)
    .single();

  if (!profile) return { error: "User profile not found." };

  const opportunityType = formData.get("opportunity_type") as string;
  const tableName = getTableName(opportunityType);
  if (!tableName) return { error: `Invalid content type: ${opportunityType}` };

  const dataToInsert: { [key: string]: any } = {};

  // Handle author/organization ID based on content type
  if (['Job', 'Program', 'Service', 'Initiative', 'Gallery'].includes(opportunityType)) {
      dataToInsert.organization_id = user.id; // Or author_id if you standardize
      dataToInsert.organization_name = profile.organization_name;
      dataToInsert.organization_logo_url = profile.logo_url;
  } else { // For Ideas, Heritage Sites
      dataToInsert.author_id = user.id;
  }

  // Process all fields from the form
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$') || key === 'opportunity_type' || value === '') continue;

    // Handle special parsing for specific fields
    if (key === 'tags') {
      dataToInsert[key] = stringToArray(value as string);
    } else if (key === 'gallery_images' || key === 'images') {
       // Assuming the upload component provides a comma-separated string of URLs
       dataToInsert[key] = (value as string).split(',').filter(Boolean);
    }
    else {
      dataToInsert[key] = value;
    }
  }

  const { data: newRecord, error } = await supabase
    .from(tableName)
    .insert(dataToInsert)
    .select('id')
    .single();
    
  if (error) {
    console.error('Supabase Insert Error:', error);
    return { error: `Database Error: ${error.message}` };
  }

  // Revalidate paths and redirect
  revalidatePath("/dashboard/manage");
  // Add more specific paths to revalidate as needed, e.g., revalidatePath('/jobs')
  
  redirect(`/dashboard/manage?message=${opportunityType} created successfully!`);
}