"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
// --- CHANGE IS HERE: Imported the Calendar icon ---
import { Building, Briefcase, Award, BookOpen, Heart, Shield, Rss, Info, Users, FileText, Landmark, Wrench, Package, ArrowRight, Camera, UserCheck, GitBranch, Target, Star, Contact, Megaphone, Milestone, GraduationCap, Calendar, MapPin } from 'lucide-react';

// --- Helper function to ensure we always have an array ---
const ensureArray = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string' && data.length > 0) return data.split(',').map(item => item.trim());
    return [];
};

// --- Reusable Components ---
const Card = ({ children, href }: { children: React.ReactNode, href: string }) => ( <Link href={href} className="block group"><motion.div whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }} className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">{children}</motion.div></Link> );
const CardHeader = ({ icon: Icon, title, tag }: { icon: React.ElementType, title: string, tag?: string | null }) => ( <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="bg-slate-100 p-2 rounded-lg"><Icon className="h-6 w-6 text-sky-600" /></div><h3 className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">{title}</h3></div>{tag && <span className="text-xs font-bold capitalize px-3 py-1 rounded-full bg-slate-100 text-slate-700">{tag}</span>}</div> );
const CardFooter = ({ text }: { text: string }) => ( <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-end text-sm font-semibold text-sky-600"><span>{text}</span><ArrowRight className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" /></div> );
const InfoCard = ({ title, children, icon: Icon, fullWidth = false }: { title: string, children: React.ReactNode, icon: React.ElementType, fullWidth?: boolean }) => ( <div className={`bg-white p-6 rounded-xl shadow-sm border ${fullWidth ? 'md:col-span-2' : ''}`}><h2 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-4"><Icon className="text-sky-500" size={20} /><span>{title}</span></h2><div className="space-y-3 text-slate-600 text-sm leading-relaxed">{children}</div></div> );
const EmptyState = ({ message }: { message: string }) => ( <div className="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed"><p className="text-slate-500 font-medium">{message}</p></div> );
const Lightbox = ({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) => ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"><motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={imageUrl} alt="Lightbox" className="max-w-full max-h-full object-contain rounded-lg" /></motion.div> );

// --- Card Components for Listings ---

// --- CHANGE IS HERE: The JobCard now displays the deadline ---
const JobCard = ({ job }: { job: any }) => (
    <Card href={`/opportunities/jobs/${job.id}`}>
        <CardHeader icon={Briefcase} title={job.title} tag={job.type} />
        <div className="text-sm text-slate-500 my-4 flex-grow space-y-2">
            <p className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</p>
            {job.deadline && (
                <p className="flex items-center gap-1.5 font-medium text-red-600">
                    <Calendar size={14} />
                    Closes: {new Date(job.deadline).toLocaleDateString()}
                </p>
            )}
        </div>
        <CardFooter text="View Job" />
    </Card>
);

const ProgramCard = ({ program }: { program: any }) => ( <Card href={`/opportunities/programs/${program.id}`}><CardHeader icon={BookOpen} title={program.title} /><p className="text-sm text-slate-500 my-4 flex-grow">{program.department}</p><CardFooter text="View Program" /></Card> );
const InitiativeCard = ({ init }: { init: any }) => ( <Card href={`/opportunities/initiatives/${init.id}`}><CardHeader icon={Shield} title={init.title} tag={init.type} /><p className="text-sm text-slate-600 my-4 flex-grow line-clamp-2">{init.description || "No description provided."}</p><CardFooter text="View Initiative" /></Card> );
const ServiceCard = ({ service }: { service: any }) => ( <Card href={`/opportunities/services/${service.id}`}><CardHeader icon={Wrench} title={service.title} /><p className="text-sm text-slate-600 my-4 flex-grow line-clamp-2">{service.short_description || "No description provided."}</p><CardFooter text="View Service" /></Card> );


// --- Expanded Details Components for "About" Tab ---
const UniversityDetails = ({ profile }: { profile: any }) => (
    <InfoCard title="University Details" icon={Landmark}>
        <p><strong>Accreditation:</strong> {profile.acreditation || 'N/A'}</p>
        {ensureArray(profile.faculties).length > 0 && <p><strong>Faculties:</strong> {ensureArray(profile.faculties).join(', ')}</p>}
        {ensureArray(profile.departments).length > 0 && <p><strong>Departments:</strong> {ensureArray(profile.departments).join(', ')}</p>}
    </InfoCard>
);
const NgoDetails = ({ profile }: { profile: any }) => (
    <InfoCard title="NGO Details" icon={Heart}>
        <p><strong>Community Focus:</strong> {profile.community_focus || 'N/A'}</p>
        {profile.members_count && <p><strong>Members:</strong> {profile.members_count}</p>}
    </InfoCard>
);

interface OrganizationTabsProps { profile: any; jobs?: any[]; programs?: any[]; initiatives?: any[]; services?: any[]; galleries?: any[]; }

export default function OrganizationTabs({ profile, jobs = [], programs = [], initiatives = [], services = [], galleries = [] }: OrganizationTabsProps) {
    const [activeTab, setActiveTab] = useState('about');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const baseTabs = [ { id: 'about', label: 'About', icon: Info }, { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase }, ];
    const roleSpecificTabs = {
        company: [ ...baseTabs, { id: 'services', label: `Services (${services.length})`, icon: Wrench }, { id: 'gallery', label: `Gallery (${galleries.length})`, icon: Camera } ],
        university: [ ...baseTabs, { id: 'programs', label: `Programs (${programs.length})`, icon: BookOpen }, { id: 'gallery', label: `Gallery (${galleries.length})`, icon: Camera }, { id: 'students', label: 'Students', icon: GraduationCap } ],
        ngo: [ ...baseTabs, { id: 'initiatives', label: `Initiatives (${initiatives.length})`, icon: Shield }, { id: 'gallery', label: `Gallery (${galleries.length})`, icon: Camera } ],
    };
    const tabs = roleSpecificTabs[profile.organization_type?.toLowerCase() as keyof typeof roleSpecificTabs] || roleSpecificTabs.company;
    
    return (
        <div>
            <AnimatePresence>{lightboxImage && <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />}</AnimatePresence>
            <div className="border-b border-slate-200"><nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">{tabs.map(tab => ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${ activeTab === tab.id ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}><tab.icon size={16} />{tab.label}</button> ))}</nav></div>
            <div className="mt-8">
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                        {activeTab === 'about' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard title="About this Organization" icon={FileText} fullWidth><p className="whitespace-pre-line text-slate-600 leading-relaxed">{profile.bio || "No description provided."}</p></InfoCard>
                                {profile.mission_vision && <InfoCard title="Mission & Vision" icon={Target} fullWidth><p className="whitespace-pre-line">{profile.mission_vision}</p></InfoCard>}
                                {profile.organization_type?.toLowerCase() === 'university' && <UniversityDetails profile={profile}/>}
                                {profile.organization_type?.toLowerCase() === 'ngo' && <NgoDetails profile={profile}/>}

                                {ensureArray(profile.key_services).length > 0 && <InfoCard title="Key Services" icon={Wrench}>{ensureArray(profile.key_services).map((s:string) => <p key={s}>- {s}</p>)}</InfoCard>}
                                {ensureArray(profile.products_offerings).length > 0 && <InfoCard title="Products" icon={Package}>{ensureArray(profile.products_offerings).map((p:string) => <p key={p}>- {p}</p>)}</InfoCard>}
                                {ensureArray(profile.operating_regions).length > 0 && <InfoCard title="Operating Regions" icon={GitBranch}>{ensureArray(profile.operating_regions).map((r:string) => <p key={r}>- {r}</p>)}</InfoCard>}
                                {ensureArray(profile.awards).length > 0 && <InfoCard title="Awards & Recognition" icon={Award}>{ensureArray(profile.awards).map((a:any) => <p key={a.title}><strong>{a.title}</strong> ({a.year})</p>)}</InfoCard>}
                                {ensureArray(profile.key_contacts).length > 0 && <InfoCard title="Key Contacts" icon={Contact}>{ensureArray(profile.key_contacts).map((c:any) => <p key={c.email}><strong>{c.name}</strong>, {c.title}</p>)}</InfoCard>}
                                {profile.announcements && <InfoCard title="Announcements" icon={Megaphone}><p className="whitespace-pre-line">{profile.announcements}</p></InfoCard>}

                                {profile.organization_type?.toLowerCase() === 'university' && ensureArray(profile.research_projects).length > 0 && <InfoCard title="Research Projects" icon={Milestone} fullWidth>{ensureArray(profile.research_projects).map((p:string) => <p key={p}>- {p}</p>)}</InfoCard>}
                                {profile.organization_type?.toLowerCase() === 'ngo' && ensureArray(profile.projects).length > 0 && <InfoCard title="Current Projects" icon={Milestone} fullWidth>{ensureArray(profile.projects).map((p:any) => <p key={p.name}><strong>{p.name}</strong></p>)}</InfoCard>}
                            </div>
                        )}
                        {activeTab === 'jobs' && ( jobs.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{jobs.map(job => <JobCard key={job.id} job={job} />)}</div> : <EmptyState message="This organization has no open jobs." /> )}
                        {activeTab === 'programs' && ( programs.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{programs.map(prog => <ProgramCard key={prog.id} program={prog} />)}</div> : <EmptyState message="This university has no programs listed." /> )}
                        {activeTab === 'services' && ( services.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{services.map(srv => <ServiceCard key={srv.id} service={srv} />)}</div> : <EmptyState message="This company has no services listed." /> )}
                        {activeTab === 'initiatives' && ( initiatives.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{initiatives.map(init => <InitiativeCard key={init.id} init={init} />)}</div> : <EmptyState message="This organization has no initiatives listed." /> )}
                        {activeTab === 'gallery' && ( galleries.length > 0 ? (
                            <div className="space-y-8">
                                {galleries.map(gallery => (
                                    <div key={gallery.id}>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-4">{gallery.title}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {ensureArray(gallery.images)?.map((img: string, idx: number) => (
                                                <motion.div key={idx} whileHover={{ scale: 1.05 }} onClick={() => setLightboxImage(img)} className="cursor-pointer rounded-lg overflow-hidden shadow-md aspect-w-1 aspect-h-1">
                                                    <img src={img} alt={`${gallery.title} image ${idx + 1}`} className="w-full h-full object-cover" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState message="This organization has not created any galleries yet." />)}
                        {activeTab === 'students' && ( <EmptyState message="Student profiles will be featured here in the future." /> )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
