import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OrganizationOnboardingForm from './OrganizationOnboardingForm';

export default async function OrganizationOnboardingPage() {
    const supabase = createServerComponentClient({ cookies });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_type')
        .eq('id', user.id)
        .single();

    if (!profile?.organization_type) {
        return redirect('/select-role');
    }

    const orgType = profile.organization_type;
    let orgSubtypes: string[] = [];

    // Define the subtypes for each main organization type
    switch (orgType) {
        case 'Government':
            orgSubtypes = ['Ministry', 'Agency', 'Department', 'Local Office'];
            break;
        case 'NGO':
            orgSubtypes = ['International NGO', 'Local NGO'];
            break;
        case 'Company':
            orgSubtypes = ['For-Profit', 'B-Corp', 'Social Enterprise'];
            break;
        case 'University':
            orgSubtypes = ['Public University', 'Private University', 'College'];
            break;
        case 'Other':
            orgSubtypes = ['Consultancy', 'Startup', 'Community Group'];
            break;
    }

    return <OrganizationOnboardingForm orgType={orgType} orgSubtypes={orgSubtypes} />;
}