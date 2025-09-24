import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MapPin, Briefcase, Calendar, Building, DollarSign, Clock, Users, FileText, Landmark, Package } from 'lucide-react';

const DetailPill = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | null }) => { if (!value) return null; return ( <div className="flex items-start gap-3"><Icon className="text-sky-600 flex-shrink-0 mt-1 h-5 w-5" /><div><p className="text-sm text-slate-500">{label}</p><p className="font-semibold text-slate-800 capitalize">{value}</p></div></div> ); };
const RequirementsList = ({ items, title }: { items: string[] | null, title: string }) => { if (!items || items.length === 0) return null; return ( <div><h3 className="text-2xl font-bold mt-8 mb-4 text-slate-800">{title}</h3><ul className="list-disc list-inside space-y-2 text-slate-600 marker:text-sky-500 prose-lg">{items.map((item, index) => <li key={index}>{item}</li>)}</ul></div> ); };
const AttachmentsList = ({ items }: { items: string[] | null }) => { if (!items || items.length === 0) return null; return ( <div><h3 className="text-2xl font-bold mt-8 mb-4 text-slate-800">Attachments</h3><div className="space-y-2">{items.map((url, index) => ( <a href={url} key={index} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border"><FileText className="h-5 w-5 text-slate-500" /><span className="font-semibold text-sky-600 truncate">{url.split('/').pop()?.split('-').slice(1).join('-')}</span></a> ))}</div></div> ); };

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: opportunity } = await supabase.from('opportunities_view').select('*').eq('id', params.id).single();
    if (!opportunity) { notFound(); }
    
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 mb-8">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <img src={opportunity.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${opportunity.organization_name}`} alt={`${opportunity.organization_name} logo`} className="h-24 w-24 object-contain rounded-xl border p-2 bg-white flex-shrink-0" />
                            <div className="flex-grow">
                                <Link href={`/organizations/${opportunity.organization_id}`} className="font-bold text-sky-600 hover:underline uppercase tracking-wide text-sm">{opportunity.organization_name}</Link>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">{opportunity.title}</h1>
                                <div className="flex items-center gap-4 mt-3 text-slate-500">
                                    {opportunity.location && <span className="flex items-center gap-1.5"><MapPin size={16} />{opportunity.location}</span>}
                                    <span className="flex items-center gap-1.5 capitalize"><Package size={16} />{opportunity.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md border border-slate-200">
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">Details</h2>
                            <div className="prose prose-lg max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: opportunity.description?.replace(/\n/g, '<br />') || '' }} />
                            <RequirementsList items={opportunity.requirements} title="Requirements" />
                            <AttachmentsList items={opportunity.attachments} />
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <a href="#" className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-sky-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Apply Now <ArrowRight className="transform" size={18}/></a>
                            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-5">
                                <DetailPill icon={DollarSign} label="Compensation" value={opportunity.salary_range} />
                                <DetailPill icon={DollarSign} label="Funding / Budget" value={opportunity.funding_amount} />
                                <DetailPill icon={Landmark} label="Venue" value={opportunity.venue} />
                                <DetailPill icon={Clock} label="Event Date" value={opportunity.event_datetime ? new Date(opportunity.event_datetime).toLocaleString() : null} />
                                <DetailPill icon={Calendar} label="Application Deadline" value={opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : null} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}