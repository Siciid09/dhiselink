"use server";

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const repeatPassword = formData.get('repeatPassword') as string;
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const supabase = createServerActionClient({ cookies });

    // --- New Validation Step ---
    if (password !== repeatPassword) {
        return redirect('/register?message=Passwords do not match.');
    }
    
    // --- New Validation Step ---
    if (!phone) {
        return redirect('/register?message=Phone number is required.');
    }

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                // You can add phone to the user's metadata if you wish
                // phone: phone, 
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

    // After sign-up, update the public.profiles table with the phone number
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
            full_name: fullName,
            phone: phone // Save the phone number here
        })
        .eq('id', user.id);

    if (profileError) {
        console.error("Profile Update Error:", profileError);
        // Even if this fails, we can still try to log them in
    }

    // Automatically sign in the user after they sign up
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        console.error("Sign In Error after Sign Up:", signInError);
        return redirect(`/login?message=Account created, but failed to log in. Please try again.`);
    }

    redirect('/select-role');
}