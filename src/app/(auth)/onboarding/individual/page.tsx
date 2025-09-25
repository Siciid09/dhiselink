"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { completeIndividualOnboarding } from './actions';
import { AlertTriangle, Edit } from 'lucide-react';

// Reusable Submit Button
function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg disabled:bg-gray-400">{pending ? "Saving..." : "Finish & Go to Dashboard"}</button>;
}

export default function IndividualOnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [state, formAction] = useFormState(completeIndividualOnboarding, { error: null });

    const handleNext = (newData: any) => {
        setFormData(prev => ({ ...prev, ...newData }));
        setCurrentStep(prev => prev + 1);
    };
    const handlePrev = () => setCurrentStep(prev => prev - 1);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border p-8">
                <div className="mb-8">
                    <h2 className="text-lg font-bold">Step {currentStep} of 4</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2"><motion.div className="bg-sky-500 h-2 rounded-full" animate={{ width: `${(currentStep / 4) * 100}%` }} /></div>
                </div>

                <form action={formAction}>
                    {currentStep === 4 && Object.entries(formData).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={value as string} />
                    ))}
                    <AnimatePresence mode="wait">
                        <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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

const Tab1 = ({ onNext, initialData }: any) => {
    const [data, setData] = useState(initialData);
    const handleChange = (e: React.ChangeEvent<any>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Core Identity</h2>
            <div className="space-y-4">
                <div><label className="font-medium">Full Name (Required)</label><input name="full_name" value={data.full_name || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required /></div>
                <div><label className="font-medium">Professional Title (Required)</label><input name="professional_title" placeholder="e.g., Civil Engineer" value={data.professional_title || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required /></div>
                <div><label className="font-medium">Location (Required)</label><input name="location" placeholder="e.g., Hargeisa, Somalia" value={data.location || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required /></div>
                <div><label className="font-medium">Experience Level (Required)</label>
                    <select name="experience_level" value={data.experience_level || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required>
                        <option value="">Select Level</option>
                        <option value="Student/Intern">Student/Intern</option>
                        <option value="Entry-Level">Entry-Level</option>
                        <option value="Mid-Level">Mid-Level</option>
                        <option value="Senior-Level">Senior-Level</option>
                        <option value="Executive">Executive</option>
                    </select>
                </div>
            </div>
            <div className="mt-8 text-right"><button type="button" onClick={() => onNext(data)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next</button></div>
        </div>
    );
};

const Tab2 = ({ onNext, onPrev, initialData }: any) => {
    const [data, setData] = useState(initialData);
    const handleChange = (e: React.ChangeEvent<any>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Professional Profile</h2>
            <div className="space-y-4">
                 <div><label className="font-medium">Bio / Summary (Required)</label><textarea name="bio" rows={5} value={data.bio || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required></textarea></div>
                 <div><label className="font-medium">Industry / Sector (Required)</label><input name="industry" placeholder="e.g., Construction" value={data.industry || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required/></div>
                 <div><label className="font-medium">Years of Experience (Required)</label><input name="years_of_experience" type="number" value={data.years_of_experience || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required/></div>
                 <div><label className="font-medium">Core Skills (Required, comma separated)</label><input name="skills" placeholder="e.g., AutoCAD, Project Management" value={data.skills || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required/></div>
            </div>
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 font-bold rounded-lg">Previous</button>
                <button type="button" onClick={() => onNext(data)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next</button>
            </div>
        </div>
    );
};

const Tab3 = ({ onNext, onPrev, initialData }: any) => {
    const [data, setData] = useState(initialData);
    const handleChange = (e: React.ChangeEvent<any>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Education & Credentials</h2>
             <div className="space-y-4">
                <div><label className="font-medium">Highest Degree (Required)</label>
                     <select name="degree" value={data.degree || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required>
                        <option value="">Select Degree</option>
                        <option value="High School">High School</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelor's">Bachelor's Degree</option>
                        <option value="Master's">Master's Degree</option>
                        <option value="PhD">PhD</option>
                    </select>
                </div>
                <div><label className="font-medium">Field of Study</label><input name="field_of_study" value={data.field_of_study || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
                <div><label className="font-medium">Certifications / Licenses (Optional)</label><textarea name="certifications" placeholder="e.g., PMP, AutoCAD Certified Professional" rows={3} value={data.certifications || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
                <div><label className="font-medium">Upload Resume / CV (Required)</label><input name="resume_url" type="file" className="w-full mt-1 p-2 border rounded-lg" required/></div>
             </div>
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 font-bold rounded-lg">Previous</button>
                <button type="button" onClick={() => onNext(data)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next</button>
            </div>
        </div>
    );
};

const Tab4 = ({ onPrev, allData, error }: any) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-2">Review Your Information</h2>
            <div className="space-y-3 p-6 border rounded-lg bg-gray-50 mt-4 text-sm">
                <div><h3 className="font-semibold">Full Name</h3><p>{allData.full_name}</p></div>
                <div><h3 className="font-semibold">Title</h3><p>{allData.professional_title}</p></div>
                <div><h3 className="font-semibold">Location</h3><p>{allData.location}</p></div>
                <div><h3 className="font-semibold">Experience</h3><p>{allData.experience_level} ({allData.years_of_experience} years)</p></div>
                <div><h3 className="font-semibold">Bio</h3><p className="whitespace-pre-wrap">{allData.bio}</p></div>
                <div><h3 className="font-semibold">Skills</h3><p>{allData.skills}</p></div>
            </div>
            {error && (<div className="p-4 mt-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3"><AlertTriangle /><p>{error}</p></div>)}
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 font-bold rounded-lg"><Edit size={16} className="inline-block mr-2" />Make Changes</button>
                <SubmitButton />
            </div>
        </div>
    );
};