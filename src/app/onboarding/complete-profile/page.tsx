"use client";

import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { completeOnboarding } from './actions';
import { Loader2, AlertTriangle, User, Building } from 'lucide-react';
import { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full max-w-xs px-8 py-4 bg-slate-800 text-white font-bold rounded-lg shadow-lg disabled:bg-slate-400 flex items-center justify-center">
            {pending ? <Loader2 className="animate-spin" /> : "Save & Go to Dashboard"}
        </button>
    );
}

function OnboardingForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [selection, setSelection] = useState<string | null>(null);
    const orgTypes = [ 'Company', 'University', 'NGO', 'Government', 'Other' ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-4xl font-extrabold text-slate-900">Complete Your Profile</h1>
                <p className="mt-2 text-lg text-slate-600">This is the final step to unlock your account.</p>

                <form action={completeOnboarding} className="mt-8 bg-white p-8 rounded-xl shadow-lg border text-left">
                    {/* --- Step 1: Role Selection --- */}
                    <div className="space-y-4">
                        <p className="font-semibold text-slate-800 text-center">First, select your role:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`p-6 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center text-center ${selection === 'individual' ? 'border-amber-500 bg-amber-50' : 'bg-white hover:border-amber-400'}`}>
                                <input type="radio" name="role" value="individual" className="hidden" onChange={(e) => setSelection(e.target.value)} required />
                                <User className="mb-2" />Individual
                            </label>
                            <label className={`p-6 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center text-center ${selection === 'organization' ? 'border-amber-500 bg-amber-50' : 'bg-white hover:border-amber-400'}`}>
                                <input type="radio" name="role" value="organization" className="hidden" onChange={(e) => setSelection(e.target.value)} required />
                                <Building className="mb-2" />Organization
                            </label>
                        </div>
                    </div>

                    {/* --- Step 2: Detailed Info (Conditional) --- */}
                    <AnimatePresence>
                        {selection && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                className="pt-6 mt-6 border-t overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selection === 'individual' ? (
                                        <>
                                            <div className="md:col-span-2"><label className="font-semibold text-slate-800">Professional Title*</label><input name="professional_title" required placeholder="e.g., Software Engineer" className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" /></div>
                                            <div className="md:col-span-2"><label className="font-semibold text-slate-800">Your Location*</label><input name="location" required placeholder="e.g., Hargeisa, Somalia" className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" /></div>
                                            <div><label className="font-semibold text-slate-800">Experience Level*</label><select name="experience_level" required className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500"><option value="">-- Select --</option><option value="Student/Intern">Student/Intern</option><option value="Entry-Level">Entry-Level</option><option value="Mid-Level">Mid-Level</option><option value="Senior-Level">Senior-Level</option><option value="Executive">Executive</option></select></div>
                                            <div><label className="font-semibold text-slate-800">Years of Experience*</label><input name="years_of_experience" type="number" required placeholder="e.g., 5" className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" /></div>
                                            <div className="md:col-span-2"><label className="font-semibold text-slate-800">Core Skills*</label><textarea name="skills" required placeholder="e.g., React, Node.js, Project Management" className="w-full mt-2 h-24 p-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" /><p className="text-xs text-slate-500 mt-1">Separate skills with a comma.</p></div>
                                            <div className="md:col-span-2"><label className="font-semibold text-slate-800">Short Bio</label><textarea name="bio" placeholder="Tell us a little about yourself..." className="w-full mt-2 h-24 p-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" /></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="md:col-span-2"><label className="font-semibold text-slate-800">Organization Type*</label><select name="organization_type" required className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border"><option value="">-- Select --</option>{orgTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                                            <div className="md:col-span-2"><label className="font-semibold text-slate-800">Organization Name*</label><input name="organization_name" required className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border" /></div>
                                            <div className="md:col-span-2"><label className="font-semibold text-slate-800">Headquarters Location*</label><input name="location" required className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border" /></div>
                                            <div><label className="font-semibold text-slate-800">Year Founded*</label><input name="year_founded" type="number" required placeholder="e.g., 2004" className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border" /></div>
                                            <div><label className="font-semibold text-slate-800">Number of Employees*</label><select name="employee_count" required className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border"><option value="">-- Select --</option><option value="1-10">1-10</option><option value="11-50">11-50</option><option value="51-200">51-200</option><option value="201-1000">201-1000</option><option value="1001+">1001+</option></select></div>
                                            <div className="md:col-span-2"><label className="font-semibold text-slate-800">Website URL*</label><input name="website_url" type="url" required placeholder="https://example.com" className="w-full mt-2 h-12 px-4 rounded-lg bg-slate-50 border" /></div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {error && (<div className="p-4 mt-6 rounded-lg flex items-center gap-3 bg-red-50 text-red-800"><AlertTriangle size={16}/> <p>{error}</p></div>)}
                    
                    <div className="pt-6 flex justify-center">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CompleteProfileWrapper() {
    return <Suspense><OnboardingForm /></Suspense>
}