import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { 
    PlusCircle, Briefcase, Users, Eye, Edit, Building, Search, 
    ArrowRight, Bell, BookOpen, Heart, Shield, Landmark, Handshake
} from 'lucide-react';

const summaryTypeConfig: Record<string, { className: string }> = {
    job: { className: 'bg-sky-100 text-sky-800' },
    program: { className: 'bg-purple-100 text-purple-800' },
    service: { className: 'bg-emerald-100 text-emerald-800' },
    project: { className: 'bg-slate-100 text-slate-800' },
    default: { className: 'bg-gray-100 text-gray-800' }
};

export const roleConfig: Record<string, any> = {
    company: {
        listTitle: "My Recent Postings",
        actions: [
            { name: "Manage All Content", href: "/dashboard/manage", icon: Briefcase },
            { name: "Company Settings", href: "/dashboard/settings", icon: Building }
        ],
        creatableContentTypes: [
            { type: 'job', title: 'Job', description: 'Post a full-time or part-time role.', icon: 'Briefcase' },
            { type: 'service', title: 'Service', description: 'Offer a professional service to clients.', icon: 'Handshake' }
        ]
    },
    university: {
        listTitle: "Recent University Content",
        actions: [
            { name: "Manage All Content", href: "/dashboard/manage", icon: BookOpen },
            { name: "University Settings", href: "/dashboard/settings", icon: Landmark }
        ],
        creatableContentTypes: [
            { type: 'job', title: 'Job', description: 'Post an employment opportunity.', icon: 'Briefcase' },
            { type: 'program', title: 'Program', description: 'Add a university course or training.', icon: 'BookOpen' }
        ]
    },
    government: {
        listTitle: "Recent Announcements",
        actions: [
            { name: "Manage All Content", href: "/dashboard/manage", icon: Shield },
            { name: "Department Settings", href: "/dashboard/settings", icon: Building }
        ],
        creatableContentTypes: [
            { type: 'job', title: 'Job', description: 'Post a public sector job opening.', icon: 'Briefcase' },
            { type: 'project', title: 'Tender / Announcement', description: 'Post a tender, grant, or public notice.', icon: 'Shield' }
        ]
    },
    ngo: {
        listTitle: "Recent Initiatives",
        actions: [
            { name: "Manage All Content", href: "/dashboard/manage", icon: Heart },
            { name: "Organization Settings", href: "/dashboard/settings", icon: Building }
        ],
        creatableContentTypes: [
            { type: 'job', title: 'Job', description: 'Post a role for your organization.', icon: 'Briefcase' },
            { type: 'project', title: 'Project / Event', description: 'Detail a project, event, or initiative.', icon: 'Heart' }
        ]
    }
};

function DashboardSkeleton() {
    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="h-10 w-72 bg-slate-200 rounded-md mb-10"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="h-36 bg-slate-200 rounded-2xl"></div>
                    <div className="h-36 bg-slate-200 rounded-2xl"></div>
                    <div className="h-36 bg-slate-200 rounded-2xl"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl"></div>
                    <div className="lg:col-span-1 h-64 bg-slate-200 rounded-2xl"></div>
                </div>
            </div>
        </div>
    );
}

async function DashboardContent() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) redirect('/select-role');

    const config = roleConfig[profile.role] || roleConfig.company;
    
    let stats: any = {};
    let mainListItems: any[] = [];
    
    const [jobs, programs, initiatives, services] = await Promise.all([
        supabase.from('jobs').select('id, title, created_at', { count: 'exact' }).eq('organization_id', user.id),
        supabase.from('programs').select('id, title, created_at', { count: 'exact' }).eq('organization_id', user.id),
        supabase.from('initiatives').select('id, title, type, created_at', { count: 'exact' }).eq('organization_id', user.id),
        supabase.from('services').select('id, title, created_at', { count: 'exact' }).eq('organization_id', user.id),
    ]);
    
    const allItems = [
        ...(jobs.data || []).map(item => ({ ...item, type: 'job' })),
        ...(programs.data || []).map(item => ({ ...item, type: 'program' })),
        ...(initiatives.data || []).map(item => ({ ...item, type: item.type?.toLowerCase() || 'project' })),
        ...(services.data || []).map(item => ({ ...item, type: 'service' }))
    ];
    
    mainListItems = allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
    
    const totalPosts = (jobs.count ?? 0) + (programs.count ?? 0) + (initiatives.count ?? 0) + (services.count ?? 0);
    stats = { posts: totalPosts, applicants: 37, views: 258 };
    
    const statCards = [ { title: "Total Postings", value: stats.posts, icon: Briefcase }, { title: "Total Applicants", value: stats.applicants, icon: Users }, { title: "Profile Views", value: stats.views, icon: Eye } ];
    const primaryAction = { name: "Create New...", href: "/dashboard/create", icon: PlusCircle };

    return (
       <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-600 mt-2 text-lg">Welcome back, {profile.organization_name || profile.full_name}!</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <button className="p-3 rounded-full bg-white border text-slate-600 hover:bg-slate-100"><Bell size={20} /></button>
                        <Link href={primaryAction.href} className="bg-sky-600 text-white font-semibold py-3 px-5 rounded-lg flex items-center gap-2 shadow-lg shadow-sky-500/30 hover:bg-sky-700">
                            <primaryAction.icon size={20} />{primaryAction.name}
                        </Link>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map(card => (
                        <div key={card.title} className="bg-white p-6 rounded-2xl shadow-sm border">
                            <div className="flex justify-between items-center"><h3 className="font-semibold text-slate-600">{card.title}</h3><card.icon className="text-slate-400" size={24} /></div>
                            <p className="text-4xl font-extrabold text-slate-900 mt-4">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-xl font-bold text-slate-800">{config.listTitle}</h3>
                                <Link href="/dashboard/manage" className="text-sm font-semibold text-sky-600 hover:underline">Manage All</Link>
                            </div>
                            <div className="space-y-4">
                                {mainListItems.length > 0 ? (
                                    mainListItems.map(item => (
                                        <div key={item.id} className="p-4 rounded-lg bg-slate-50 border flex justify-between items-center hover:border-sky-500 transition-colors">
                                            <p className="font-bold text-slate-800">{item.title}</p>
                                            <span className={`text-xs font-bold capitalize px-3 py-1 rounded-full ${summaryTypeConfig[item.type]?.className || summaryTypeConfig.default.className}`}>
                                                {item.type}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                        <Briefcase className="mx-auto text-slate-400" size={40} />
                                        <p className="mt-4 font-semibold text-slate-600">You have no active items yet.</p>
                                        <Link href="/dashboard/create" className="mt-2 text-sm font-semibold text-sky-600 hover:underline">
                                            Create something now
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
                            <h3 className="text-xl font-bold text-slate-800 mb-5">Quick Actions</h3>
                            <ul className="space-y-3">
                                {config.actions.map((action: any) => (
                                    <li key={action.name}>
                                        <Link href={action.href} className="group flex items-center gap-4 p-4 rounded-xl bg-slate-100 hover:bg-sky-500 hover:text-white transition-all">
                                            <action.icon className="text-slate-600 group-hover:text-white" />
                                            <span className="font-semibold text-slate-800 group-hover:text-white">{action.name}</span>
                                            <ArrowRight className="ml-auto text-slate-400 group-hover:text-white" size={16} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                </div>
            </div>
       </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}