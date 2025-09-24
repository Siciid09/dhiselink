"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Building, Link as LinkIcon, Package, AlertTriangle } from 'lucide-react';
import { completeOtherOnboarding } from './actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full mt-6 px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400">
            {pending ? "Saving..." : "Complete Setup"}
        </button>
    );
}

export default function OtherOnboardingPage() {
    const [state, formAction] = useFormState(completeOtherOnboarding, { error: null });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white rounded-2xl shadow-xl border p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
                    <p className="mt-2 text-gray-600">Please provide your organization's details to get started.</p>
                </div>
                <form action={formAction} className="mt-8 space-y-5">
                    <div>
                        <label className="font-medium text-gray-700">Organization Name</label>
                        <div className="relative mt-1">
                            <Building size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="organization_name" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Organization Website</label>
                        <div className="relative mt-1">
                            <LinkIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="website_url" type="url" placeholder="https://example.com" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Type of Organization</label>
                        <div className="relative mt-1">
                            <Package size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select name="organization_subtype" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 appearance-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select a type</option>
                                <option value="Consultancy">Consultancy</option>
                                <option value="Contractor">Contractor</option>
                                <option value="Supplier">Supplier</option>
                                <option value="Think Tank">Think Tank</option>
                                <option value="Startup">Startup</option>
                                <option value="Association">Association</option>
                                <option value="Other">Other</option>
                            </select>er
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
