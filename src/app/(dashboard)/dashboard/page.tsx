import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link'; // <-- FIX: Import Link
import { Suspense } from 'react';
import { 
    PlusCircle, 
    Briefcase, 
    Users, 
    Eye, 
    Edit, 
    Building, 
    Search, 
    ArrowRight, 
    Bell, 
    Lightbulb 
} from 'lucide-react'; // <-- FIX: Import all necessary icons

// --- SKELETON LOADER ---
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

// --- MAIN DASHBOARD CONTENT ---
async function DashboardContent() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) redirect('/select-role');

    const isIndividual = profile.role === 'individual';
    let stats: any = {};
    let activeJobs: any[] = [];
    let recentIdeas: any[] = [];
    
    if (isIndividual) {
        const { data: ideas, count: ideaCount } = await supabase.from('ideas').select('*', { count: 'exact' }).eq('author_id', user.id);
        recentIdeas = ideas?.slice(0, 5) || [];
        stats = { views: 127, apps: 5, ideas: ideaCount ?? 0 };
    } else {
        const { data: jobs, count: jobCount } = await supabase.from('jobs').select('id, title, status, created_at', { count: 'exact' }).eq('organization_id', user.id);
        activeJobs = jobs?.slice(0, 5) || [];
        stats = { posts: jobCount ?? 0, applicants: 37, views: 258 };
    }
    
    const statCards = isIndividual 
        ? [ { title: "Profile Views", value: stats.views, icon: Eye }, { title: "Applications Sent", value: stats.apps, icon: Users }, { title: "Ideas Submitted", value: stats.ideas, icon: Lightbulb } ]
        : [ { title: "Active Job Postings", value: stats.posts, icon: Briefcase }, { title: "Total Applicants", value: stats.applicants, icon: Users }, { title: "Profile Views", value: stats.views, icon: Eye } ];

    const quickActions = isIndividual
        ? [ { name: "Edit My Profile", href: "/dashboard/settings", icon: Edit }, { name: "Submit a New Idea", href: "/dashboard/submit-idea", icon: PlusCircle }, { name: "Find a Job", href: "/opportunities", icon: Search } ]
        : [ { name: "Post a New Job", href: "/dashboard/post-job", icon: PlusCircle }, { name: "Search for Talent", href: "/professionals", icon: Search }, { name: "Profile & Settings", href: "/dashboard/settings", icon: Building } ];
    
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
                         <Link href={isIndividual ? "/dashboard/submit-idea" : "/dashboard/post-job"} className="bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-700">
                            <PlusCircle size={20} />{isIndividual ? "Submit Idea" : "Post Job"}
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
                        <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-bold text-slate-800">{isIndividual ? "My Recent Ideas" : "My Active Job Postings"}</h3><Link href={isIndividual ? "/ideas" : "/dashboard/jobs"} className="text-sm font-semibold text-blue-600 hover:underline">View All</Link></div>
                        <div className="space-y-4">
                            {isIndividual ? (
                                recentIdeas.length > 0 ? recentIdeas.map(idea => <div key={idea.id} className="p-4 rounded-lg bg-slate-50 border"><p className="font-bold text-slate-800">{idea.title}</p></div>) : <div className="text-center py-12 border-2 border-dashed rounded-lg"><Lightbulb className="mx-auto text-slate-400" size={40} /><p className="mt-4 font-semibold text-slate-600">You have not submitted any ideas yet.</p></div>
                            ) : (
                                activeJobs.length > 0 ? activeJobs.map(job => <div key={job.id} className="p-4 rounded-lg bg-slate-50 border flex justify-between items-center"><div><p className="font-bold text-slate-800">{job.title}</p></div><span className="text-xs font-bold capitalize px-3 py-1 rounded-full bg-green-100 text-green-800">{job.status}</span></div>) : <div className="text-center py-12 border-2 border-dashed rounded-lg"><Briefcase className="mx-auto text-slate-400" size={40} /><p className="mt-4 font-semibold text-slate-600">You have no active job postings.</p></div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-xl font-bold text-slate-800 mb-5">Quick Actions</h3>
                        <ul className="space-y-3">
                            {quickActions.map(action => (
                                <li key={action.name}><Link href={action.href} className="group flex items-center gap-4 p-4 rounded-xl bg-slate-100 hover:bg-blue-500 hover:text-white transition-all"><action.icon className="text-slate-600 group-hover:text-white" /><span className="font-semibold text-slate-800 group-hover:text-white">{action.name}</span><ArrowRight className="ml-auto text-slate-400 group-hover:text-white" size={16} /></Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- MAIN PAGE EXPORT ---
export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}
