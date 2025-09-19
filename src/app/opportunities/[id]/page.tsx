// File Path: app/opportunities/[id]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Tag, Calendar, ArrowRight, Building } from 'lucide-react';

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) return;
        
        const fetchJobDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/opportunities/${params.id}`);
                if (!response.ok) throw new Error('Job not found.');
                const data = await response.json();
                setJob(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [params.id]);

    const InfoPill = ({ icon, text }: { icon: React.ReactNode, text: string | undefined | null }) => (
        text ? <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
            <div className="text-blue-600">{icon}</div>
            <div>
                <span className="font-semibold text-gray-800 capitalize">{text}</span>
            </div>
        </div> : null
    );

    if (loading) {
        return <div className="pt-40 text-center">Loading opportunity details...</div>;
    }

    if (error) {
        return <div className="pt-40 text-center text-red-500">{error}</div>;
    }
    
    if (!job) {
        return <div className="pt-40 text-center">Could not load job details.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-32">
                <div className="max-w-4xl mx-auto">
                    {/* --- Header --- */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-lg shadow-lg border mb-8"
                    >
                        <div className="flex items-start gap-6">
                            <img src={job.organization_logo_url || `https://placehold.co/80x80/e2e8f0/4a5568?text=${job.organization_name.charAt(0)}`} alt={`${job.organization_name} logo`} className="h-20 w-20 object-contain rounded-md border p-2 bg-white flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-blue-600">{job.organization_name}</p>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mt-1">{job.title}</h1>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Main Content & Sidebar --- */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg border"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Description</h2>
                            <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />

                            {job.requirements && job.requirements.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Requirements</h2>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        {job.requirements.map((req: string, index: number) => <li key={index}>{req}</li>)}
                                    </ul>
                                </>
                            )}
                        </motion.div>

                        <motion.div 
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0.4 }}
                            className="lg:col-span-1 space-y-6"
                        >
                           <div className="bg-white p-6 rounded-lg shadow-lg border space-y-3">
                                <InfoPill icon={<Briefcase size={20} />} text={job.type} />
                                <InfoPill icon={<MapPin size={20} />} text={job.location} />
                                <InfoPill icon={<Tag size={20} />} text={job.industry} />
                                {job.deadline && <InfoPill icon={<Calendar size={20} />} text={`Apply by ${new Date(job.deadline).toLocaleDateString()}`} />}
                           </div>
                           <a href={job.external_link || '#'} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                                Apply Now <ArrowRight size={18}/>
                           </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
