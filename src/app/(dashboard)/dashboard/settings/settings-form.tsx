"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { AlertTriangle, CheckCircle, Save, UploadCloud, ChevronUp } from 'lucide-react';
import { useState, useRef, Fragment } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Disclosure, Transition } from '@headlessui/react';

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
        <input id={name} name={name} type={type} defaultValue={defaultValue || ''} placeholder={placeholder} className="w-full h-11 px-4 rounded-lg bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
    </div>
);

const TextareaField = ({ label, name, defaultValue, placeholder, rows = 4, helpText }: { label: string, name: string, defaultValue?: any, placeholder?: string, rows?: number, helpText?: string }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={name} name={name} defaultValue={Array.isArray(defaultValue) ? defaultValue.join(', ') : (typeof defaultValue === 'object' && defaultValue !== null ? JSON.stringify(defaultValue, null, 2) : defaultValue || '')} placeholder={placeholder} rows={rows} className="w-full p-4 rounded-lg bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs" />
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
            if (!event.target.files || event.target.files.length === 0) { throw new Error('You must select an image to upload.'); }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
            setFileUrl(data.publicUrl);
        } catch (error) {
            alert('Error uploading file!');
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                {fileUrl ? <img src={fileUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover border-2 border-slate-200" /> : <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><UploadCloud /></div>}
                <input type="hidden" name={name} value={fileUrl || ''} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 text-slate-700 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-200" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
            </div>
        </div>
    );
};

// --- Main Form Component with Accordion Layout ---
export default function SettingsForm({ profile }: { profile: any }) {
    const [state, formAction] = useFormState(updateProfile, { error: null, success: false });

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="role" value={profile.role} />
            
            {profile.role === 'individual' ? (
              <div className="space-y-4">
                <Disclosure defaultOpen>
                  {({ open }) => (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">Basic Info <ChevronUp className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`} /></Disclosure.Button>
                      <Transition enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
                        <Disclosure.Panel className="pt-4 mt-4 border-t space-y-4">
                            <ImageUploadField label="Profile Photo" name="avatar_url" defaultValue={profile.avatar_url} bucketName="avatars" />
                            <InputField label="Full Name" name="full_name" defaultValue={profile.full_name} />
                            <InputField label="Professional Title" name="professional_title" defaultValue={profile.professional_title} />
                            <InputField label="Email" name="email" type="email" defaultValue={profile.email} />
                            <InputField label="Phone" name="phone" type="tel" defaultValue={profile.phone} />
                            <InputField label="Location" name="location" defaultValue={profile.location} />
                            <TextareaField label="Short Bio / Headline" name="bio" defaultValue={profile.bio} />
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>

                <Disclosure>
                  {({ open }) => (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">Skills & Languages <ChevronUp className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`} /></Disclosure.Button>
                      <Transition enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
                        <Disclosure.Panel className="pt-4 mt-4 border-t space-y-4">
                            <TextareaField label="Skills" name="skills" defaultValue={profile.skills} helpText="Enter skills separated by commas (e.g., React, Next.js)" />
                            <TextareaField label="Languages" name="languages" defaultValue={profile.languages} helpText="Enter languages separated by commas (e.g., English, Somali)" />
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>

                <Disclosure>
                  {({ open }) => (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">Experience & Education<ChevronUp className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`} /></Disclosure.Button>
                      <Transition enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
                        <Disclosure.Panel className="pt-4 mt-4 border-t space-y-4">
                            <TextareaField label="Work Experience" name="work_experience" defaultValue={profile.work_experience} rows={8} helpText='Enter as a JSON array. Example: [{"title": "Engineer", "company": "Dahabshiil", "duration": "2020-Present"}]' />
                            <TextareaField label="Education" name="education" defaultValue={profile.education} rows={8} helpText='Enter as a JSON array. Example: [{"degree": "B.Sc. in CS", "school": "University of Hargeisa", "duration": "2016-2020"}]' />
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
                
                <Disclosure>
                   {({ open }) => (
                     <div className="bg-slate-50 rounded-lg p-4">
                      <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">Portfolio & Links <ChevronUp className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`} /></Disclosure.Button>
                      <Transition enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
                       <Disclosure.Panel className="pt-4 mt-4 border-t space-y-4">
                          <InputField label="Portfolio/Website URL" name="website_url" type="url" defaultValue={profile.website_url} />
                          <InputField label="LinkedIn Profile URL" name="linkedin_url" type="url" defaultValue={profile.linkedin_url} />
                          <InputField label="GitHub Profile URL" name="github_url" type="url" defaultValue={profile.github_url} />
                       </Disclosure.Panel>
                       </Transition>
                     </div>
                   )}
                </Disclosure>
              </div>
            ) : (
                <OrganizationFormFields profile={profile} /> // We can expand this one later
            )}

            <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200">
                {state.success && <div className="text-green-600 flex items-center gap-2"><CheckCircle size={16} /><span>Profile saved!</span></div>}
                {state.error && <div className="text-red-600 flex items-center gap-2"><AlertTriangle size={16} /><span>{state.error}</span></div>}
                <SubmitButton />
            </div>
        </form>
    );
}
