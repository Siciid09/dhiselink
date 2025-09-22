"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Type, FileText, AlertTriangle, DollarSign, Calendar, ListChecks } from 'lucide-react';
import { postJob } from './actions';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            disabled={pending}
            className="w-full mt-6 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all"
        >
            {pending ? "Submitting..." : "Post Job Opportunity"}
        </button>
    );
}

export default function PostJobPage() {
    const [state, formAction] = useFormState(postJob, { error: null });

    return (
        <div className="bg-gray-50 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl border p-8"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Post a New Job Opportunity</h1>
                        <p className="mt-2 text-gray-600">Fill in the details below to reach qualified professionals.</p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label htmlFor="title" className="font-medium text-gray-700">Job Title</label>
                            <div className="relative mt-1">
                                <Type size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input id="title" name="title" required placeholder="e.g., Senior Civil Engineer" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="font-medium text-gray-700">Location</label>
                                <div className="relative mt-1">
                                    <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input id="location" name="location" required placeholder="e.g., Hargeisa" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            {/* Job Type */}
                            <div>
                                <label htmlFor="job_type" className="font-medium text-gray-700">Job Type</label>
                                <div className="relative mt-1">
                                    <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select id="job_type" name="job_type" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 appearance-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select type</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* --- NEW FIELDS START HERE --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Salary Range */}
                            <div>
                                <label htmlFor="salary_range" className="font-medium text-gray-700">Salary Range (Optional)</label>
                                <div className="relative mt-1">
                                    <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input id="salary_range" name="salary_range" placeholder="e.g., $1000 - $1500" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            {/* Application Deadline */}
                            <div>
                                <label htmlFor="deadline" className="font-medium text-gray-700">Application Deadline (Optional)</label>
                                <div className="relative mt-1">
                                    <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input id="deadline" name="deadline" type="date" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <label htmlFor="requirements" className="font-medium text-gray-700">Requirements (Optional)</label>
                            <div className="relative mt-1">
                                <ListChecks size={20} className="absolute left-4 top-4 text-gray-400" />
                                <textarea id="requirements" name="requirements" rows={4} placeholder="Enter key requirements, separated by a comma. e.g., Bachelor's Degree, 5+ years experience, PMP Certification" className="w-full pt-3 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                        </div>
                        {/* --- NEW FIELDS END HERE --- */}

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="font-medium text-gray-700">Job Description</label>
                            <div className="relative mt-1">
                                <FileText size={20} className="absolute left-4 top-4 text-gray-400" />
                                <textarea id="description" name="description" required rows={8} placeholder="Describe the responsibilities, requirements, and benefits..." className="w-full pt-3 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                        </div>

                        <SubmitButton />

                        {state?.error && (
                            <div className="p-4 mt-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3">
                                <AlertTriangle />
                                <p>{state.error}</p>
                            </div>
                        )}
                    </form>
                </motion.div>
                <div className="text-center mt-4">
                  <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">
                    &larr; Back to Dashboard
                  </Link>
                </div>
            </div>
        </div>
    );
}