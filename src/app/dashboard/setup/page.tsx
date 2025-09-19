// File Path: app/dashboard/setup/page.tsx

"use client";

import { useState, FC, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Building, Briefcase, ArrowLeft, CheckCircle } from 'lucide-react';
// We'll create this API route in the next step
// import { setupProfile } from '@/actions/auth'; 

export default function SetupProfilePage() {
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState<'professional' | 'organization' | null>(null);
    const [formData, setFormData] = useState({
        fullName: '', professionalTitle: '',
        orgName: '', orgType: 'company'
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSubmit = async () => {
        setLoading(true);
        // This is a placeholder for the server action or API call
        console.log("Submitting Profile Setup:", { accountType, ...formData });
        await new Promise(res => setTimeout(res, 1500));
        
        // On success, redirect to the dashboard
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border p-8 space-y-6">
                <ProgressBar currentStep={step} totalSteps={2} titles={["Account Type", "Your Details"]} />
                
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0}} animate={{ opacity: 1 }}>
                         <h1 className="text-3xl font-bold text-center text-gray-800">Welcome to Dhiselink!</h1>
                         <p className="text-center text-gray-600 mb-6">Let&apos;s set up your profile. First, tell us who you are.</p>
                        <div className="space-y-4">
                            <AccountTypeCard icon={<Briefcase />} title="I'm a Professional" onClick={() => { setAccountType('professional'); setStep(2); }} />
                            <AccountTypeCard icon={<Building />} title="I'm an Organization" onClick={() => { setAccountType('organization'); setStep(2); }} />
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                     <motion.div key="step2" initial={{ opacity: 0}} animate={{ opacity: 1 }}>
                        <h1 className="text-3xl font-bold text-center text-gray-800">Tell Us About Yourself</h1>
                        <div className="space-y-4 mt-6">
                            {accountType === 'professional' && (
                                <>
                                    <input name="fullName" placeholder="Your Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full h-12 px-4 rounded-lg bg-gray-100" />
                                    <input name="professionalTitle" placeholder="Your Professional Title (e.g., Civil Engineer)" value={formData.professionalTitle} onChange={handleInputChange} className="w-full h-12 px-4 rounded-lg bg-gray-100" />
                                </>
                            )}
                             {accountType === 'organization' && (
                                <>
                                    <input name="orgName" placeholder="Organization Name" value={formData.orgName} onChange={handleInputChange} className="w-full h-12 px-4 rounded-lg bg-gray-100" />
                                    <select name="orgType" value={formData.orgType} onChange={handleInputChange} className="w-full h-12 px-3 rounded-lg bg-gray-100">
                                        <option value="company">Company</option>
                                        <option value="ngo">NGO</option>
                                        <option value="university">University</option>
                                        <option value="government">Government</option>
                                    </select>
                                </>
                            )}
                        </div>
                         <div className="mt-8 flex justify-between items-center">
                            <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg"><ArrowLeft size={16} /> Back</button>
                            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg flex items-center gap-2"><CheckCircle size={18}/> {loading ? "Saving..." : "Complete Setup"}</button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

const ProgressBar: FC<{ currentStep: number, totalSteps: number, titles: string[] }> = ({ currentStep, totalSteps, titles }) => (
    <div className="w-full my-8">
        <div className="flex justify-between mb-1">
            {titles.map((title, i) => (<span key={i} className={`text-xs font-semibold ${currentStep >= i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>{title}</span>))}
        </div>
        <div className="relative h-2 rounded-full bg-gray-200">
            <motion.div className="absolute top-0 left-0 h-2 rounded-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />
        </div>
    </div>
);

const AccountTypeCard: FC<{ icon: JSX.Element; title: string; onClick: () => void }> = ({ icon, title, onClick }) => (
    <button type="button" onClick={onClick} className="w-full text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center gap-4">
        <div className="flex-shrink-0 text-blue-600 bg-blue-100 p-3 rounded-lg">{icon}</div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
    </button>
);