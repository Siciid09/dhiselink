"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { completeIndividualOnboarding } from './actions';
import { AlertTriangle, Edit } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400">
            {pending ? "Saving..." : "Complete Profile"}
        </button>
    );
}

export default function IndividualOnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        full_name: '',
        professional_title: '',
        location: '',
        bio: '',
        skills: [],
        resume_url: '',
        website_url: '',
        linkedin_url: '',
        github_url: '',
        languages: '',
    });

    const [state, formAction] = useFormState(completeIndividualOnboarding, { error: null });

    const handleNext = (newData: any) => {
        setFormData(prev => ({ ...prev, ...newData }));
        setCurrentStep(prev => prev + 1);
    };

    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
    };

    const totalSteps = 4;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800">Step {currentStep} of {totalSteps}</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <motion.div
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2 rounded-full"
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                <form action={formAction}>
                    {currentStep === totalSteps && Object.entries(formData).map(([key, value]) => {
                        if (key === 'skills') {
                            return (value as string[]).map(skill => <input key={skill} type="hidden" name="skills" value={skill} />);
                        }
                        return <input key={key} type="hidden" name={key} value={value as string} />;
                    })}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && <Tab1 onNext={handleNext} initialData={formData} />}
                            {currentStep === 2 && <Tab2 onNext={handleNext} onPrev={handlePrev} initialData={formData} />}
                            {currentStep === 3 && <Tab3 onNext={handleNext} onPrev={handlePrev} initialData={formData} />}
                            {currentStep === 4 && <Tab4 onPrev={handlePrev} allData={formData} error={state?.error} />}
                        </motion.div>
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}

// --- TAB COMPONENTS ---

const Tab1 = ({ onNext, initialData }: { onNext: (data: any) => void, initialData: any }) => {
    const [data, setData] = useState(initialData);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Essentials</h2>
            <div className="space-y-4">
                <div><label className="font-medium">Full Name</label><input name="full_name" value={data.full_name} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
                <div><label className="font-medium">Professional Title</label><input name="professional_title" placeholder="e.g., Software Engineer" value={data.professional_title} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
                <div><label className="font-medium">Location</label><input name="location" placeholder="e.g., Hargeisa, Somalia" value={data.location} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
            </div>
            <div className="mt-8 text-right"><button type="button" onClick={() => onNext(data)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next</button></div>
        </div>
    );
};

const Tab2 = ({ onNext, onPrev, initialData }: { onNext: (data: any) => void, onPrev: () => void, initialData: any }) => {
    const [data, setData] = useState(initialData);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Story & Skills</h2>
            <div className="space-y-4">
                 <div><label className="font-medium">Bio / Summary</label><textarea name="bio" rows={5} value={data.bio} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg"></textarea></div>
                 {/* A proper skills component would go here, for now a simple text input */}
                 <div><label className="font-medium">Core Skills (comma separated)</label><input name="skills" placeholder="e.g., JavaScript, Python, Leadership" value={data.skills.join(', ')} onChange={(e) => setData({...data, skills: e.target.value.split(',').map(s => s.trim())})} className="w-full mt-1 p-3 border rounded-lg" /></div>
            </div>
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg">Previous</button>
                <button type="button" onClick={() => onNext(data)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next</button>
            </div>
        </div>
    );
};

const Tab3 = ({ onNext, onPrev, initialData }: { onNext: (data: any) => void, onPrev: () => void, initialData: any }) => {
    const [data, setData] = useState(initialData);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Online Presence</h2>
             <div className="space-y-4">
                <div><label className="font-medium">Personal Website / Portfolio</label><input name="website_url" type="url" value={data.website_url} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
                <div><label className="font-medium">LinkedIn Profile URL</label><input name="linkedin_url" type="url" value={data.linkedin_url} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
                <div><label className="font-medium">GitHub Profile URL (Optional)</label><input name="github_url" type="url" value={data.github_url} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
             </div>
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg">Previous</button>
                <button type="button" onClick={() => onNext(data)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next</button>
            </div>
        </div>
    );
};

const Tab4 = ({ onPrev, allData, error }: { onPrev: () => void, allData: any, error: string | null }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Information</h2>
            <div className="space-y-3 p-6 border rounded-lg bg-gray-50 mt-4">
                <div><h3 className="font-semibold">Full Name</h3><p>{allData.full_name}</p></div>
                <div><h3 className="font-semibold">Title</h3><p>{allData.professional_title}</p></div>
                <div><h3 className="font-semibold">Location</h3><p>{allData.location}</p></div>
                <div><h3 className="font-semibold">Bio</h3><p className="whitespace-pre-wrap">{allData.bio}</p></div>
                <div><h3 className="font-semibold">Skills</h3><div className="flex flex-wrap gap-2 mt-1">{allData.skills.map((s: string) => <span key={s} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm">{s}</span>)}</div></div>
            </div>
            {error && (<div className="p-4 mt-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3"><AlertTriangle /><p>{error}</p></div>)}
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg"><Edit size={16} className="inline-block mr-2" />Make Changes</button>
                <SubmitButton />
            </div>
        </div>
    );
};