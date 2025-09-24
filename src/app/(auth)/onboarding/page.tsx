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
        .select('role, organization_type') // Also select organization_type to pass it
        .eq('id', session.user.id)
        .single();

    if (!profile || !profile.role) {
        // If the user has no role, send them back to select one.
        redirect('/select-role');
    }

    // Updated Logic: Redirect based on the simplified role structure
    if (profile.role === 'individual') {
        redirect('/onboarding/individual');
    } else {
        // Any other role (company, university, ngo_gov, other) is an organization.
        // We pass the specific orgType as a query parameter to the new page.
        const orgType = profile.organization_type;
        redirect(`/onboarding/organization?type=${orgType}`);
    }
}