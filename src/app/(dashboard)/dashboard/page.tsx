import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import DashboardClientPage from './DashboardClientPage';

const CompleteProfilePrompt = ({ name }: { name: string }) => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg border max-w-lg">
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {name}!</h1>
            <p className="mt-2 text-slate-600">Let's finish setting up your profile to unlock all features of the Dhiselink platform.</p>
            <Link href="/onboarding/complete-profile" className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-lg hover:bg-amber-600 transition-colors">
                <Edit size={18} /> Complete Your Profile
            </Link>
        </div>
    </div>
);

export default async function Dashboard() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    
    if (!profile || !profile.onboarding_complete) {
        return <CompleteProfilePrompt name={profile?.full_name || 'there'} />;
    }

    // Fetch role-specific content in parallel for performance
    let userContent = {};
    if (profile.role === 'individual') {
        // Corrected: Fetch heritage sites alongside ideas
        const ideasPromise = supabase.from('ideas').select('*').eq('author_id', user.id).limit(5);
        const heritagePromise = supabase.from('heritage_sites').select('*').eq('author_id', user.id).limit(3);
        
        const [{ data: ideas }, { data: heritage }] = await Promise.all([ideasPromise, heritagePromise]);
        
        userContent = {
            ideas: ideas || [],
            heritage: heritage || []
        };
    } else {
        const jobsPromise = supabase.from('jobs').select('*').eq('organization_id', user.id).limit(3);
        const servicesPromise = supabase.from('services').select('*').eq('organization_id', user.id).limit(3);
        const galleriesPromise = supabase.from('galleries').select('*').eq('organization_id', user.id).limit(3);
        
        const [{ data: jobs }, { data: services }, { data: galleries }] = await Promise.all([jobsPromise, servicesPromise, galleriesPromise]);
        
        userContent = {
            jobs: jobs || [],
            services: services || [],
            galleries: galleries || [],
        };
    }

    return <DashboardClientPage profile={profile} userContent={userContent} />;
}