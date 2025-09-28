"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { Save, CheckCircle, AlertTriangle, ChevronUp, UploadCloud, FileText, Plus, Trash2 } from 'lucide-react';
import React, { useState, useRef, ChangeEvent, Fragment } from 'react';
import { createClient } from '@/lib/supabase/client'; // The correct client import
import { Disclosure, Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import type { Profile } from '@/lib/types'; // The correct type import

// --- 1. Reusable UI Components (Complete Definitions) ---

const baseInputClasses = "w-full h-11 px-4 rounded-lg bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-900 disabled:bg-slate-400 transition-colors">
            <Save size={18} /> {pending ? "Saving..." : "Save All Changes"}
        </button>
    );
}

const AccordionSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Disclosure defaultOpen>
        {({ open }) => (
            <div className="bg-white rounded-lg p-6 border shadow-sm">
                <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">
                    <span>{title}</span>
                    <ChevronUp className={`${open ? 'rotate-180' : ''} h-5 w-5 text-slate-500 transition-transform`} />
                </Disclosure.Button>
                <Transition as={Fragment} enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
                    <Disclosure.Panel className="pt-6 mt-6 border-t space-y-6">{children}</Disclosure.Panel>
                </Transition>
            </div>
        )}
    </Disclosure>
);

const InputField = ({ label, name, value, ...props }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{props.required && <span className="text-red-500">*</span>}</label>
        <input id={name} name={name} value={value || ''} {...props} className={baseInputClasses} />
    </div>
);

const SelectField = ({ label, name, value, options, ...props }: any) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{props.required && <span className="text-red-500">*</span>}</label>
        <select id={name} name={name} value={value || ''} {...props} className={`${baseInputClasses} appearance-none`}>
             <option value="">-- Select --</option>
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextareaField = ({ label, name, value, helpText, ...props }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={name} name={name} value={Array.isArray(value) ? value.join(', ') : (value || '')} {...props} className={`${baseInputClasses} h-auto py-3`} />
        {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
    </div>
);

const FileUploadField = ({ label, name, defaultValue, bucketName, userId, onUploadComplete, ...props }: any) => {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState(defaultValue);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) throw new Error('No file selected.');
            const fileExt = file.name.split('.').pop();
            const newFileName = `${userId}/${uuidv4()}.${fileExt}`;
            const { error } = await supabase.storage.from(bucketName).upload(newFileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from(bucketName).getPublicUrl(newFileName);
            setFileUrl(data.publicUrl);
            onUploadComplete(name, data.publicUrl);
        } catch (error: any) { alert(`Error: ${error.message}`); } 
        finally { setUploading(false); }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                {fileUrl ? <img src={fileUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover border" /> : <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center border"><UploadCloud /></div>}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                <input type="file" ref={fileInputRef} onChange={handleUpload} {...props} className="hidden" accept="image/*" />
            </div>
        </div>
    );
};

const DynamicEntrySection = ({ title, entries = [], setEntries, fields, placeholderItem }: any) => {
    const handleEntryChange = (id: string, field: string, value: string) => setEntries(entries.map((e: any) => e.id === id ? { ...e, [field]: value } : e));
    const addEntry = () => setEntries([...entries, { ...placeholderItem, id: uuidv4() }]);
    const removeEntry = (id: string) => setEntries(entries.filter((e: any) => e.id !== id));

    return (
        <div>
            {entries.map((entry: any) => (
                <div key={entry.id} className="bg-slate-50 p-4 rounded-lg mb-4 border relative">
                    <button type="button" onClick={() => removeEntry(entry.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field: any) => <InputField key={field.name} label={field.label} value={entry[field.name]} placeholder={field.placeholder} onChange={(e: any) => handleEntryChange(entry.id, field.name, e.target.value)} />)}
                    </div>
                </div>
            ))}
            <button type="button" onClick={addEntry} className="mt-2 flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"><Plus size={16} /> Add {title}</button>
        </div>
    );
};

// --- 2. Main Settings Form Component ---
export default function SettingsForm({ profile }: { profile: Profile }) {
    const [state, formAction] = useFormState(updateProfile, { error: null, success: false });
    const isIndividual = profile.role === 'individual';
    
    const [formData, setFormData] = useState(profile);
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleFileUploadComplete = (name: string, url: string) => {
        setFormData({ ...formData, [name]: url });
    };

    const [workExperience, setWorkExperience] = useState(profile.work_experience || []);
    const [education, setEducation] = useState(profile.education || []);
    const [awards, setAwards] = useState(profile.awards || []);

    return (
        <form action={formAction} className="space-y-6">
            {/* Hidden fields */}
            <input type="hidden" name="work_experience" value={JSON.stringify(workExperience)} />
            <input type="hidden" name="education" value={JSON.stringify(education)} />
            <input type="hidden" name="awards" value={JSON.stringify(awards)} />
            <input type="hidden" name="avatar_url" value={formData.avatar_url || ''} />
            <input type="hidden" name="logo_url" value={formData.logo_url || ''} />
            <input type="hidden" name="cover_image_url" value={formData.cover_image_url || ''} />

            {isIndividual ? (
                // --- INDIVIDUAL FORM (Comprehensive) ---
                <>
                    <AccordionSection title="Core Identity">
                        <InputField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                        <InputField label="Professional Title" name="professional_title" value={formData.professional_title} onChange={handleChange} required />
                        <InputField label="Location" name="location" value={formData.location} onChange={handleChange} required />
                    </AccordionSection>
                    <AccordionSection title="Profile Media">
                        <FileUploadField label="Profile Picture" name="avatar_url" defaultValue={formData.avatar_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} />
                    </AccordionSection>
                    <AccordionSection title="Professional Details">
                        <TextareaField label="Bio / Summary" name="bio" value={formData.bio} onChange={handleChange} rows={5} />
                        <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} />
                        <TextareaField label="Core Skills" name="skills" value={formData.skills} onChange={handleChange} helpText="Separate skills with a comma." />
                        <TextareaField label="Languages" name="languages" value={formData.languages} onChange={handleChange} helpText="Separate languages with a comma." />
                    </AccordionSection>
                    <AccordionSection title="Contact & Links">
                        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                        <InputField label="Website / Portfolio URL" name="website_url" type="url" value={formData.website_url} onChange={handleChange} />
                        <InputField label="LinkedIn URL" name="linkedin_url" type="url" value={formData.linkedin_url} onChange={handleChange} />
                        <InputField label="GitHub URL" name="github_url" type="url" value={formData.github_url} onChange={handleChange} />
                    </AccordionSection>
                    <AccordionSection title="Work Experience">
                        <DynamicEntrySection title="Experience" entries={workExperience} setEntries={setWorkExperience} fields={[ { name: 'title', label: 'Job Title' }, { name: 'company', label: 'Company' }, { name: 'duration', label: 'Duration' }]} placeholderItem={{ title: '', company: '', duration: '' }} />
                    </AccordionSection>
                    <AccordionSection title="Education">
                        <DynamicEntrySection title="Education" entries={education} setEntries={setEducation} fields={[ { name: 'degree', label: 'Degree' }, { name: 'school', label: 'School' }, { name: 'field_of_study', label: 'Field of Study' }]} placeholderItem={{ degree: '', school: '', field_of_study: '' }} />
                    </AccordionSection>
                </>
            ) : (
                // --- ORGANIZATION FORM (Comprehensive) ---
                <>
                     <AccordionSection title="Core Identity">
                        <InputField label="Organization Name" name="organization_name" value={formData.organization_name} onChange={handleChange} required />
                        <InputField label="Tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
                        <InputField label="Location" name="location" value={formData.location} onChange={handleChange} required />
                        <InputField label="Year Founded" name="year_founded" type="number" value={formData.year_founded} onChange={handleChange} />
                     </AccordionSection>
                     <AccordionSection title="Profile Media">
                        <FileUploadField label="Organization Logo" name="logo_url" defaultValue={formData.logo_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} />
                        <FileUploadField label="Cover Photo (Banner)" name="cover_image_url" defaultValue={formData.cover_image_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} />
                     </AccordionSection>
                     <AccordionSection title="About & Details">
                        <TextareaField label="About / Mission" name="bio" value={formData.bio} onChange={handleChange} rows={5} />
                        <InputField label="Website URL" name="website_url" type="url" value={formData.website_url} onChange={handleChange} />
                        <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} />
                        <TextareaField label="Tags" name="tags" value={formData.tags} onChange={handleChange} helpText="Comma-separated keywords." />
                        <SelectField label="Employee Count" name="employee_count" value={formData.employee_count} onChange={handleChange} options={['1-10', '11-50', '51-200', '201-1000', '1001+']} />
                     </AccordionSection>
                      <AccordionSection title="Awards & Recognition">
                        <DynamicEntrySection title="Award" entries={awards} setEntries={setAwards} fields={[{ name: 'title', label: 'Award Title' }, { name: 'issuer', label: 'Awarded by' }, { name: 'year', label: 'Year' }]} placeholderItem={{ title: '', issuer: '', year: '' }} />
                    </AccordionSection>
                </>
            )}

            <div className="flex justify-end items-center gap-4 pt-6 border-t mt-8">
                {state.success && <div className="text-green-600 flex items-center gap-2 mr-auto"><CheckCircle size={16} /><span>Profile saved!</span></div>}
                {state.error && <div className="text-red-600 flex items-center gap-2 mr-auto"><AlertTriangle size={16} /><span>{state.error}</span></div>}
                <SubmitButton />
            </div>
        </form>
    );
}