"use client";

// Final, Production-Ready Version

import { useFormState, useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { User, Briefcase, FileText, AlertTriangle } from 'lucide-react';
// Using a direct relative path for maximum reliability during builds
import { completeIndividualOnboarding } from '../../onboarding/individual/actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            disabled={pending}
            className="w-full mt-6 px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition-all"
        >
            {pending ? "Saving..." : "Complete Setup"}
        </button>
    );
}

export default function IndividualOnboardingForm() {
    const initialState = { error: null };
    const [state, formAction] = useFormState(completeIndividualOnboarding, initialState);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl border p-8"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Your Professional Profile</h1>
                    <p className="mt-2 text-gray-600">Tell us a bit about yourself to get started.</p>
                </div>

                <form action={formAction} className="mt-8 space-y-5">
                    <div>
                        <label className="font-medium text-gray-700">Full Name</label>
                        <div className="relative mt-1">
                            <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="full_name" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Professional Title</label>
                        <div className="relative mt-1">
                            <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="professional_title" placeholder="e.g., Civil Engineer" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Short Bio</label>
                        <div className="relative mt-1">
                            <FileText size={20} className="absolute left-4 top-4 text-gray-400" />
                            <textarea name="bio" rows={4} placeholder="A brief summary of your experience and goals..." className="w-full pt-3 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"></textarea>
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
        </div>
    );
}
