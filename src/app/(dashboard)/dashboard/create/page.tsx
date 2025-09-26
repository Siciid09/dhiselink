import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, BookOpen, Handshake, Shield, Heart, Lightbulb, Camera } from 'lucide-react';
import CreatePageUI from './CreatePageUI';
import { User } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// --- PERMISSIONS CONFIGURATION ---
// This list defines which role can create which type of content.
const creatableContentTypes = [
    { 
        type: 'Job', 
        title: 'Job Posting', 
        description: 'Share a new employment opportunity.', 
        icon: 'Briefcase', 
        roles: ['company', 'university', 'ngo', 'government', 'other'] 
    },
    { 
        type: 'Service', 
        title: 'Professional Service', 
        description: 'Offer a service to the community.', 
        icon: 'Handshake', 
        roles: ['company'] 
    },
    { 
        type: 'Program', 
        title: 'Academic Program', 
        description: 'List a new course or program.', 
        icon: 'BookOpen', 
        roles: ['university'] 
    },
    { 
        type: 'Initiative', 
        title: 'New Initiative', 
        description: 'Announce a project, event, or grant.', 
        icon: 'Shield', 
        roles: ['ngo', 'government'] 
    },
    { 
        type: 'Idea', 
        title: 'Community Idea', 
        description: 'Share an idea for a new venture or project.', 
        icon: 'Lightbulb', 
        roles: ['individual'] 
    },
    { 
        type: 'Heritage Site', 
        title: 'Heritage Site', 
        description: 'Document a place of cultural significance.', 
        icon: 'Heart', 
        // Available to everyone
        roles: ['individual', 'company', 'university', 'ngo', 'government', 'other'] 
    },
    { 
        type: 'Gallery', 
        title: 'Image Gallery', 
        description: 'Showcase a collection of images.', 
        icon: 'Camera', 
        roles: ['company', 'university', 'ngo', 'government', 'other'] 
    },
];

export default async function CreatePage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role, organization_type').eq('id', user.id).single();
    if (!profile) redirect('/select-role');
    
    // --- UPDATED & CORRECTED FILTERING LOGIC ---
    const getAvailableOptions = (role: string, orgType?: string | null) => {
        const userOrgType = orgType?.toLowerCase();

        return creatableContentTypes.filter(option => {
            // Rule 1: Always include options available to the user's main role (e.g., 'individual')
            if (option.roles.includes(role)) {
                return true;
            }
            // Rule 2: If the user is an organization, ALSO include options that match their specific type.
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
                     <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold">
                         <ArrowLeft size={16} /> Back to Dashboard
                     </Link>
                 </div>
                 <CreatePageUI user={user as User} options={availableOptions} />
            </div>
        </div>
    );
}