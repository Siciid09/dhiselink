import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { roleConfig } from '../page'; // Imports the "master switch" from your main dashboard page
import CreatePageUI from './CreatePageUI'; // The new all-in-one client component

export const dynamic = 'force-dynamic';

export default async function CreatePage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile) redirect('/select-role');
    
    // Reads the roleConfig to find the correct options for the user
    const userRoleConfig = roleConfig[profile.role] || roleConfig.company;
    const options = userRoleConfig.creatableContentTypes;

    return (
        <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                 <div className="mb-6">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>
                {/* Passes the user and their specific options to the UI component */}
                <CreatePageUI user={user} options={options} />
            </div>
        </div>
    );
}