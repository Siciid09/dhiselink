"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { Save, CheckCircle, AlertTriangle, ChevronUp, UploadCloud, FileText, Plus, Trash2 } from 'lucide-react';
import React, { useState, useRef, ChangeEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Disclosure, Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';

// --- Reusable Components (No changes needed here) ---
function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg disabled:bg-slate-400"><Save size={18} /> {pending ? "Saving..." : "Save All Changes"}</button>;
}

const InputField = ({ label, name, value, ...props }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{props.required && <span className="text-red-500">*</span>}</label>
        <input id={name} name={name} value={value || ''} {...props} className="w-full h-11 px-4 rounded-lg bg-slate-100 border focus:ring-2 focus:ring-sky-500" />
    </div>
);

const SelectField = ({ label, name, value, options, ...props }: any) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{props.required && <span className="text-red-500">*</span>}</label>
        <select id={name} name={name} value={value || ''} {...props} className="w-full h-11 px-4 rounded-lg bg-slate-100 border focus:ring-2 focus:ring-sky-500">
             <option value="">-- Select --</option>
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextareaField = ({ label, name, value, helpText, ...props }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={name} name={name} value={Array.isArray(value) ? value.join(', ') : value || ''} {...props} className="w-full p-4 rounded-lg bg-slate-100 border focus:ring-2 focus:ring-sky-500" />
        {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
    </div>
);

const FileUploadField = ({ label, name, defaultValue, bucketName, userId, onUploadComplete, ...props }: any) => {
    const supabase = createClientComponentClient();
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
    
    const isImage = props.acceptedFileTypes?.includes("image");

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                {isImage ? (
                    fileUrl ? <img src={fileUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover border" /> : <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center"><UploadCloud /></div>
                ) : (
                    fileUrl ? <div className="p-2 bg-slate-100 rounded-lg"><FileText className="inline-block mr-2" />File uploaded</div> : <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center"><FileText /></div>
                )}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 font-semibold py-2 px-4 rounded-lg" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                <input type="file" ref={fileInputRef} onChange={handleUpload} {...props} className="hidden" />
            </div>
             {props.helpText && <p className="text-xs text-slate-500 mt-1">{props.helpText}</p>}
        </div>
    );
};

type DynamicItem = { id: string; [key: string]: any; };
const DynamicEntrySection = ({ title, entries, setEntries, fields, placeholderItem }: any) => {
    const handleEntryChange = (id: string, field: string, value: string) => setEntries(entries.map((e: any) => e.id === id ? { ...e, [field]: value } : e));
    const addEntry = () => setEntries([...entries, { ...placeholderItem, id: uuidv4() }]);
    const removeEntry = (id: string) => setEntries(entries.filter((e: any) => e.id !== id));

    return (
        <div>
            {entries.map((entry: DynamicItem) => (
                <div key={entry.id} className="bg-slate-50 p-4 rounded-lg mb-4 border relative">
                    <button type="button" onClick={() => removeEntry(entry.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="space-y-3">
                        {fields.map((field: any) => field.type === 'select' ?
                            <SelectField key={field.name} label={field.label} value={entry[field.name]} options={field.options} onChange={(e: any) => handleEntryChange(entry.id, field.name, e.target.value)} /> :
                            <InputField key={field.name} label={field.label} value={entry[field.name]} placeholder={field.placeholder} onChange={(e: any) => handleEntryChange(entry.id, field.name, e.target.value)} />
                        )}
                    </div>
                </div>
            ))}
            <button type="button" onClick={addEntry} className="mt-2 flex items-center gap-2 text-sm font-semibold text-sky-600"><Plus size={16} /> Add {title}</button>
        </div>
    );
};

const AccordionSection = ({ title, children }: any) => (
    <Disclosure defaultOpen>
        {({ open }) => (
            <div className="bg-white rounded-lg p-4 border shadow-sm">
                <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800"><span>{title}</span><ChevronUp className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`} /></Disclosure.Button>
                <Transition as={React.Fragment} enter="transition duration-100 ease-out" enterFrom="opacity-0" enterTo="opacity-100" leave="transition duration-75 ease-out" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Disclosure.Panel className="pt-4 mt-4 border-t space-y-4">{children}</Disclosure.Panel>
                </Transition>
            </div>
        )}
    </Disclosure>
);

// --- Main Form Component ---
export default function SettingsForm({ profile }: { profile: any }) {
    const [state, formAction] = useFormState(updateProfile, { error: null, success: false });
    const isIndividual = profile.role === 'individual';
    const orgType = profile.organization_type;
    
    const [formData, setFormData] = useState(profile);
    
    const handleChange = (e: ChangeEvent<any>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileUploadComplete = (name: string, url: string) => setFormData({ ...formData, [name]: url });

    const [workExperience, setWorkExperience] = useState(profile.work_experience?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);
    const [education, setEducation] = useState(profile.education?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);
    const [certifications, setCertifications] = useState(profile.certifications?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="role" value={profile.role} />
            <input type="hidden" name="organization_type" value={orgType} />
            
            {Object.entries(formData).map(([key, value]) => (typeof value !== 'object' && <input key={key} type="hidden" name={key} value={value as any} />))}
            {isIndividual && <input type="hidden" name="work_experience" value={JSON.stringify(workExperience)} />}
            {isIndividual && <input type="hidden" name="education" value={JSON.stringify(education)} />}
            {isIndividual && <input type="hidden" name="certifications" value={JSON.stringify(certifications)} />}

            {isIndividual ? (
                // --- INDIVIDUAL FORM ---
                <>
                    <AccordionSection title="Core Identity"><InputField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required /><InputField label="Professional Title" name="professional_title" value={formData.professional_title} onChange={handleChange} required /><InputField label="Location" name="location" value={formData.location} onChange={handleChange} required /><SelectField label="Experience Level" name="experience_level" value={formData.experience_level} onChange={handleChange} options={['Student/Intern', 'Entry-Level', 'Mid-Level', 'Senior-Level', 'Executive']} required /></AccordionSection>
                    <AccordionSection title="Profile Media"><FileUploadField label="Profile Picture" name="avatar_url" defaultValue={formData.avatar_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} /><FileUploadField label="Resume / CV" name="resume_url" defaultValue={formData.resume_url} bucketName="resumes" userId={profile.id} onUploadComplete={handleFileUploadComplete} acceptedFileTypes=".pdf,.doc,.docx" helpText="Upload in PDF, DOC, or DOCX format." /></AccordionSection>
                    <AccordionSection title="Professional Profile"><TextareaField label="Bio / Summary" name="bio" value={formData.bio} onChange={handleChange} rows={5} required /><InputField label="Industry / Sector" name="industry" value={formData.industry} onChange={handleChange} required /><InputField label="Years of Experience" name="years_of_experience" type="number" value={formData.years_of_experience} onChange={handleChange} required /><TextareaField label="Core Skills" name="skills" value={formData.skills} onChange={handleChange} helpText="Separate skills with a comma." required /></AccordionSection>
                    <AccordionSection title="Work Experience"><DynamicEntrySection title="Experience" entries={workExperience} setEntries={setWorkExperience} fields={[ { name: 'title', label: 'Job Title' }, { name: 'company', label: 'Company' }, { name: 'duration', label: 'Duration' }]} placeholderItem={{ title: '', company: '', duration: '' }} /></AccordionSection>
                    <AccordionSection title="Education"><DynamicEntrySection title="Education" entries={education} setEntries={setEducation} fields={[ { name: 'level', label: 'Education Level', type: 'select', options: ["High School", "Diploma", "Bachelor's", "Master's", "PhD"] }, { name: 'school', label: 'School / University' }, { name: 'field', label: 'Field of Study' }]} placeholderItem={{ level: '', school: '', field: '' }} /></AccordionSection>
                    <AccordionSection title="Certifications"><DynamicEntrySection title="Certification" entries={certifications} setEntries={setCertifications} fields={[ { name: 'name', label: 'Certification Name' }, { name: 'issuer', label: 'Issuing Body' }, { name: 'year', label: 'Year Issued' }]} placeholderItem={{ name: '', issuer: '', year: '' }} /></AccordionSection>
                    <AccordionSection title="Contact & Links"><InputField label="Phone / WhatsApp" name="phone" value={formData.phone} onChange={handleChange} required /><InputField label="Website / Portfolio URL" name="website_url" value={formData.website_url} onChange={handleChange} /><InputField label="LinkedIn Profile URL" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} /><InputField label="GitHub Profile URL" name="github_url" value={formData.github_url} onChange={handleChange} /></AccordionSection>
                </>
            ) : (
                // --- ORGANIZATION FORM ---
                <>
                    <AccordionSection title="Core Identity"><InputField label="Official Organization Name" name="organization_name" value={formData.organization_name} onChange={handleChange} required /><InputField label="Headquarters Location" name="location" value={formData.location} onChange={handleChange} required /><InputField label="Year Founded" name="year_founded" type="number" value={formData.year_founded} onChange={handleChange} required /><FileUploadField label="Organization Logo" name="logo_url" defaultValue={formData.logo_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} /><FileUploadField label="Cover Photo (Banner)" name="cover_image_url" defaultValue={formData.cover_image_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} /></AccordionSection>
                    <AccordionSection title="Profile & Mission"><TextareaField label="About Us / Mission (Bio)" name="bio" value={formData.bio} onChange={handleChange} rows={5} required /><SelectField label="Number of Employees" name="employee_count" value={formData.employee_count} onChange={handleChange} options={['1-10', '11-50', '51-200', '201-1000', '1001+']} required /><TextareaField label="Vision & Core Values" name="vision" value={formData.vision} onChange={handleChange} rows={3} /></AccordionSection>
                    <AccordionSection title="Operations & Services">
                        {orgType === 'Company' && <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} required />}
                        {orgType === 'University' && <InputField label="Accreditation" name="accreditation" value={formData.accreditation} onChange={handleChange} required />}
                        {orgType === 'NGO' && <InputField label="Community Focus" name="community_focus" value={formData.community_focus} onChange={handleChange} required />}
                        <TextareaField label="Primary Services / Activities" name="services" value={formData.services} onChange={handleChange} rows={3} />
                        <TextareaField label="Operating Regions / Branch Locations" name="operating_regions" value={formData.operating_regions} onChange={handleChange} helpText="Separate regions with a comma." />
                    </AccordionSection>
                    <AccordionSection title="Contact & Links"><InputField label="Official Website URL" name="website_url" value={formData.website_url} onChange={handleChange} required /><InputField label="Public Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} required /><InputField label="Public Phone Number" name="phone" value={formData.phone} onChange={handleChange} required /><TextareaField label="Social Media (LinkedIn, Facebook, etc.)" name="social_media_links" value={formData.social_media_links} onChange={handleChange} helpText="Provide full URLs, separated by commas." /></AccordionSection>
                </>
            )}

            <div className="flex justify-end items-center gap-4 pt-6 border-t">
                {state.success && <div className="text-green-600 flex items-center gap-2"><CheckCircle size={16} /><span>Profile saved!</span></div>}
                {state.error && <div className="text-red-600 flex items-center gap-2"><AlertTriangle size={16} /><span>{state.error}</span></div>}
                <SubmitButton />
            </div>
        </form>
    );
}