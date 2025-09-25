import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
// Updated: Added the Phone icon
import { ArrowLeft, MapPin, Globe, Mail, Briefcase, Users, Landmark, Building2, Phone } from 'lucide-react';
import OrganizationTabs from './OrganizationTabs';

export const dynamic = 'force-dynamic';

export default async function OrganizationDetailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { id } = params;

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (profileError || !profile) { notFound(); }

    let jobs: any[] = [];
    let programs: any[] = [];
    let initiatives: any[] = [];
    let services: any[] = [];

    const role = profile.role;

    if (['company', 'university', 'ngo_gov', 'other'].includes(role)) {
        const { data } = await supabase.from('jobs').select('*').eq('organization_id', id).order('created_at', { ascending: false });
        jobs = data || [];
    }
    if (role === 'company') {
        const { data } = await supabase.from('services').select('*').eq('organization_id', id).order('created_at', { ascending: false });
        services = data || [];
    }
    if (role === 'university') {
        const { data } = await supabase.from('programs').select('*').eq('organization_id', id).order('created_at', { ascending: false });
        programs = data || [];
    }
    if (['ngo_gov', 'other'].includes(role)) {
        const { data } = await supabase.from('initiatives').select('*').eq('organization_id', id).order('created_at', { ascending: false });
        initiatives = data || [];
    }
    
    const displayName = profile.organization_name || profile.name || "Organization";

    let displayType: string = 'Organization';
    if (profile.organization_type === 'Government') {
        displayType = 'Government';
    } else if (profile.organization_type === 'NGO') {
        displayType = 'NGO';
    }
    const displaySubtype = profile.organization_subtype;

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto max-w-5xl py-16 px-4">
                <Link href="/organizations" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-600 font-semibold mb-6 transition-colors"><ArrowLeft size={18} />Back to All Organizations</Link>
                <header className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200">{profile.cover_image_url && <img src={profile.cover_image_url} alt="Cover" className="w-full h-full object-cover" />}</div>
                    <div className="p-6 sm:p-8 relative">
                        <img src={profile.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${displayName}`} alt="Logo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-lg object-contain bg-white absolute -top-12 sm:-top-16"/>
                        <div className="pt-16 sm:pt-20">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{displayName}</h1>
                            {profile.tagline && <p className="text-lg text-slate-500 mt-1">{profile.tagline}</p>}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm text-slate-600">
                                {displayType && <span className="flex items-center gap-1.5 font-medium"><Landmark size={14}/> {displayType}</span>}
                                {displaySubtype && <span className="flex items-center gap-1.5"><Building2 size={14}/> {displaySubtype}</span>}
                                {profile.location && <span className="flex items-center gap-1.5"><MapPin size={14}/>{profile.location}</span>}
                                {profile.industry && <span className="flex items-center gap-1.5"><Briefcase size={14}/>{profile.industry}</span>}
                                {profile.employee_count && <span className="flex items-center gap-1.5"><Users size={14}/>{profile.employee_count} Employees</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
                                {profile.website_url && <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"><Globe size={16}/>Website</a>}
                                {profile.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"><Mail size={16}/>Email</a>}
                                {/* Updated: Added the Phone Number display */}
                                {profile.phone && <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"><Phone size={16}/>Call</a>}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="mt-8">
                    <OrganizationTabs profile={profile} jobs={jobs} programs={programs} initiatives={initiatives} services={services} />
                </main>
            </div>
        </div>
    );
}