/// File Path: app/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DOMPurify from "isomorphic-dompurify";

interface ActionState {
  error: string | null;
}

/**
 * Generates a unique, URL-friendly slug from a given text string.
 * This function remains unchanged.
 */
const generateSlug = (text: string): string => {
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
  return `${slug}-${randomSuffix}`;
};

/**
 * Maps a content type from the form to its database table name.
 * This function remains unchanged.
 */
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

/**
 * Converts a comma-separated string into a clean array of strings.
 * This function remains unchanged.
 */
const stringToArray = (str: string | null): string[] | null => {
    if (!str) return null;
    return str.split(',').map(item => item.trim()).filter(Boolean);
};

export async function createOpportunity(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to create content." };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organization_name')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return { error: "User profile not found. Please complete your onboarding." };
  }

  const opportunityType = formData.get("opportunity_type") as string;
  const tableName = getTableName(opportunityType);
  if (!tableName) {
    return { error: `Invalid content type specified.` };
  }

  const dataToInsert: { [key: string]: any } = {};
  const richTextFields = ['description', 'details', 'requirements', 'bio', 'eligibility_criteria'];

  // Assign ownership based on the user's role and content type
  if (['Job', 'Program', 'Service', 'Initiative', 'Gallery'].includes(opportunityType)) {
      dataToInsert.organization_id = user.id;
      dataToInsert.organization_name = profile.organization_name;
  } else {
      dataToInsert.author_id = user.id;
  }
  
  // --- CORRECTED LOGIC SECTION ---
  // The main processing loop is updated to robustly handle title and slug generation.
  // All other functionality for different fields remains exactly the same.
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$') || key === 'opportunity_type' || value === '') continue;

    // The key fix: If the field is 'title' for a relevant table,
    // save the title AND generate/save the slug in one step.
    if (key === 'title' && ['jobs', 'ideas', 'heritage_sites'].includes(tableName)) {
        const titleValue = value as string;
        dataToInsert.title = titleValue; // Save the title
        dataToInsert.slug = generateSlug(titleValue); // Generate and save the slug from the title
        continue; // Move to the next field
    }
    
    // All other field processing logic is preserved
    if (richTextFields.includes(key)) {
        dataToInsert[key] = DOMPurify.sanitize(value as string);
    } else if (key === 'tags') {
      dataToInsert[key] = stringToArray(value as string);
    } else if (key.endsWith('_url') || key.endsWith('_images')) {
        const urls = (value as string).split(',').filter(Boolean);
        if (key.endsWith('_images') || key.endsWith('gallery_images')) {
            dataToInsert[key] = urls;
        } else {
            dataToInsert[key] = urls[0] || null;
        }
    } else {
      dataToInsert[key] = value;
    }
  }
  // --- END OF CORRECTED LOGIC SECTION ---

  // Set default status for specific content types (unchanged)
  if (tableName === 'jobs') dataToInsert.status = 'active';
  if (tableName === 'heritage_sites') dataToInsert.status = 'approved';
  
  const { error } = await supabase.from(tableName).insert(dataToInsert);
    
  if (error) {
    console.error('Supabase Insert Error:', error);
    return { error: `Database Error: ${error.message}` };
  }

  // Revalidate paths so new content appears instantly (unchanged)
  revalidatePath('/dashboard/manage');
  if (tableName === 'jobs') revalidatePath('/opportunities');
  if (tableName === 'ideas') revalidatePath('/ideas');
  if (tableName === 'heritage_sites') revalidatePath('/heritage');

  redirect(`/dashboard/manage?message=${opportunityType} created successfully!`);
}
