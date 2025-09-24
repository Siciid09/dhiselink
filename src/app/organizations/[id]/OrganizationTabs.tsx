"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Briefcase, Award, BookOpen, Heart, Shield, Rss, Info, Users, FileText, Landmark, Wrench, Package, ArrowRight } from 'lucide-react';

const Card = ({ children, href }: { children: React.ReactNode, href: string }) => ( <Link href={href} className="block group"><motion.div whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }} className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">{children}</motion.div></Link> );
const CardHeader = ({ icon: Icon, title, tag }: { icon: React.ElementType, title: string, tag?: string | null }) => ( <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="bg-slate-100 p-2 rounded-lg"><Icon className="h-6 w-6 text-sky-600" /></div><h3 className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">{title}</h3></div>{tag && <span className="text-xs font-bold capitalize px-3 py-1 rounded-full bg-slate-100 text-slate-700">{tag}</span>}</div> );
const CardFooter = ({ text }: { text: string }) => ( <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-end text-sm font-semibold text-sky-600"><span>{text}</span><ArrowRight className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" /></div> );
const JobCard = ({ job }: { job: any }) => ( <Card href={`/opportunities/${job.id}`}><CardHeader icon={Briefcase} title={job.title} tag={job.job_type} /><p className="text-sm text-slate-500 my-4 flex-grow">{job.location}</p><CardFooter text="View Job" /></Card> );
const ProgramCard = ({ program }: { program: any }) => ( <Card href={`/opportunities/${program.id}`}><CardHeader icon={BookOpen} title={program.title} tag={program.duration} /><p className="text-sm text-slate-500 my-4 flex-grow">{program.department}</p><CardFooter text="View Program" /></Card> );
const InitiativeCard = ({ init }: { init: any }) => ( <Card href={`/opportunities/${init.id}`}><CardHeader icon={Shield} title={init.title} tag={init.type} /><p className="text-sm text-slate-600 my-4 flex-grow line-clamp-2">{init.description || "No description provided."}</p><CardFooter text="View Initiative" /></Card> );
const ServiceCard = ({ service }: { service: any }) => ( <Card href={`/opportunities/${service.id}`}><CardHeader icon={Wrench} title={service.title} tag={service.category} /><p className="text-sm text-slate-600 my-4 flex-grow line-clamp-2">{service.description || "No description provided."}</p><CardFooter text="View Service" /></Card> );
const InfoCard = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => ( <div className="bg-white p-6 rounded-xl shadow-sm border"><h2 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-4"><Icon className="text-sky-500" size={20} /><span>{title}</span></h2><div className="space-y-3 text-slate-600 text-sm leading-relaxed">{children}</div></div> );
const CompanyDetails = ({ profile }: { profile: any }) => ( <InfoCard title="Company Details" icon={Building}><p><strong>Industry:</strong> {profile.industry || 'N/A'}</p></InfoCard> );
const UniversityDetails = ({ profile }: { profile: any }) => ( <InfoCard title="University Details" icon={Landmark}><p><strong>Accreditation:</strong> {profile.accreditation || 'N/A'}</p></InfoCard> );
const NgoDetails = ({ profile }: { profile: any }) => ( <InfoCard title="NGO Details" icon={Heart}><p><strong>Community Focus:</strong> {profile.community_focus || 'N/A'}</p></InfoCard> );

interface OrganizationTabsProps { profile: any; jobs?: any[]; programs?: any[]; initiatives?: any[]; services?: any[]; }

export default function OrganizationTabs({ profile, jobs = [], programs = [], initiatives = [], services = [] }: OrganizationTabsProps) {
    const [activeTab, setActiveTab] = useState('about');
    const roleTabs: { [key: string]: { id: string, label: string, icon: React.ElementType }[] } = {
        company: [ { id: 'about', label: 'About', icon: Info }, { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase }, { id: 'services', label: `Services (${services.length})`, icon: Wrench }, ],
        university: [ { id: 'about', label: 'About', icon: Info }, { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase }, { id: 'programs', label: `Programs (${programs.length})`, icon: BookOpen }, ],
        ngo_gov: [ { id: 'about', label: 'About', icon: Info }, { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase }, { id: 'initiatives', label: `Initiatives (${initiatives.length})`, icon: Shield }, ],
        other: [ { id: 'about', label: 'About', icon: Info }, { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase }, { id: 'initiatives', label: `Initiatives (${initiatives.length})`, icon: Shield }, ]
    };
    const tabs = roleTabs[profile.role] || roleTabs.company;
    const EmptyState = ({ message }: { message: string }) => ( <div className="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed"><p className="text-slate-500 font-medium">{message}</p></div> );

    return (
        <div>
            <div className="border-b border-slate-200"><nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">{tabs.map(tab => ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${ activeTab === tab.id ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}><tab.icon size={16} />{tab.label}</button> ))}</nav></div>
            <div className="mt-8">
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                        {activeTab === 'about' && ( <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="md:col-span-2"><InfoCard title="About this Organization" icon={FileText}><p className="whitespace-pre-line text-slate-600 leading-relaxed">{profile.bio || "No description provided."}</p></InfoCard></div><div className="md:col-span-1 space-y-6">{profile.role === 'company' && <CompanyDetails profile={profile}/>}{profile.role === 'university' && <UniversityDetails profile={profile}/>}{profile.role === 'ngo_gov' && <NgoDetails profile={profile}/>}</div></div> )}
                        {activeTab === 'jobs' && ( jobs.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{jobs.map(job => <JobCard key={job.id} job={job} />)}</div> : <EmptyState message="This organization has no open jobs." /> )}
                        {activeTab === 'programs' && ( programs.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{programs.map(prog => <ProgramCard key={prog.id} program={prog} />)}</div> : <EmptyState message="This university has no programs listed." /> )}
                        {activeTab === 'services' && ( services.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{services.map(srv => <ServiceCard key={srv.id} service={srv} />)}</div> : <EmptyState message="This company has no services listed." /> )}
                        {activeTab === 'initiatives' && ( initiatives.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{initiatives.map(init => <InitiativeCard key={init.id} init={init} />)}</div> : <EmptyState message="This organization has no initiatives listed." /> )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}