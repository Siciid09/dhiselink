"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Building, Link as LinkIcon, Mail, MapPin, Users } from 'lucide-react';

export default function OrganizationDetailPage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            const fetchProfile = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/organizations/${params.id}`);
                    if (!response.ok) {
                        // Throw an error if the API returns a 404 or 500
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Organization not found.');
                    }
                    const data = await response.json();
                    setProfile(data);
                } catch (err) {
                    setError((err as Error).message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [params.id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p>Loading Profile...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-red-500">{error}</p></div>;
    }

    // --- THIS IS THE FIX ---
    // This check ensures the profile data exists before we try to render the main component.
    // If the fetch completes but finds nothing, this message will show.
    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p>Organization could not be found.</p></div>;
    }

    // Now it's safe to render the main JSX
    return (
        <div className="bg-slate-50 min-h-screen pt-24 md:pt-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link href="/companies" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors">
                        <ArrowLeft size={16} /> Back to Organizations
                    </Link>

                    {/* Header Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <img 
                              src={profile.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.organization_name}`}
                              alt={`${profile.organization_name} logo`} 
                              className="h-24 w-24 object-contain rounded-xl border p-2 bg-white flex-shrink-0" 
                            />
                            <div className="flex-grow">
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{profile.organization_name}</h1>
                                <p className="mt-2 text-slate-600">{profile.bio || 'This organization has not provided a summary yet.'}</p>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-500">
                                    {profile.location && <span className="flex items-center gap-1.5"><MapPin size={14}/>{profile.location}</span>}
                                    {profile.employee_count && <span className="flex items-center gap-1.5"><Users size={14}/>{profile.employee_count}+ Members</span>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Contact Info Card */}
                    {(profile.website_url || profile.email) && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mt-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Contact Information</h2>
                            <div className="space-y-3">
                                {profile.website_url && 
                                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:underline break-all">
                                        <LinkIcon size={18} className="flex-shrink-0" />
                                        <span>{profile.website_url}</span>
                                    </a>
                                }
                                {profile.email && 
                                    <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-blue-600 hover:underline break-all">
                                        <Mail size={18} className="flex-shrink-0" />
                                        <span>{profile.email}</span>
                                    </a>
                                }
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}