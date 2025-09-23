"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { AlertTriangle, CheckCircle, Save, UploadCloud, ChevronUp } from 'lucide-react';
import { useState, useRef, Fragment } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Disclosure } from '@headlessui/react';

// --- Reusable UI Components (Full Definitions) ---

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

const ImageUploadField = ({ label, name, defaultValue, bucketName }: { label: string, name: string, defaultValue: string | null, bucketName: string }) => {
    const supabase = createClientComponentClient();
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState(defaultValue);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
            setFileUrl(data.publicUrl);

        } catch (error) {
            alert('Error uploading file! Make sure your Supabase Storage is set up correctly.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                {fileUrl ? 
                    <img src={fileUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover border-2 border-slate-200" /> :
                    <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><UploadCloud /></div>
                }
                <input type="hidden" name={name} value={fileUrl || ''} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 text-slate-700 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-200" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
            </div>
        </div>
    );
};

// --- Role-Specific Form Sections ---
const IndividualFormFields = ({ profile }: { profile: any }) => (
    <div className="space-y-4">
        <Disclosure defaultOpen>
          {({ open }) => (
            <div className="bg-slate-50 rounded-lg p-4">
              <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">
                <span>Basic Info</span> <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`} />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-4 space-y-4 border-t mt-4">
                  <ImageUploadField label="Profile Photo" name="avatar_url" defaultValue={profile.avatar_url} bucketName="avatars" />
                  <ImageUploadField label="Cover Photo (Banner)" name="banner_url" defaultValue={profile.banner_url} bucketName="avatars" />
                  <InputField label="Full Name" name="full_name" defaultValue={profile.full_name} />
                  <InputField label="Professional Title" name="professional_title" defaultValue={profile.professional_title} />
                  <InputField label="Email" name="email" type="email" defaultValue={profile.email} />
                  <InputField label="Phone" name="phone" type="tel" defaultValue={profile.phone} />
                  <InputField label="Location" name="location" defaultValue={profile.location} />
                  <TextareaField label="Short Bio" name="bio" defaultValue={profile.bio} />
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        {/* Add other Disclosure sections for Skills, Experience, etc. here */}
    </div>
);

const OrganizationFormFields = ({ profile }: { profile: any }) => (
    <div className="space-y-4">
        <ImageUploadField label="Organization Logo" name="logo_url" defaultValue={profile.logo_url} bucketName="avatars" />
        <ImageUploadField label="Cover Photo (Banner)" name="banner_url" defaultValue={profile.banner_url} bucketName="avatars" />
        <InputField label="Organization Name" name="organization_name" defaultValue={profile.organization_name} />
        <InputField label="Industry" name="industry" defaultValue={profile.industry} />
        <TextareaField label="Organization Summary (Bio)" name="bio" defaultValue={profile.bio} />
        <InputField label="Location" name="location" defaultValue={profile.location} />
        <InputField label="Website URL" name="website_url" type="url" defaultValue={profile.website_url} />
        <InputField label="Contact Email" name="email" type="email" defaultValue={profile.email} />
        <InputField label="Contact Phone" name="phone" type="tel" defaultValue={profile.phone} />
    </div>
);


// --- Main Form Component ---
export default function SettingsForm({ profile }: { profile: any }) {
    const [state, formAction] = useFormState(updateProfile, { error: null, success: false });

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="role" value={profile.role} />
            
            {profile.role === 'individual' ? 
                <IndividualFormFields profile={profile} /> : 
                <OrganizationFormFields profile={profile} />
            }

            <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200">
                {state.success && <div className="text-green-600 flex items-center gap-2"><CheckCircle size={16} /><span>Profile saved!</span></div>}
                {state.error && <div className="text-red-600 flex items-center gap-2"><AlertTriangle size={16} /><span>{state.error}</span></div>}
                <SubmitButton />
            </div>
        </form>
    );
}
