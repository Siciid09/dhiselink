// File: app/dashboard/post-job/page.tsx

"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Type, FileText, AlertTriangle, DollarSign, Calendar, ListChecks, Tag, Link as LinkIcon } from 'lucide-react';
import { createOpportunity } from './actions'; // We will create this universal action next
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            disabled={pending}
            className="w-full mt-6 px-8 py-4 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-700 disabled:bg-slate-400 transition-all"
        >
            {pending ? "Submitting..." : "Post Opportunity"}
        </button>
    );
}

export default function PostOpportunityPage() {
    const [state, formAction] = useFormState(createOpportunity, { error: null, success: false });

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-left mb-4">
                    <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Post a New Opportunity</h1>
                        <p className="mt-2 text-gray-600">Fill in the details below to reach our network.</p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        {/* --- Basic Info --- */}
                        <h2 className="text-lg font-semibold border-b pb-2">Basic Info</h2>
                        
                        <div>
                            <label htmlFor="title" className="font-medium text-gray-700">Opportunity Title</label>
                            <div className="relative mt-1"><Type size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="title" name="title" required placeholder="e.g., Senior Software Engineer, Research Program" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-sky-500" /></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className="font-medium text-gray-700">Location</label>
                                <div className="relative mt-1"><MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="location" name="location" required placeholder="e.g., Hargeisa, Remote" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-sky-500" /></div>
                            </div>
                            <div>
                                <label htmlFor="opportunity_type" className="font-medium text-gray-700">Opportunity Type</label>
                                <div className="relative mt-1"><Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><select id="opportunity_type" name="opportunity_type" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 appearance-none focus:ring-2 focus:ring-sky-500">
                                    <option value="">Select type</option>
                                    <option value="Job">Job</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Program">Program</option>
                                    <option value="Project">Project</option>
                                    <option value="Grant">Grant</option>
                                    <option value="Other">Other</option>
                                </select></div>
                            </div>
                        </div>

                        {/* --- Opportunity Details --- */}
                        <h2 className="text-lg font-semibold border-b pb-2 pt-4">Details</h2>

                        <div>
                            <label htmlFor="description" className="font-medium text-gray-700">Description</label>
                            <div className="relative mt-1"><FileText size={20} className="absolute left-4 top-4 text-gray-400" /><textarea id="description" name="description" required rows={6} placeholder="Describe the purpose, responsibilities, benefits, or scope..." className="w-full pt-3 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-sky-500"></textarea></div>
                        </div>
                        <div>
                            <label htmlFor="requirements" className="font-medium text-gray-700">Requirements / Eligibility</label>
                            <div className="relative mt-1"><ListChecks size={20} className="absolute left-4 top-4 text-gray-400" /><textarea id="requirements" name="requirements" rows={3} placeholder="Enter key requirements, separated by a comma. e.g., Bachelor's Degree, 5+ years experience" className="w-full pt-3 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-sky-500"></textarea></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="compensation" className="font-medium text-gray-700">Compensation / Funding (Optional)</label>
                                <div className="relative mt-1"><DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="compensation" name="compensation" placeholder="e.g., $1500/month, Volunteer" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-sky-500" /></div>
                            </div>
                            <div>
                                <label htmlFor="deadline" className="font-medium text-gray-700">Duration / Deadline (Optional)</label>
                                <div className="relative mt-1"><Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="deadline" name="deadline" type="text" placeholder="e.g., 2025-12-31 or 3 Months" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-sky-500" /></div>
                            </div>
                        </div>

                         {/* --- Optional Extras --- */}
                         <h2 className="text-lg font-semibold border-b pb-2 pt-4">Optional Extras</h2>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="font-medium text-gray-700">Category / Field</label>
                                <div className="relative mt-1"><Tag size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="category" name="category" placeholder="e.g., Engineering, Education" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-sky-500" /></div>
                            </div>
                            <div>
                                <label htmlFor="application_method" className="font-medium text-gray-700">Application Method</label>
                                <div className="relative mt-1"><LinkIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="application_method" name="application_method" placeholder="e.g., apply@company.com" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-sky-500" /></div>
                            </div>
                        </div>

                        <SubmitButton />

                        {state?.error && (
                            <div className="p-4 mt-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3"><AlertTriangle /><p>{state.error}</p></div>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
}