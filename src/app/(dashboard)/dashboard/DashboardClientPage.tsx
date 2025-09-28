"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Edit, PlusCircle, Settings, Eye, Briefcase, Wrench, Camera, Lightbulb, Landmark, Heart } from 'lucide-react';

// --- Reusable UI Components for the Dashboard ---
const StatCard = ({ label, value, icon: Icon }: { label: string, value: string | number, icon: React.ElementType }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <Icon size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </div>
);

const ActionCard = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => (
    <Link href={href} className="block p-6 bg-slate-50 hover:bg-slate-100 hover:shadow-md transition-all rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white text-slate-600 rounded-lg border">
                <Icon size={20} />
            </div>
            <p className="font-semibold text-slate-800">{label}</p>
        </div>
    </Link>
);

const RecentItemCard = ({ item, type }: { item: any, type: string }) => {
    const details = {
        Job: { icon: Briefcase, href: `/opportunities/jobs/${item.id}` },
        Service: { icon: Wrench, href: `/opportunities/services/${item.id}` },
        Gallery: { icon: Camera, href: `/galleries/${item.id}` }, // Assuming a future gallery detail page
        Idea: { icon: Lightbulb, href: `/ideas/${item.id}` },
    };
    const detail = details[type as keyof typeof details] || details.Job;
    
    return (
        <div className="p-4 bg-white rounded-lg border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <detail.icon className="text-slate-500" size={20} />
                <span className="font-medium text-slate-700">{item.title}</span>
            </div>
            <Link href={detail.href} className="text-sm font-semibold text-amber-600 hover:underline">View</Link>
        </div>
    );
};


// --- The Main Dashboard Component ---
export default function DashboardClientPage({ profile, userContent }: { profile: any, userContent: any }) {
    const isIndividual = profile.role === 'individual';
    const displayName = isIndividual ? profile.full_name : profile.organization_name;

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Dashboard</h1>
                    <p className="text-slate-600 mt-1">Welcome back, {displayName}!</p>
                </div>
                <Link href="/dashboard/create" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors self-start">
                    <PlusCircle size={20} /> Create New...
                </Link>
            </div>

            {/* Main grid layout for the dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Main Content Area (2 columns wide) --- */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Role-specific stat cards */}
                    {!isIndividual && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard label="Jobs Posted" value={userContent.jobs?.length || 0} icon={Briefcase} />
                            <StatCard label="Services Offered" value={userContent.services?.length || 0} icon={Wrench} />
                            <StatCard label="Galleries" value={userContent.galleries?.length || 0} icon={Camera} />
                        </div>
                    )}

                    {/* Recent Activity Section */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
                            <Link href="/dashboard/manage" className="text-sm font-semibold text-amber-600 hover:underline">Manage All</Link>
                        </div>
                        <div className="space-y-3">
                            {isIndividual ? (
                                userContent.ideas?.length > 0 ? userContent.ideas.map((item: any) => <RecentItemCard key={item.id} item={item} type="Idea" />) : <p className="text-slate-500 text-center py-8">You haven't submitted any ideas yet.</p>
                            ) : (
                                // A combined list for organizations
                                [...userContent.jobs, ...userContent.services, ...userContent.galleries].length > 0 ? (
                                    <>
                                        {userContent.jobs.map((item: any) => <RecentItemCard key={item.id} item={item} type="Job" />)}
                                        {userContent.services.map((item: any) => <RecentItemCard key={item.id} item={item} type="Service" />)}
                                        {userContent.galleries.map((item: any) => <RecentItemCard key={item.id} item={item} type="Gallery" />)}
                                    </>
                                ) : <p className="text-slate-500 text-center py-8">You haven't posted any content yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Sidebar Area (1 column wide) --- */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <ActionCard href={`/${isIndividual ? 'professionals' : 'organizations'}/${profile.slug}`} label="View Public Profile" icon={Eye} />
                            <ActionCard href="/dashboard/settings" label="Edit Profile & Settings" icon={Settings} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}