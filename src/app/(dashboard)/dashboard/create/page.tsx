import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, BookOpen, Handshake, Shield, Heart, Lightbulb, Camera } from 'lucide-react';
import CreatePageUI from './CreatePageUI';
import { User } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const creatableContentTypes = [
    { type: 'Job', title: 'Job Posting', description: 'Share a new employment opportunity.', icon: 'Briefcase', roles: ['company', 'university', 'ngo', 'government', 'other'] },
    { type: 'Service', title: 'Professional Service', description: 'Offer a service to the community.', icon: 'Handshake', roles: ['company'] },
    { type: 'Program', title: 'Academic Program', description: 'List a new course or program.', icon: 'BookOpen', roles: ['university'] },
    { type: 'Initiative', title: 'New Initiative', description: 'Announce a project, event, or grant.', icon: 'Shield', roles: ['ngo', 'government'] },
    { type: 'Idea', title: 'Community Idea', description: 'Share an idea for a new venture or project.', icon: 'Lightbulb', roles: ['individual'] },
    { type: 'Heritage Site', title: 'Heritage Site', description: 'Document a place of cultural significance.', icon: 'Heart', roles: ['individual', 'company', 'university', 'ngo', 'government', 'other'] },
    { type: 'Gallery', title: 'Image Gallery', description: 'Showcase a collection of images.', icon: 'Camera', roles: ['company', 'university', 'ngo', 'government', 'other'] },
];

export default async function CreatePage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role, organization_type').eq('id', user.id).single();
    if (!profile) redirect('/select-role');
    
    // --- THIS LOGIC NOW WORKS WITH THE CORRECTED DATA ---
    const getAvailableOptions = (role: string, orgType?: string | null) => {
        const userOrgType = orgType?.toLowerCase();
        return creatableContentTypes.filter(option => {
            if (role === 'individual' && option.roles.includes('individual')) {
                return true;
            }
            if (role === 'organization' && userOrgType && option.roles.includes(userOrgType)) {
                return true;
            }
            return false;
        });
    };

    const availableOptions = getAvailableOptions(profile.role, profile.organization_type);

    return (
        <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                 <div className="mb-6">
                     <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-amber-600 font-semibold transition-colors">
                         <ArrowLeft size={16} /> Back to Dashboard
                     </Link>
                 </div>
                 <CreatePageUI user={user as User} options={availableOptions} />
            </div>
        </div>
    );
}