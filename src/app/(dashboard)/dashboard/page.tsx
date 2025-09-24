import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Briefcase, BookOpen, Handshake, Shield, Lightbulb, Users, Eye, PlusCircle, Building, Landmark, Heart } from 'lucide-react';

// This is the "master switch" that correctly defines the options for the Chooser Menu.
export const roleConfig: Record<string, any> = {
    individual: {
        listTitle: "My Recent Ideas", actions: [ { name: "Manage My Ideas", href: "/dashboard/manage", icon: Lightbulb }, { name: "Profile Settings", href: "/dashboard/settings", icon: Users } ],
        creatableContentTypes: [ { type: 'idea', title: 'Idea', description: 'Submit an idea for a project or venture.', icon: 'Lightbulb' } ]
    },
    company: {
        listTitle: "My Recent Postings", actions: [ { name: "Manage All Content", href: "/dashboard/manage", icon: Briefcase }, { name: "Company Settings", href: "/dashboard/settings", icon: Building } ],
        creatableContentTypes: [ { type: 'job', title: 'Job', description: 'Post a full-time or part-time role.', icon: 'Briefcase' }, { type: 'service', title: 'Service', description: 'Offer a professional service to clients.', icon: 'Handshake' } ]
    },
    university: {
        listTitle: "Recent University Content", actions: [ { name: "Manage All Content", href: "/dashboard/manage", icon: BookOpen }, { name: "University Settings", href: "/dashboard/settings", icon: Landmark } ],
        creatableContentTypes: [ { type: 'job', title: 'Job', description: 'Post an employment opportunity.', icon: 'Briefcase' }, { type: 'program', title: 'Program', description: 'Add a university course or training.', icon: 'BookOpen' } ]
    },
    ngo_gov: {
        listTitle: "Recent Initiatives", actions: [ { name: "Manage All Content", href: "/dashboard/manage", icon: Heart }, { name: "Organization Settings", href: "/dashboard/settings", icon: Building } ],
        creatableContentTypes: [
            { type: 'job', title: 'Job', description: 'Post a role for your organization.', icon: 'Briefcase' },
            { type: 'initiative', title: 'Initiative', description: 'Post a Project, Event, Tender, etc.', icon: 'Shield' }
        ]
    },
    other: {
        listTitle: "Recent Postings", actions: [ { name: "Manage All Content", href: "/dashboard/manage", icon: Briefcase }, { name: "Organization Settings", href: "/dashboard/settings", icon: Building } ],
        creatableContentTypes: [
            { type: 'job', title: 'Job', description: 'Post a role for your organization.', icon: 'Briefcase' },
            { type: 'initiative', title: 'Initiative', description: 'Post a Project, Event, Tender, etc.', icon: 'Shield' }
        ]
    }
};

// --- The rest of your dashboard component (no changes needed) ---
const summaryTypeConfig: Record<string, { className: string }> = { job: { className: 'bg-sky-100 text-sky-800' }, program: { className: 'bg-purple-100 text-purple-800' }, service: { className: 'bg-emerald-100 text-emerald-800' }, project: { className: 'bg-slate-100 text-slate-800' }, idea: { className: 'bg-amber-100 text-amber-800'}, default: { className: 'bg-gray-100 text-gray-800' }};
function DashboardSkeleton() { return <div className="animate-pulse bg-slate-50 min-h-screen p-8">Loading Dashboard...</div> }
async function DashboardContent() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) redirect('/select-role');
    const config = roleConfig[profile.role] || roleConfig.company;
    const { data: jobs } = await supabase.from('jobs').select('id, title, created_at').eq('organization_id', user.id).limit(5);
    const mainListItems = (jobs || []).map(item => ({ ...item, type: 'job' }));
    return (
       <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-10">
                    <div><h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1><p className="text-slate-600 mt-2 text-lg">Welcome back, {profile.organization_name || profile.full_name}!</p></div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0"><Link href="/dashboard/create" className="bg-sky-600 text-white font-semibold py-3 px-5 rounded-lg flex items-center gap-2 shadow-lg shadow-sky-500/30 hover:bg-sky-700"><PlusCircle size={20} />Create New...</Link></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-bold text-slate-800">{config.listTitle}</h3><Link href="/dashboard/manage" className="text-sm font-semibold text-sky-600 hover:underline">Manage All</Link></div>
                        <div className="space-y-4">{mainListItems.length > 0 ? (mainListItems.map(item => (<div key={item.id} className="p-4 rounded-lg bg-slate-50 border"><p className="font-bold text-slate-800">{item.title}</p></div>))) : (<div className="text-center py-12 border-2 border-dashed rounded-lg"><Briefcase className="mx-auto text-slate-400" size={40} /><p className="mt-4 font-semibold text-slate-600">You have no active items yet.</p></div>)}</div>
                    </div>
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-xl font-bold text-slate-800 mb-5">Quick Actions</h3>
                        <ul className="space-y-3">{config.actions.map((action: any) => (<li key={action.name}><Link href={action.href} className="group flex items-center gap-4 p-4 rounded-xl bg-slate-100 hover:bg-sky-500 hover:text-white transition-all"><action.icon className="text-slate-600 group-hover:text-white" />
                        <span className="font-semibold text-slate-800 group-hover:text-white">{action.name}</span></Link></li>))}</ul>
                    </div>
                </div>
            </div>
       </div>
    );
}
export default function DashboardPage() { return (<Suspense fallback={<DashboardSkeleton />}><DashboardContent /></Suspense>); }
