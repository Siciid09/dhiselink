"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { completeOrganizationOnboarding } from './actions';
import { AlertTriangle, Edit } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg disabled:bg-gray-400">{pending ? "Saving..." : "Finish & Go to Dashboard"}</button>;
}

export default function OrganizationOnboardingForm({ orgType, orgSubtypes }: { orgType: string, orgSubtypes: string[] }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [state, formAction] = useFormState(completeOrganizationOnboarding, { error: null });

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
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2"><motion.div className="bg-blue-500 h-2 rounded-full" animate={{ width: `${(currentStep / 4) * 100}%` }} /></div>
                </div>

                <form action={formAction}>
                    {currentStep === 4 && Object.entries(formData).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={value as string} />
                    ))}
                    <input type="hidden" name="organization_type" value={orgType} />

                    <AnimatePresence mode="wait">
                        <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {currentStep === 1 && <Tab1 onNext={handleNext} initialData={formData} />}
                            {currentStep === 2 && <Tab2 onNext={handleNext} onPrev={handlePrev} initialData={formData} orgSubtypes={orgSubtypes} />}
                            {currentStep === 3 && <Tab3 onNext={handleNext} onPrev={handlePrev} initialData={formData} orgType={orgType} />}
                            {currentStep === 4 && <Tab4 onPrev={handlePrev} allData={{...formData, organization_type: orgType}} error={state?.error} />}
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Core Identity</h2>
            <div className="space-y-4">
                <div><label className="font-medium">Official Organization Name (Required)</label><input name="organization_name" value={data.organization_name || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required /></div>
                <div><label className="font-medium">Headquarters Location (Required)</label><input name="location" value={data.location || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required /></div>
                <div><label className="font-medium">Year Founded (Required)</label><input name="year_founded" type="number" value={data.year_founded || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required/></div>
            </div>
            <div className="mt-8 text-right"><button type="button" onClick={() => onNext(data)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next</button></div>
        </div>
    );
};

const Tab2 = ({ onNext, onPrev, initialData, orgSubtypes }: any) => {
    const [data, setData] = useState(initialData);
    const handleChange = (e: React.ChangeEvent<any>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Classification & Mission</h2>
            <div className="space-y-4">
                <div><label className="font-medium">Organization Subtype (Required)</label>
                    <select name="organization_subtype" value={data.organization_subtype || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required>
                        <option value="">-- Select a subtype --</option>
                        {orgSubtypes.map((st: string) => <option key={st} value={st}>{st}</option>)}
                    </select>
                </div>
                <div><label className="font-medium">About Us / Mission (Required)</label><textarea name="bio" rows={4} value={data.bio || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required></textarea></div>
                <div><label className="font-medium">Number of Employees (Required)</label>
                    <select name="employee_count" value={data.employee_count || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required>
                        <option value="">Select a range</option><option value="1-10">1-10</option><option value="11-50">11-50</option><option value="51-200">51-200</option><option value="201-1000">201-1000</option><option value="1001+">1001+</option>
                    </select>
                </div>
            </div>
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 font-bold rounded-lg">Previous</button>
                <button type="button" onClick={() => onNext(data)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg">Next</button>
            </div>
        </div>
    );
};

const Tab3 = ({ onNext, onPrev, initialData, orgType }: any) => {
    const [data, setData] = useState(initialData);
    const handleChange = (e: React.ChangeEvent<any>) => setData({ ...data, [e.target.name]: e.target.value });

    // This tab's content changes based on orgType
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Operations & Services</h2>
            <div className="space-y-4">
                {orgType === 'Company' && (<div><label className="font-medium">Industry (Required)</label><input name="industry" value={data.industry || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required/></div>)}
                {orgType === 'University' && (<div><label className="font-medium">Accreditation (Required)</label><input name="accreditation" value={data.accreditation || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required/></div>)}
                {orgType === 'NGO' && (<div><label className="font-medium">Community Focus (Required)</label><input name="community_focus" value={data.community_focus || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" required/></div>)}
                <div><label className="font-medium">Primary Services / Activities</label><textarea name="services" rows={3} value={data.services || ''} onChange={handleChange} className="w-full mt-1 p-3 border rounded-lg" /></div>
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
                <div><h3 className="font-semibold">Name</h3><p>{allData.organization_name}</p></div>
                <div><h3 className="font-semibold">Type</h3><p>{allData.organization_type}</p></div>
                <div><h3 className="font-semibold">Subtype</h3><p>{allData.organization_subtype}</p></div>
                <div><h3 className="font-semibold">Bio</h3><p className="whitespace-pre-wrap">{allData.bio}</p></div>
            </div>
            {error && <div className="p-4 mt-4 bg-red-50 text-red-800 rounded-lg">{error}</div>}
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 font-bold rounded-lg"><Edit size={16} className="inline-block mr-2" />Make Changes</button>
                <SubmitButton />
            </div>
        </div>
    );
};