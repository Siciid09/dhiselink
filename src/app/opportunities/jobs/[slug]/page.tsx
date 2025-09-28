import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, DollarSign, Building } from 'lucide-react';

// Helper function to format dates
const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
    const supabase = createClient();
    
    const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', params.slug)
        .single();
        
    if (error || !job) {
        notFound();
    }

    // Smart "Apply" link: uses the external link if it exists, otherwise creates a mailto link.
    const applyLink = job.external_link || `mailto:${job.posted_by_email}?subject=Application for ${job.title}`;

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto max-w-4xl py-16 px-4">
                <Link href="/opportunities" className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 mb-8 font-semibold transition-colors">
                    <ArrowLeft size={18} />
                    Back to All Opportunities
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12">
                    {/* --- Main Content (Left Column) --- */}
                    <main className="md:col-span-2">
                        <div className="flex items-center gap-4 mb-6">
                            <img 
                                src={job.organization_logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${job.organization_name}`} 
                                alt={`${job.organization_name} logo`}
                                className="h-16 w-16 object-contain rounded-xl border p-1 bg-white"
                            />
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900">{job.title}</h1>
                                <p className="text-lg text-slate-600 font-medium flex items-center gap-2 mt-1">
                                    <Building size={16}/> {job.organization_name}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Job Description</h2>
                            {/* This safely renders the HTML from your Rich Text Editor */}
                            <div 
                                className="prose prose-slate max-w-none" 
                                dangerouslySetInnerHTML={{ __html: job.description || '' }} 
                            />
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Requirements & Qualifications</h2>
                            <div 
                                className="prose prose-slate max-w-none" 
                                dangerouslySetInnerHTML={{ __html: job.requirements || '' }} 
                            />
                        </div>
                    </main>

                    {/* --- Sidebar (Right Column) --- */}
                    <aside className="md:col-span-1">
                        <div className="sticky top-24 bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
                            <a 
                                href={applyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full block text-center py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-amber-500 transition-colors"
                            >
                                Apply Now
                            </a>
                            <div className="mt-6 space-y-4">
                                <h3 className="font-bold text-slate-900">Job Overview</h3>
                                <div className="text-sm text-slate-600 space-y-3">
                                    <p className="flex items-start gap-3">
                                        <MapPin size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                        <span><strong>Location:</strong> {job.location}</span>
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <Briefcase size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                        <span className="capitalize"><strong>Job Type:</strong> {job.type}</span>
                                    </p>
                                    {job.salary_range && (
                                        <p className="flex items-start gap-3">
                                            <DollarSign size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                            <span><strong>Salary:</strong> {job.salary_range}</span>
                                        </p>
                                    )}
                                    <p className="flex items-start gap-3">
                                        <Clock size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                        <span><strong>Date Posted:</strong> {formatDate(job.created_at)}</span>
                                    </p>
                                    {job.deadline && (
                                        <p className="flex items-start gap-3 text-red-600 font-semibold">
                                            <Calendar size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                                            <span><strong>Closes on:</strong> {formatDate(job.deadline)}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}