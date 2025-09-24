"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Briefcase, Award, BookOpen, Heart, Shield, Rss, Info, Users, FileText, Landmark, Wrench, Package } from 'lucide-react';

const InfoCard = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-4">
            <Icon className="text-sky-500" size={20} />
            <span>{title}</span>
        </h2>
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
            {children}
        </div>
    </div>
);

const Tag = ({ text }: { text: string }) => (
    <span className="inline-block bg-sky-100 text-sky-800 text-sm font-medium px-3 py-1.5 rounded-full">
        {text}
    </span>
);

const JobListItem = ({ job }: { job: any }) => (
    <div className="py-4 px-2 hover:bg-slate-50 rounded-lg transition-colors">
        <h3 className="font-bold text-slate-800">{job.title}</h3>
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
            <span>{job.job_type || 'Full-time'}</span>
            <span>&bull;</span>
            <span>{job.location || 'Location not specified'}</span>
        </div>
    </div>
);

type Service = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  subcategory: string | null;
  price: string | null;
  image_url: string | null;
};

const ServiceCard = ({ service }: { service: Service }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
        {service.image_url ? (
            <div className="h-40 bg-slate-200"><img src={service.image_url} alt={service.title} className="w-full h-full object-cover" /></div>
        ) : (
            <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Package className="w-12 h-12 text-slate-400" />
            </div>
        )}
        <div className="p-5 flex flex-col flex-grow">
            <div className="flex-grow">
                {service.category && (
                    <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                        {service.category} {service.subcategory && `• ${service.subcategory}`}
                    </p>
                )}
                <h3 className="font-bold text-slate-800 mt-1 text-lg">{service.title}</h3>
                <p className="text-slate-600 text-sm mt-2 line-clamp-3">{service.description || "No description provided."}</p>
            </div>
            {service.price && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm font-semibold text-slate-700">{service.price}</p>
                </div>
            )}
        </div>
    </div>
);

const CompanyDetails = ({ profile }: { profile: any }) => (
    <InfoCard title="Company Details" icon={Building}>
        <p><strong>Industry:</strong> {profile.industry || 'N/A'}</p>
        <p><strong>Services:</strong></p>
        {profile.services && typeof profile.services === 'string' ? (
            <div className="flex flex-wrap gap-2 pt-1">
                {profile.services.split(',').map((service: string) => (
                    <Tag key={service.trim()} text={service.trim()} />
                ))}
            </div>
        ) : (
            <p className="text-xs italic">No specific services listed.</p>
        )}
    </InfoCard>
);

const UniversityDetails = ({ profile }: { profile: any }) => (
    <InfoCard title="University Details" icon={Landmark}>
        <p><strong>Accreditation:</strong> {profile.accreditation || 'N/A'}</p>
        <p><strong>Departments:</strong></p>
        {profile.departments?.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
                {profile.departments.map((dept: string) => <Tag key={dept} text={dept} />)}
            </div>
        ) : <p className="text-xs italic">No departments listed.</p>}
    </InfoCard>
);

const NgoDetails = ({ profile }: { profile: any }) => (
    <InfoCard title="NGO Details" icon={Heart}>
        <p><strong>Community Focus:</strong> {profile.community_focus || 'N/A'}</p>
        <p><strong>Members:</strong> {profile.members_count || 'N/A'}</p>
    </InfoCard>
);

const GovernmentDetails = ({ profile }: { profile: any }) => (
     <InfoCard title="Department Details" icon={Shield}>
        <p><strong>Public Services:</strong></p>
        {profile.public_services?.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
                {profile.public_services.map((service: string) => <Tag key={service} text={service} />)}
            </div>
        ) : <p className="text-xs italic">No public services listed.</p>}
    </InfoCard>
);

export default function OrganizationTabs({ profile, jobs, programs, initiatives, services }: { profile: any, jobs: any[], programs: any[], initiatives: any[], services: Service[] }) {
    const [activeTab, setActiveTab] = useState('about');

    const roleTabs: { [key: string]: { id: string, label: string, icon: React.ElementType }[] } = {
        company: [
            { id: 'about', label: 'About', icon: Info },
            { id: 'services', label: `Services (${services.length})`, icon: Wrench },
            { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
            { id: 'projects', label: `Projects (${initiatives.length})`, icon: Award },
        ],
        university: [
            { id: 'about', label: 'About', icon: Info },
            { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
            { id: 'programs', label: `Programs (${programs.length})`, icon: BookOpen },
        ],
        ngo: [
            { id: 'about', label: 'About', icon: Info },
            { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
            { id: 'projects', label: `Projects (${initiatives.length})`, icon: Heart },
        ],
        government: [
            { id: 'about', label: 'About', icon: Info },
            { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
            { id: 'tenders', label: `Tenders (${initiatives.length})`, icon: Rss },
        ]
    };

    const tabs = roleTabs[profile.role] || roleTabs.company;

    return (
        <div>
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'about' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <InfoCard title="Detailed Description" icon={FileText}>
                                        <p className="whitespace-pre-line">{profile.bio || "No description provided."}</p>
                                    </InfoCard>
                                </div>
                                <div className="md:col-span-1 space-y-6">
                                    {profile.role === 'company' && <CompanyDetails profile={profile}/>}
                                    {profile.role === 'university' && <UniversityDetails profile={profile}/>}
                                    {profile.role === 'ngo' && <NgoDetails profile={profile}/>}
                                    {profile.role === 'government' && <GovernmentDetails profile={profile}/>}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'services' && (
                            <div>
                                {services.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {services.map(service => (
                                            <ServiceCard key={service.id} service={service} />
                                        ))}
                                    </div>
                                ) : (
                                    <InfoCard title="Services" icon={Wrench}>
                                        <p>This company has not listed any specific services yet.</p>
                                    </InfoCard>
                                )}
                            </div>
                        )}

                        {activeTab === 'jobs' && (
                             <InfoCard title="Open Positions" icon={Briefcase}>
                                {jobs.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {jobs.map(job => <JobListItem key={job.id} job={job}/>)}
                                    </div>
                                ) : <p>This organization has no open positions at the moment.</p>}
                            </InfoCard>
                        )}

                        {activeTab === 'programs' && (
                             <InfoCard title="Academic Programs" icon={BookOpen}>
                                {programs.length > 0 ? (
                                      <div className="divide-y divide-slate-100">
                                        {programs.map((prog: any) => 
                                            <div key={prog.id} className="py-3">
                                                <h4 className="font-bold text-slate-800">{prog.title}</h4>
                                                <p className="text-xs text-slate-500">{prog.department} - {prog.duration}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : <p>This university has no programs listed.</p>}
                            </InfoCard>
                        )}
                        
                        {activeTab === 'projects' && (
                            <InfoCard title="Projects & Initiatives" icon={Award}>
                                {initiatives.filter((i: any) => i.type === 'Project').length > 0 ? (
                                      <div className="divide-y divide-slate-100">
                                        {initiatives.filter((i: any) => i.type === 'Project').map((init: any) => 
                                            <div key={init.id} className="py-3">
                                                <h4 className="font-bold text-slate-800">{init.title}</h4>
                                                <p className="text-xs text-slate-500">{init.status}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : <p>No projects are currently listed.</p>}
                            </InfoCard>
                        )}
                        
                         {activeTab === 'tenders' && (
                            <InfoCard title="Tenders & Announcements" icon={Rss}>
                                {initiatives.filter((i: any) => i.type !== 'Project').length > 0 ? (
                                      <div className="divide-y divide-slate-100">
                                        {initiatives.filter((i: any) => i.type !== 'Project').map((init: any) => 
                                            <div key={init.id} className="py-3">
                                                <h4 className="font-bold text-slate-800">{init.title}</h4>
                                                <p className="text-xs text-slate-500">{init.status} - {init.type}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : <p>No tenders or announcements are currently listed.</p>}
                            </InfoCard>
                         )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}