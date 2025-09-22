"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const supabase = createServerActionClient({ cookies });

  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    },
  });

  if (signUpError) {
    console.error("Sign Up Error:", signUpError);
    return redirect(`/register?message=Could not create account: ${signUpError.message}`);
  }

  if (!user) {
    return redirect('/register?message=Success! Please check your email to verify your account.');
  }
  
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error("Sign In Error after Sign Up:", signInError);
    return redirect(`/login?message=Account created, but failed to log in. Please try again.`);
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (profileError) {
    console.error("Profile Update Error:", profileError);
    return redirect(`/dashboard?message=Could not update user profile: ${profileError.message}`);
  }

  // --- THIS IS THE FIX ---
  // On success, redirect to the START of the onboarding flow.
  redirect('/select-role');
}