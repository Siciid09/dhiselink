import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './settings-form';
import { User, Building } from 'lucide-react';

export default async function SettingsPage() {
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
        
    if (!profile) {
        // This can happen if the DB trigger failed once. Send them back to select a role.
        redirect('/onboarding/complete-profile');
    }
    
    const RoleIcon = profile.role === 'individual' ? User : Building;

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <RoleIcon className="h-8 w-8 text-amber-600" />
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

                <main className="space-y-6">
                    {/* The form receives the complete profile data from the server */}
                    <SettingsForm profile={profile} />
                </main>
            </div>
        </div>
    );
}