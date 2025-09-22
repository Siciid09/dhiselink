import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
    const supabase = createServerComponentClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (!profile || !profile.role) {
        redirect('/select-role');
    }

    // Now correctly redirects ALL roles to their own page
    switch (profile.role) {
        case 'individual':
            redirect('/onboarding/individual');
        case 'company':
            redirect('/onboarding/company');
        case 'university':
            redirect('/onboarding/university');
        case 'ngo_gov':
            redirect('/onboarding/ngo-gov');
        case 'other': // Added redirect for the 'other' role
            redirect('/onboarding/other');
        default:
            redirect('/select-role');
    }
}