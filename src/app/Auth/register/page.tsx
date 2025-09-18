"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Briefcase, User, Building, Lock, AtSign, ChevronRight, ChevronLeft,
    GraduationCap, Link2, Linkedin, MapPin
} from 'lucide-react';

// --- 1. DATA ---

const industriesByType = {
    'Private Company': ['Construction', 'Technology', 'Finance', 'Telecommunications', 'Renewable Energy', 'Logistics'],
    'NGO / Non-Profit': ['Humanitarian Aid', 'Development', 'Healthcare', 'Education', 'Environmental'],
    'Government Body': ['Public Works', 'Urban Planning', 'National Development', 'Policy & Governance'],
    'University': ['Engineering Faculty', 'Technology & CS', 'Business Administration', 'Medical School']
};

// --- 2. LAYOUT & UI COMPONENTS ---

const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/80">
        <nav className="relative container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold tracking-tighter text-blue-600">Dhiselink</a>
            <a href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">Already have an account? <span className="font-bold text-blue-600">Sign In</span></a>
        </nav>
    </header>
);

const Footer = () => (
    <footer className="bg-white">
        <div className="container mx-auto px-6 py-8"><p className="text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} Dhiselink. All rights reserved.</p></div>
    </footer>
);

const ProgressBar = ({ currentStep, totalSteps }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
    </div>
);

// --- 3. FORM COMPONENTS ---

const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5, ease: 'easeInOut' } }
};

const ProfessionalForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    
    return (
        <div>
            <ProgressBar currentStep={step} totalSteps={5} />
            <AnimatePresence mode="wait">
                <motion.div key={step} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    {step === 1 && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Step 1: Basic Information</h4>
                            <div className="relative mb-4"><AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" placeholder="Email Address" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="relative mb-4"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Full Name" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" placeholder="Password" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <button onClick={handleNext} className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Next <ChevronRight size={18}/></button>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Step 2: Professional Details</h4>
                            <div className="relative mb-4"><Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Your Title (e.g., Civil Engineer)" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <select className="w-full h-12 px-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                                <option>Select your field...</option>
                                <option>Engineering</option>
                                <option>Technology</option>
                                <option>Construction & Design</option>
                                <option>Development & Policy</option>
                            </select>
                            <div className="flex gap-4 mt-6">
                                <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"><ChevronLeft size={18}/> Back</button>
                                <button onClick={handleNext} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Next <ChevronRight size={18}/></button>
                            </div>
                        </div>
                    )}
                     {step === 3 && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Step 3: Education & Experience</h4>
                            <div className="relative mb-4"><Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="number" placeholder="Years of Experience" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="relative"><GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="University Name" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                             <div className="flex gap-4 mt-6">
                                <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"><ChevronLeft size={18}/> Back</button>
                                <button onClick={handleNext} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Next <ChevronRight size={18}/></button>
                            </div>
                        </div>
                    )}
                    {step === 4 && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Step 4: Profile & Social Links</h4>
                             <div className="relative mb-4"><Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="url" placeholder="LinkedIn Profile URL (optional)" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="relative"><Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="url" placeholder="Portfolio/Website URL (optional)" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"><ChevronLeft size={18}/> Back</button>
                                <button onClick={handleNext} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Next <ChevronRight size={18}/></button>
                            </div>
                        </div>
                    )}
                    {step === 5 && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Step 5: Availability</h4>
                             <select className="w-full h-12 px-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                                <option>Select your current status...</option>
                                <option>Actively seeking a full-time role</option>
                                <option>Open to freelance/contract work</option>
                                <option>Currently a student</option>
                                <option>Just networking</option>
                            </select>
                            <div className="flex gap-4 mt-6">
                                <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"><ChevronLeft size={18}/> Back</button>
                                <a href="/" className="w-full flex items-center justify-center bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">Complete Registration</a>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const InstitutionForm = () => {
    const [step, setStep] = useState(1);
    const [institutionType, setInstitutionType] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState([]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleIndustryToggle = (industry) => {
        setSelectedIndustries(prev => 
            prev.includes(industry) 
            ? prev.filter(i => i !== industry) 
            : [...prev, industry]
        );
    };

    return (
        <div>
            <ProgressBar currentStep={step} totalSteps={4} />
             <AnimatePresence mode="wait">
                <motion.div key={step} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    {step === 1 && (
                        <div>
                             <h4 className="font-semibold text-gray-700 mb-2">Step 1: Account Information</h4>
                            <div className="relative mb-4"><Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Institution Name" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="relative mb-4"><AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" placeholder="Work Email Address" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" placeholder="Password" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <button onClick={handleNext} className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Next <ChevronRight size={18}/></button>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                             <h4 className="font-semibold text-gray-700 mb-2">Step 2: Institution Details</h4>
                            <select onChange={(e) => setInstitutionType(e.target.value)} value={institutionType} className="w-full h-12 px-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 mb-4">
                                <option value="">Select institution type...</option>
                                <option>Private Company</option>
                                <option>NGO / Non-Profit</option>
                                <option>Government Body</option>
                                <option>University</option>
                            </select>
                            
                            <AnimatePresence>
                            {institutionType && (
                                <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}}>
                                    <h5 className="font-semibold text-sm text-gray-600 mb-2">Select relevant industries:</h5>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(industriesByType[institutionType] || []).map(industry => (
                                            <label key={industry} className={`flex items-center gap-2 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${selectedIndustries.includes(industry) ? 'bg-blue-50 border-blue-500' : 'bg-gray-100 border-transparent'}`}>
                                                <input type="checkbox" checked={selectedIndustries.includes(industry)} onChange={() => handleIndustryToggle(industry)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"/>
                                                {industry}
                                            </label>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            </AnimatePresence>

                             <div className="flex gap-4 mt-6">
                                <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"><ChevronLeft size={18}/> Back</button>
                                <button onClick={handleNext} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Next <ChevronRight size={18}/></button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                         <div>
                             <h4 className="font-semibold text-gray-700 mb-2">Step 3: Location & Size</h4>
                             <div className="relative mb-4"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Headquarters Location (e.g., Mogadishu)" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                             <select className="w-full h-12 px-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                                <option>Select institution size...</option>
                                <option>1-10 employees</option>
                                <option>11-50 employees</option>
                                <option>51-200 employees</option>
                                <option>201-1000 employees</option>
                                <option>1000+ employees</option>
                            </select>
                            <div className="flex gap-4 mt-6">
                                <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"><ChevronLeft size={18}/> Back</button>
                                <button onClick={handleNext} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Next <ChevronRight size={18}/></button>
                            </div>
                        </div>
                    )}
                     {step === 4 && (
                         <div>
                             <h4 className="font-semibold text-gray-700 mb-2">Step 4: Website & Contact</h4>
                             <div className="relative mb-4"><Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="url" placeholder="Website URL (e.g., https://...)" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" placeholder="Public Contact Email (optional)" className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"><ChevronLeft size={18}/> Back</button>
                                <a href="/" className="w-full flex items-center justify-center bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">Complete Registration</a>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- 4. MAIN REGISTRATION PAGE COMPONENT ---

export default function RegistrationPage() {
    const [formType, setFormType] = useState('professional');

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Header />
            <main className="flex-grow flex items-center justify-center py-24 pt-40">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200">
                        {/* Left Column (Info) */}
                        <div className="hidden lg:block p-12 bg-gray-800 text-white h-full flex flex-col justify-center">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                                <h2 className="text-4xl font-bold tracking-tight mb-4">Join The Network Building Somalia's Future</h2>
                                <p className="text-gray-300 text-lg">Whether you are a professional seeking to make an impact or an institution driving progress, your journey starts here.</p>
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-start gap-3"><Users size={20} className="mt-1 flex-shrink-0 text-blue-400"/><p>Connect with thousands of verified professionals and leading institutions.</p></div>
                                    <div className="flex items-start gap-3"><Briefcase size={20} className="mt-1 flex-shrink-0 text-blue-400"/><p>Access exclusive opportunities for jobs, projects, and collaborations.</p></div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column (Form) */}
                        <div className="p-8 md:p-12">
                            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Create Your Account</h3>
                            
                            {/* Form Type Toggle */}
                            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg mb-8">
                                <button onClick={() => setFormType('professional')} className={`relative px-4 py-2 text-sm font-semibold rounded-md transition-colors ${formType === 'professional' ? 'text-blue-600' : 'text-gray-600'}`}>
                                    {formType === 'professional' && <motion.div layoutId="form-type-pill" className="absolute inset-0 bg-white shadow rounded-md" />}
                                    <span className="relative z-10">I'm a Professional</span>
                                </button>
                                <button onClick={() => setFormType('institution')} className={`relative px-4 py-2 text-sm font-semibold rounded-md transition-colors ${formType === 'institution' ? 'text-blue-600' : 'text-gray-600'}`}>
                                     {formType === 'institution' && <motion.div layoutId="form-type-pill" className="absolute inset-0 bg-white shadow rounded-md" />}
                                    <span className="relative z-10">I'm an Institution</span>
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {formType === 'professional' ? <ProfessionalForm key="prof" /> : <InstitutionForm key="inst" />}
                            </AnimatePresence>

                            {/* Social Signup */}
                            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or continue with</span></div></div>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"><img src="https://logo.clearbit.com/google.com" alt="Google" className="w-5 h-5" /> Google</button>
                                <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"><img src="https://logo.clearbit.com/linkedin.com" alt="LinkedIn" className="w-5 h-5" /> LinkedIn</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

