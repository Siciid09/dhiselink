import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { roleConfig } from '../page';
import CreatePageUI from './CreatePageUI';
import SubmitIdeaPage from '../submit-idea/page';
import { User } from '@supabase/supabase-js';
import { Suspense } from 'react'; // Import Suspense

export const dynamic = 'force-dynamic';

export default async function CreatePage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile) redirect('/select-role');
    
    // --- THIS IS THE FIX ---
    // The component that USES the hook (`SubmitIdeaPage`) must be wrapped in Suspense.
    if (profile.role === 'individual') {
        return (
            <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-6 lg:p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                    </div>
                    <Suspense fallback={<div className="text-center p-20">Loading Form...</div>}>
                        <SubmitIdeaPage user={user as User} />
                    </Suspense>
                </div>
            </div>
        );
    }

    // For organizations, get their specific creation options
    const userRoleConfig = roleConfig[profile.role] || {};
    const options = userRoleConfig.creatableContentTypes || [];

    return (
        <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                 <div className="mb-6">
                     <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold">
                         <ArrowLeft size={16} /> Back to Dashboard
                     </Link>
                 </div>
                 <CreatePageUI user={user as User} options={options} />
            </div>
        </div>
    );
}