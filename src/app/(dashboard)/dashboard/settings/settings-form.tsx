"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { AlertTriangle, CheckCircle, Save } from 'lucide-react';

// --- Reusable UI Components ---
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all">
            <Save size={18} />
            {pending ? "Saving..." : "Save Changes"}
        </button>
    );
}
const InputField = ({ label, name, defaultValue, placeholder, type = "text" }: { label: string, name: string, defaultValue?: any, placeholder?: string, type?: string }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input id={name} name={name} type={type} defaultValue={defaultValue || ''} placeholder={placeholder} className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
    </div>
);
const TextareaField = ({ label, name, defaultValue, placeholder, rows = 4, helpText }: { label: string, name: string, defaultValue?: any, placeholder?: string, rows?: number, helpText?: string }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={name} name={name} defaultValue={Array.isArray(defaultValue) ? defaultValue.join(', ') : defaultValue || ''} placeholder={placeholder} rows={rows} className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
    </div>
);

// --- Role-Specific Form Sections ---
const IndividualFormFields = ({ profile }: { profile: any }) => (
    <>
        <InputField label="Full Name" name="full_name" defaultValue={profile.full_name} />
        <InputField label="Professional Title" name="professional_title" defaultValue={profile.professional_title} placeholder="e.g., Software Engineer" />
        <TextareaField label="Short Bio" name="bio" defaultValue={profile.bio} placeholder="A brief summary about you..." />
        <InputField label="Location" name="location" defaultValue={profile.location} placeholder="e.g., Hargeisa, Somaliland" />
        <TextareaField label="Skills" name="skills" defaultValue={profile.skills} helpText="Enter skills separated by commas (e.g., React, Node.js, Python)" />
        <TextareaField label="Languages" name="languages" defaultValue={profile.languages} helpText="Enter languages separated by commas" />
        <TextareaField label="Certifications" name="certifications" defaultValue={profile.certifications} helpText="Enter certifications separated by commas" />
        <InputField label="Portfolio/Website URL" name="website_url" type="url" defaultValue={profile.website_url} />
        <InputField label="LinkedIn Profile URL" name="linkedin_url" type="url" defaultValue={profile.linkedin_url} />
        <InputField label="GitHub Profile URL" name="github_url" type="url" defaultValue={profile.github_url} />
    </>
);

const OrganizationFormFields = ({ profile }: { profile: any }) => (
     <>
        <InputField label="Organization Name" name="organization_name" defaultValue={profile.organization_name} />
        <InputField label="Industry" name="industry" defaultValue={profile.industry} placeholder="e.g., Technology, Healthcare, Education" />
        <TextareaField label="Organization Summary (Bio)" name="bio" defaultValue={profile.bio} placeholder="A brief summary of your organization..." />
        <InputField label="Location" name="location" defaultValue={profile.location} placeholder="e.g., Hargeisa, Somaliland" />
        <InputField label="Website URL" name="website_url" type="url" defaultValue={profile.website_url} />
        <InputField label="Logo URL" name="logo_url" type="url" defaultValue={profile.logo_url} placeholder="Link to a hosted image of your logo" />
        <InputField label="Banner URL" name="banner_url" type="url" defaultValue={profile.banner_url} placeholder="Link to a hosted image for your profile banner" />
        {/* We can add role-specific fields for university, gov, etc. here in the future */}
    </>
);

// --- Main Form Component ---
export default function SettingsForm({ profile }: { profile: any }) {
    const [state, formAction] = useFormState(updateProfile, { error: null, success: false });

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="role" value={profile.role} />
            <h2 className="text-xl font-bold text-slate-800 border-b pb-4 capitalize">{profile.role?.replace('_', ' & ')} Profile</h2>
            
            {/* --- DYNAMICALLY RENDER FORM FIELDS BASED ON ROLE --- */}
            {profile.role === 'individual' ? 
                <IndividualFormFields profile={profile} /> : 
                <OrganizationFormFields profile={profile} />
            }

            <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200">
                {state.success && (
                    <div className="text-green-600 flex items-center gap-2 animate-pulse">
                        <CheckCircle size={16} />
                        <span>Profile saved successfully!</span>
                    </div>
                )}
                 {state.error && (
                    <div className="text-red-600 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        <span>{state.error}</span>
                    </div>
                )}
                <SubmitButton />
            </div>
        </form>
    );
}