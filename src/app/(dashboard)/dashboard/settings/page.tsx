///app/dashboard/settings/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SettingsForm from './settings-form'; // We will create this next
import { Briefcase, Building, User } from 'lucide-react';

export default async function SettingsPage() {
    const supabase = createServerComponentClient({ cookies });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // Fetch the complete profile for the logged-in user
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
    if (!profile) {
        // This should not happen if onboarding is complete, but it's a good safeguard
        redirect('/select-role');
    }
    
    // Choose an icon based on the role
    const RoleIcon = profile.role === 'individual' ? User : Building;

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <RoleIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Profile & Settings
                            </h1>
                            <p className="text-slate-600 mt-1">
                                Update your personal or organizational details.
                            </p>
                        </div>
                    </div>
                </header>

                <main className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80">
                    {/* We pass the fetched profile data to the client form component */}
                    <SettingsForm profile={profile} />
                </main>
            </div>
        </div>
    );
}