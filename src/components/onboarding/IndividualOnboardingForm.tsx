"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { completeIndividualOnboarding } from '@/app/(auth)/onboarding/actions';
import { supabase } from '@/lib/utils/supabase/client';
import { X, UploadCloud, Edit, AlertTriangle } from 'lucide-react';

// A small, local component for the submit button to get the pending state
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400">
            {pending ? "Saving..." : "Complete Setup"}
        </button>
    );
}

export default function IndividualOnboardingForm({ user }: { user: User }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [uploading, setUploading] = useState(false);
    
    // All form data is managed by state
    const [fullName, setFullName] = useState('');
    const [professionalTitle, setProfessionalTitle] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState('');
    const [cvUrl, setCvUrl] = useState('');
    const [cvFilename, setCvFilename] = useState('');

    // The useFormState hook connects our form to the server action
    const [state, formAction] = useFormState(completeIndividualOnboarding, { error: null });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleAddSkill = () => {
        if (currentSkill && !skills.includes(currentSkill)) {
            setSkills(prev => [...prev, currentSkill]);
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(prev => prev.filter(skill => skill !== skillToRemove));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        
        const { error } = await supabase.storage.from('resumes').upload(filePath, file, { upsert: true });

        if (error) {
            alert("Error uploading file: " + error.message);
        } else {
            const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(filePath);
            setCvUrl(publicUrl);
            setCvFilename(file.name);
        }
        setUploading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800">Step {currentStep} of 4</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <motion.div
                            className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full"
                            animate={{ width: `${(currentStep / 4) * 100}%` }}
                        />
                    </div>
                </div>

                <form action={formAction}>
                    {/* Hidden inputs pass the state data to the Server Action */}
                    <input type="hidden" name="full_name" value={fullName} />
                    <input type="hidden" name="professional_title" value={professionalTitle} />
                    <input type="hidden" name="bio" value={bio} />
                    {skills.map(skill => <input key={skill} type="hidden" name="skills" value={skill} />)}
                    <input type="hidden" name="cv_url" value={cvUrl} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        >
                            {/* All steps are now inside this one file */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's start with the basics</h2>
                                    <p className="text-gray-600 mb-6">This information will be on your public profile.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="font-medium text-gray-700">Full Name</label>
                                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="font-medium text-gray-700">Professional Title</label>
                                            <input type="text" placeholder="e.g., Civil Engineer" value={professionalTitle} onChange={(e) => setProfessionalTitle(e.target.value)} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="font-medium text-gray-700">Short Bio</label>
                                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                                        </div>
                                    </div>
                                    <div className="mt-8 text-right">
                                        <button type="button" onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Next Step</button>
                                    </div>
                                </div>
                            )}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Skills & Expertise</h2>
                                    <div className="flex gap-2 mb-4">
                                        <input type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }} placeholder="e.g., Project Management" className="flex-grow p-3 border border-gray-300 rounded-lg" />
                                        <button type="button" onClick={handleAddSkill} className="px-5 bg-gray-800 text-white font-bold rounded-lg">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[50px] p-2 bg-gray-50 rounded-lg border">
                                        {skills.map(skill => (<span key={skill} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{skill}<button type="button" onClick={() => handleRemoveSkill(skill)}><X size={14} /></button></span>))}
                                    </div>
                                    <div className="mt-8 flex justify-between">
                                        <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg">Previous</button>
                                        <button type="button" onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next Step</button>
                                    </div>
                                </div>
                            )}
                            {currentStep === 3 && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Credentials & Documents</h2>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600"><span>Upload a file</span><input id="file-upload" type="file" className="sr-only" onChange={handleFileUpload} /></label><p className="pl-1">or drag and drop</p></div>
                                            {uploading && <p>Uploading...</p>}
                                            {cvFilename && !uploading && <p className="font-semibold text-green-600">Uploaded: {cvFilename}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-between">
                                        <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg">Previous</button>
                                        <button type="button" onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Review Information</button>
                                    </div>
                                </div>
                            )}
                            {currentStep === 4 && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Information</h2>
                                    <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
                                        <div><h3 className="font-semibold">Full Name</h3><p>{fullName}</p></div>
                                        <div><h3 className="font-semibold">Professional Title</h3><p>{professionalTitle}</p></div>
                                        <div><h3 className="font-semibold">Bio</h3><p>{bio}</p></div>
                                        <div><h3 className="font-semibold">Skills</h3><div className="flex flex-wrap gap-2 mt-1">{skills.map(s => <span key={s} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm">{s}</span>)}</div></div>
                                        <div><h3 className="font-semibold">CV / Resume</h3><p>{cvFilename || "No file uploaded"}</p></div>
                                    </div>

                                    {/* --- THIS IS THE FIX --- */}
                                    {/* Using optional chaining `?.` to prevent the crash */}
                                    {state?.error && (
                                      <div className="p-4 mt-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3">
                                          <AlertTriangle />
                                          <p>{state.error}</p>
                                      </div>
                                    )}

                                    <div className="mt-8 flex justify-between">
                                        <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg"><Edit size={16} className="inline-block mr-2" />Make Changes</button>
                                        <SubmitButton />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}