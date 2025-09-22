"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Landmark, Link as LinkIcon, Users, AlertTriangle } from 'lucide-react';
import { completeNgoGovOnboarding } from './actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full mt-6 px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400">
            {pending ? "Saving..." : "Complete Setup"}
        </button>
    );
}

export default function NgoGovOnboardingPage() {
    const [state, formAction] = useFormState(completeNgoGovOnboarding, { error: null });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white rounded-2xl shadow-xl border p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">NGO / Government Profile</h1>
                    <p className="mt-2 text-gray-600">Please provide your organization's details.</p>
                </div>
                <form action={formAction} className="mt-8 space-y-5">
                    <div>
                        <label className="font-medium text-gray-700">Agency / NGO Name</label>
                        <div className="relative mt-1">
                            <Landmark size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="organization_name" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Official Website</label>
                        <div className="relative mt-1">
                            <LinkIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="website_url" type="url" placeholder="https://agency.gov" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Team Size</label>
                         <div className="relative mt-1">
                            <Users size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select name="employee_count" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 appearance-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select a range</option>
                                <option value="1">1-50</option>
                                <option value="51">51-200</option>
                                <option value="201">201-1000</option>
                                <option value="1001">1001+</option>
                            </select>
                        </div>
                    </div>
                    <SubmitButton />
                    {state?.error && (
                        <div className="p-4 mt-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3">
                            <AlertTriangle /> <p>{state.error}</p>
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}