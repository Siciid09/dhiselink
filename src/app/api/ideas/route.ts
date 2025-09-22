import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// This function handles the POST request from your "Submit Idea" form
export async function POST(request: Request) {
  const ideaData = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  
  // First, check if the user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to submit an idea.' }, { status: 401 });
  }

  // Insert the new idea into the database, linking it to the logged-in user
  const { data, error } = await supabase
    .from('ideas')
    .insert({
      ...ideaData, // The title, summary, etc. from the form
      author_id: session.user.id, // Associate the idea with the current user
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // --- THIS IS THE FIX ---
  // After a successful insert, we tell Next.js to clear the cache 
  // for the main ideas list page.
  revalidatePath('/ideas');

  // Return the newly created idea to the form
  return NextResponse.json(data);
}