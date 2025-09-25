import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Briefcase, BookOpen, Handshake, Shield, Lightbulb, Users, PlusCircle, Building, Landmark, Heart } from 'lucide-react';

export const roleConfig: Record<string, any> = {
    individual: {
        listTitle: "My Recent Ideas",
        actions: [
            { name: "Manage My Ideas", href: "/dashboard/manage", iconName: 'Lightbulb' },
            { name: "Profile Settings", href: "/dashboard/settings", iconName: 'Users' }
        ],
        creatableContentTypes: [
            { title: 'Idea', description: 'Submit an idea for a project.', iconName: 'Lightbulb' }
        ]
    },
    company: {
        listTitle: "My Recent Postings",
        actions: [
            { name: "Manage All Content", href: "/dashboard/manage", iconName: 'Briefcase' },
            { name: "Company Settings", href: "/dashboard/settings", iconName: 'Building' }
        ],
        creatableContentTypes: [
            { title: 'Job', description: 'Post a role.', iconName: 'Briefcase' },
            { title: 'Service', description: 'Offer a professional service.', iconName: 'Handshake' }
        ]
    },
    university: {
        listTitle: "Recent Content",
        actions: [
            { name: "Manage All Content", href: "/dashboard/manage", iconName: 'BookOpen' },
            { name: "University Settings", href: "/dashboard/settings", iconName: 'Landmark' }
        ],
        creatableContentTypes: [
            { title: 'Job', description: 'Post an employment opportunity.', iconName: 'Briefcase' },
            { title: 'Program', description: 'Add a university program.', iconName: 'BookOpen' }
        ]
    },
    ngo_gov: {
        listTitle: "Recent Initiatives",
        actions: [
            { name: "Manage All Content", href: "/dashboard/manage", iconName: 'Heart' },
            { name: "Organization Settings", href: "/dashboard/settings", iconName: 'Building' }
        ],
        creatableContentTypes: [
            { title: 'Job', description: 'Post a role for your organization.', iconName: 'Briefcase' },
            { title: 'Initiative', description: 'Post a Project, Event, etc.', iconName: 'Shield' }
        ]
    },
    other: {
        listTitle: "Recent Postings",
        actions: [
            { name: "Manage All Content", href: "/dashboard/manage", iconName: 'Briefcase' },
            { name: "Organization Settings", href: "/dashboard/settings", iconName: 'Building' }
        ],
        creatableContentTypes: [
            { title: 'Job', description: 'Post a role for your organization.', iconName: 'Briefcase' },
            { title: 'Initiative', description: 'Post a Project, Event, etc.', iconName: 'Shield' }
        ]
    }
};

const iconMap: Record<string, React.ElementType> = { Briefcase, BookOpen, Handshake, Shield, Lightbulb, Users, Building, Landmark, Heart };

function DashboardSkeleton() { return <div className="animate-pulse bg-slate-50 min-h-screen p-8">Loading Dashboard...</div> }

async function DashboardContent() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) redirect('/select-role');
    const config = roleConfig[profile.role] || roleConfig.company;
    
    let mainListItems: any[] = [];
    if(profile.role === 'individual') {
        const { data: ideas } = await supabase.from('ideas').select('id, title, created_at').eq('author_id', user.id).limit(5);
        mainListItems = (ideas || []).map(item => ({...item, type: 'idea' }));
    } else {
        const { data: jobs } = await supabase.from('jobs').select('id, title, created_at').eq('organization_id', user.id).limit(5);
        mainListItems = (jobs || []).map(item => ({...item, type: 'job' }));
    }

    return (
       <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-10">
                    <div><h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1><p className="text-slate-600 mt-2 text-lg">Welcome back, {profile.organization_name || profile.full_name}!</p></div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <Link href="/dashboard/create" className="bg-sky-600 text-white font-semibold py-3 px-5 rounded-lg flex items-center gap-2 shadow-lg shadow-sky-500/30 hover:bg-sky-700"><PlusCircle size={20} />Create New...</Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-bold text-slate-800">{config.listTitle}</h3><Link href="/dashboard/manage" className="text-sm font-semibold text-sky-600 hover:underline">Manage All</Link></div>
                        <div className="space-y-4">{mainListItems.length > 0 ? (mainListItems.map(item => (<div key={item.id} className="p-4 rounded-lg bg-slate-50 border"><p className="font-bold text-slate-800">{item.title}</p></div>))) : (<div className="text-center py-12 border-2 border-dashed rounded-lg"><Briefcase className="mx-auto text-slate-400" size={40} /><p className="mt-4 font-semibold text-slate-600">You have no active items yet.</p></div>)}</div>
                    </div>
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-xl font-bold text-slate-800 mb-5">Quick Actions</h3>
                        <ul className="space-y-3">{config.actions.map((action: any) => {
                            const Icon = iconMap[action.iconName];
                            return (
                                <li key={action.name}>
                                    <Link href={action.href} className="group flex items-center gap-4 p-4 rounded-xl bg-slate-100 hover:bg-sky-500 hover:text-white transition-all">
                                        <Icon className="text-slate-600 group-hover:text-white" />
                                        <span className="font-semibold text-slate-800 group-hover:text-white">{action.name}</span>
                                    </Link>
                                </li>
                            )
                        })}</ul>
                    </div>
                </div>
            </div>
       </div>
    );
}

export default function DashboardPage() { return (<Suspense fallback={<DashboardSkeleton />}><DashboardContent /></Suspense>); }