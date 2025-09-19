// File Path: app/register/page.tsx

"use client";

import { useState, FC, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase'; // Your REAL Supabase client
import { User, Building, Briefcase, ArrowLeft, CheckCircle, AtSign, Lock, AlertTriangle, Globe, Image as ImageIcon, FileText } from 'lucide-react';

// --- Type Definitions ---
type AccountType = 'professional' | 'organization' | 'individual';

// --- HELPER COMPONENTS (Defined outside the main component) ---

const ProgressBar: FC<{ currentStep: number, totalSteps: number, titles: string[] }> = ({ currentStep, totalSteps, titles }) => (
    <div className="w-full my-8">
        <div className="flex justify-between mb-1">
            {titles.map((title, i) => (
                <span key={i} className={`text-xs font-semibold ${currentStep >= i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>{title}</span>
            ))}
        </div>
        <div className="relative h-2 rounded-full bg-gray-200">
            <motion.div
                className="absolute top-0 left-0 h-2 rounded-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
            />
        </div>
    </div>
);

const AccountTypeCard: FC<{ icon: JSX.Element; title: string; onClick: () => void }> = ({ icon, title, onClick }) => (
    <button type="button" onClick={onClick} className="w-full text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 flex items-center gap-4 shadow-sm">
        <div className="flex-shrink-0 text-blue-600 bg-blue-100 p-3 rounded-lg">{icon}</div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
    </button>
);

const Step1: FC<{ setAccountType: (type: AccountType) => void, nextStep: () => void }> = ({ setAccountType, nextStep }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
        <p className="text-center text-gray-600 mb-6">Choose an account type to get started.</p>
        <AccountTypeCard icon={<Briefcase />} title="I'm a Professional" onClick={() => { setAccountType('professional'); nextStep(); }} />
        <AccountTypeCard icon={<Building />} title="I'm an Organization" onClick={() => { setAccountType('organization'); nextStep(); }} />
        <AccountTypeCard icon={<User />} title="I'm an Individual" onClick={() => { setAccountType('individual'); nextStep(); }} />
    </motion.div>
);

const InputField: FC<{ name: string, type: string, placeholder: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, error?: string, icon: JSX.Element }> = ({ name, type, placeholder, value, onChange, error, icon }) => (
    <div>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
            <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} className={`w-full h-11 pl-10 pr-4 rounded-lg bg-gray-100 border ${error ? 'border-red-500' : 'border-transparent'} focus:ring-2 focus:ring-blue-500 outline-none transition-colors`} />
        </div>
        {error && <p className="text-xs text-red-600 mt-1 ml-1">{error}</p>}
    </div>
);

const FileInputField: FC<{ name: string; label: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; preview: string; error?: string; icon: JSX.Element }> = ({ name, label, onChange, preview, error, icon }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-4">
             {preview ? <img src={preview} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"/> : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">{icon}</div>}
             <input type="file" name={name} onChange={onChange} accept={name === 'resume' ? '.pdf' : 'image/png, image/jpeg'} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
);

const Step2: FC<{ accountType: AccountType, formData: any, handleInputChange: any, handleFileChange: any, previews: any, errors: any }> = ({ accountType, formData, handleInputChange, handleFileChange, previews, errors }) => (
    <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-4">
        {(accountType === 'professional' || accountType === 'individual') && (
            <>
                <InputField name="fullName" type="text" placeholder="Full Name *" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} icon={<User size={16}/>}/>
                <InputField name="professionalTitle" type="text" placeholder="Professional Title (e.g., Civil Engineer)" value={formData.professionalTitle} onChange={handleInputChange} error={errors.professionalTitle} icon={<Briefcase size={16}/>}/>
                <textarea name="bio" placeholder="Short Bio / Summary" value={formData.bio} onChange={handleInputChange} rows={3} className="w-full p-4 rounded-lg bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                <FileInputField name="profilePicture" label="Profile Picture" onChange={(e) => handleFileChange(e, 'profilePicture')} preview={previews.profilePicture} error={errors.profilePicture} icon={<ImageIcon size={24}/>}/>
                {accountType === 'professional' && <FileInputField name="resume" label="Resume (PDF Only)" onChange={(e) => handleFileChange(e, 'resume')} preview={previews.resume} error={errors.resume} icon={<FileText size={24}/>} />}
            </>
        )}
        {accountType === 'organization' && (
             <>
                <InputField name="orgName" type="text" placeholder="Organization Name *" value={formData.orgName} onChange={handleInputChange} error={errors.orgName} icon={<Building size={16}/>}/>
                <InputField name="industry" type="text" placeholder="Industry (e.g., Technology)" value={formData.industry} onChange={handleInputChange} error={errors.industry} icon={<Briefcase size={16}/>}/>
                <InputField name="website" type="url" placeholder="Website URL" value={formData.website} onChange={handleInputChange} error={errors.website} icon={<Globe size={16}/>}/>
                <FileInputField name="orgLogo" label="Organization Logo" onChange={(e) => handleFileChange(e, 'orgLogo')} preview={previews.orgLogo} error={errors.orgLogo} icon={<ImageIcon size={24}/>}/>
            </>
        )}
    </motion.div>
);

const Step3: FC<{ formData: any, handleInputChange: any, errors: any }> = ({ formData, handleInputChange, errors }) => (
    <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-4">
        <InputField name="email" type="email" placeholder="Email Address *" value={formData.email} onChange={handleInputChange} error={errors.email} icon={<AtSign size={16}/>} />
        <InputField name="password" type="password" placeholder="Password (min. 8 characters) *" value={formData.password} onChange={handleInputChange} error={errors.password} icon={<Lock size={16}/>} />
        <InputField name="confirmPassword" type="password" placeholder="Confirm Password *" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword} icon={<CheckCircle size={16}/>}/>
        <div className="mt-4 flex items-start">
            <input type="checkbox" id="terms" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleInputChange} className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">I agree to the <a href="/terms" className="font-medium text-blue-600 hover:underline">Terms of Service</a>.</label>
        </div>
        {errors.agreedToTerms && <p className="text-xs text-red-600 mt-1">{errors.agreedToTerms}</p>}
    </motion.div>
);

// --- MAIN REGISTRATION PAGE COMPONENT ---
export default function ProductionRegistrationPage() {
    const router = useRouter();
    
    // --- State Management ---
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState<AccountType | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        professionalTitle: '',
        bio: '',
        orgName: '',
        industry: '',
        website: '',
        profilePicture: null as File | null,
        resume: null as File | null,
        orgLogo: null as File | null,
        agreedToTerms: false,
    });
    const [previews, setPreviews] = useState({ profilePicture: '', resume: '', orgLogo: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
    // --- Handlers ---
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const isCheckbox = type === 'checkbox';
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'profilePicture' | 'resume' | 'orgLogo') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedImageTypes = ['image/png', 'image/jpeg'];
        if ((field === 'profilePicture' || field === 'orgLogo') && !allowedImageTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, [field]: "Please use a PNG or JPG file." }));
            return;
        }
        if (field === 'resume' && file.type !== 'application/pdf') {
            setErrors(prev => ({ ...prev, [field]: "Please use a PDF file." }));
            return;
        }
        
        setFormData(prev => ({ ...prev, [field]: file }));
        if (field !== 'resume') {
             setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
        }
        setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
    };

    const validateStep = () => {
        const newErrors: Record<string, string> = {};
        if (step === 2) {
            if ((accountType === 'professional' || accountType === 'individual') && !formData.fullName.trim()) {
                newErrors.fullName = "Full name is required.";
            }
            if (accountType === 'organization' && !formData.orgName.trim()) {
                newErrors.orgName = "Organization name is required.";
            }
        }
        if (step === 3) {
            if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Please enter a valid email.";
            if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
            if (!formData.agreedToTerms) newErrors.agreedToTerms = "You must agree to the terms of service.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => { if (validateStep()) setStep(s => s + 1); };
    const handleBack = () => { setErrors({}); setStep(s => s - 1); };

    // --- Main Submission Handler with Full Profile Creation ---
    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;

        setLoading(true);
        setSubmitError(null);

        try {
            // Step 1: Create the user in Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (signUpError) throw signUpError;
            const user = authData.user;
            if (!user) throw new Error("Registration failed, user not created.");

            // Step 2: Upload files to Supabase Storage if they exist
            let profilePicUrl = null, orgLogoUrl = null;
            if (formData.profilePicture) {
                const filePath = `${user.id}/avatar.png`;
                const { error } = await supabase.storage.from('avatars').upload(filePath, formData.profilePicture, { upsert: true });
                if (error) throw new Error(`Avatar upload failed: ${error.message}`);
                profilePicUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl;
            }
            if (formData.orgLogo) {
                const filePath = `${user.id}/logo.png`;
                const { error } = await supabase.storage.from('logos').upload(filePath, formData.orgLogo, { upsert: true });
                if (error) throw new Error(`Logo upload failed: ${error.message}`);
                orgLogoUrl = supabase.storage.from('logos').getPublicUrl(filePath).data.publicUrl;
            }
            // (Resume upload would be similar but is omitted from the profile table for now)

            // Step 3: Prepare the detailed profile object for the database
            const profileData = {
                id: user.id, // Links to the auth.users table
                account_type: accountType,
                email: formData.email,
                name: accountType === 'organization' ? formData.orgName : formData.fullName,
                title: formData.professionalTitle,
                bio: formData.bio,
                industry: formData.industry,
                website: formData.website,
                avatar_url: profilePicUrl,
                logo_url: orgLogoUrl,
            };

            // Step 4: Insert the complete profile into the 'profiles' table
            const { error: profileError } = await supabase.from('profiles').insert(profileData);
            if (profileError) throw profileError;
            
            // Step 5: Success
            alert("Success! Please check your email to confirm your account.");
            router.push('/login');

        } catch (error: any) {
            setSubmitError(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    const steps = [
        { id: 1, title: 'Account Type', component: <Step1 setAccountType={setAccountType} nextStep={() => setStep(2)} /> },
        { id: 2, title: 'Your Details', component: <Step2 accountType={accountType!} formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} previews={previews} errors={errors} /> },
        { id: 3, title: 'Credentials & Review', component: <Step3 formData={formData} handleInputChange={handleInputChange} errors={errors} /> },
    ];
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border p-8 space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div key={step}>
                        <h1 className="text-3xl font-bold text-center text-gray-800">{steps[step - 1].title}</h1>
                        <ProgressBar currentStep={step} totalSteps={steps.length} titles={steps.map(s => s.title)} />

                        {submitError && <div className="my-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"><AlertTriangle size={16} />{submitError}</div>}
                        
                        <form onSubmit={handleSignUp}>
                            {steps[step - 1].component}
                        
                            <div className="mt-8 flex justify-between items-center">
                                {step > 1 ? <button type="button" onClick={handleBack} className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"><ArrowLeft size={16} /> Back</button> : <div />}
                                {step < steps.length ? <button type="button" onClick={handleNext} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Next</button> : null}
                                {step === steps.length ? <button type="submit" disabled={loading} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"><CheckCircle size={18}/> {loading ? "Creating Account..." : "Confirm & Submit"}</button> : null}
                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
                 <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account? <Link href="/login" className="font-bold text-blue-600 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}