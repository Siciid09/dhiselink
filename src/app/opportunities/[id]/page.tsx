import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { MapPin, Briefcase, Calendar, ArrowRight, Building, DollarSign } from 'lucide-react';

const InfoPill = ({ icon, text, label }: { icon: React.ReactNode, text: string | null, label: string }) => (
    text ? <div className="flex items-start gap-3">
        <div className="text-blue-600 flex-shrink-0 mt-1">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <span className="font-semibold text-slate-800 capitalize">{text}</span>
        </div>
    </div> : null
);

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: job } = await supabase.from('jobs').select('*').eq('id', params.id).single();

    if (!job) notFound();
    
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 mb-8">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <img 
                              src={job.organization_logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${job.organization_name}`}
                              alt={`${job.organization_name} logo`} 
                              className="h-24 w-24 object-contain rounded-xl border p-2 bg-white flex-shrink-0" 
                            />
                            <div className="flex-grow">
                                <p className="font-bold text-blue-600 uppercase tracking-wide text-sm">{job.organization_name}</p>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">{job.title}</h1>
                                <div className="flex items-center gap-4 mt-3 text-slate-500">
                                  <span className="flex items-center gap-1.5"><MapPin size={16} />{job.location}</span>
                                  <span className="flex items-center gap-1.5 capitalize"><Briefcase size={16} />{job.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content & Sidebar */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md border border-slate-200">
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">Job Description</h2>
                            <div className="prose prose-lg max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: job.description?.replace(/\n/g, '<br />') || '' }} />

                            {job.requirements && job.requirements.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800">Requirements</h2>
                                    <ul className="list-disc list-inside space-y-2 text-slate-600 marker:text-blue-500">
                                        {job.requirements.map((req: string, index: number) => <li key={index}>{req}</li>)}
                                    </ul>
                                </>
                            )}
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <a href={job.external_link || '#'} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Apply Now <ArrowRight size={18}/>
                            </a>
                            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-5">
                                <InfoPill icon={<Building size={20} />} label="Industry" text={job.industry} />
                                <InfoPill icon={<DollarSign size={20} />} label="Salary" text={job.salary_range} />
                                {job.deadline && <InfoPill icon={<Calendar size={20} />} label="Apply by" text={new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}