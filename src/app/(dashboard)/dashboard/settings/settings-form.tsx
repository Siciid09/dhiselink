// File: app/settings/SettingsForm.tsx

"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { ChevronUp, Plus, Save, Trash2, UploadCloud } from 'lucide-react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Disclosure, Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid'; // You may need to run: npm install uuid @types/uuid

// --- Reusable UI Components (Now fully included) ---

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-700 disabled:bg-slate-400 transition-all"
        >
            <Save size={18} />
            {pending ? "Saving..." : "Save Changes"}
        </button>
    );
}

const InputField = ({ label, name, defaultValue, placeholder, type = "text", onChange }: { label: string; name: string; defaultValue?: any; placeholder?: string; type?: string; onChange?: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            defaultValue={defaultValue || ''}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full h-11 px-4 rounded-lg bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
        />
    </div>
);

const TextareaField = ({ label, name, defaultValue, placeholder, rows = 4, helpText }: { label: string; name: string; defaultValue?: any; placeholder?: string; rows?: number; helpText?: string; }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea
            id={name}
            name={name}
            defaultValue={Array.isArray(defaultValue) ? defaultValue.join(', ') : defaultValue || ''}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-4 rounded-lg bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
        />
        {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
    </div>
);

const ImageUploadField = ({ label, name, defaultValue, bucketName }: { label: string; name: string; defaultValue: string | null; bucketName: string }) => {
    const supabase = createClientComponentClient();
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState(defaultValue);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) throw new Error('You must select an image to upload.');
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
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
                {fileUrl ? (<img src={fileUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover border-2" />) : (<div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><UploadCloud /></div>)}
                <input type="hidden" name={name} value={fileUrl || ''} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 text-slate-700 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-200" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
            </div>
        </div>
    );
};

// Define a type for items in our dynamic lists
type DynamicItem = { id: string; [key: string]: any; };

const DynamicEntrySection = ({ title, entries, setEntries, fields, placeholderItem }: { title: string; entries: DynamicItem[]; setEntries: React.Dispatch<React.SetStateAction<DynamicItem[]>>; fields: { name: string; label: string; placeholder: string }[]; placeholderItem: any }) => {
    const handleEntryChange = (id: string, field: string, value: string) => {
        const newEntries = entries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry);
        setEntries(newEntries);
    };

    const addEntry = () => setEntries([...entries, { ...placeholderItem, id: uuidv4() }]);
    const removeEntry = (id: string) => setEntries(entries.filter(entry => entry.id !== id));

    return (
        <div>
            {entries.map((entry) => (
                // FIX: Using unique 'entry.id' for the key instead of index for stability.
                <div key={entry.id} className="bg-slate-50 p-4 rounded-lg mb-4 border relative">
                    <button type="button" onClick={() => removeEntry(entry.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="space-y-3">
                        {fields.map(field => (
                            <InputField
                                key={field.name}
                                label={field.label}
                                name={`${field.name}_${entry.id}`} // Still useful for unique IDs in the DOM
                                defaultValue={entry[field.name]}
                                placeholder={field.placeholder}
                                onChange={(e) => handleEntryChange(entry.id, field.name, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            ))}
            <button type="button" onClick={addEntry} className="mt-2 flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-800">
                <Plus size={16} /> Add {title}
            </button>
        </div>
    );
};

const AccordionSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Disclosure defaultOpen>
        {({ open }) => (
            <div className="bg-white rounded-lg p-4 border shadow-sm">
                <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">
                    <span>{title}</span>
                    <ChevronUp className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`} />
                </Disclosure.Button>
                <Transition enter="transition duration-100 ease-out" enterFrom="opacity-0" enterTo="opacity-100" leave="transition duration-75 ease-out" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Disclosure.Panel className="pt-4 mt-4 border-t space-y-4">
                        {children}
                    </Disclosure.Panel>
                </Transition>
            </div>
        )}
    </Disclosure>
);

// --- Main Form Component ---
export default function SettingsForm({ profile, initialJobs = [], initialPrograms = [], initialInitiatives = [] }: { profile: any, initialJobs?: any[], initialPrograms?: any[], initialInitiatives?: any[] }) {
    const [state, formAction] = useFormState(updateProfile, { error: null, success: false });
    
    const [jobs, setJobs] = useState(initialJobs.map(j => ({ ...j, id: j.id || uuidv4() })));
    const [programs, setPrograms] = useState(initialPrograms.map(p => ({ ...p, id: p.id || uuidv4() })));
    const [initiatives, setInitiatives] = useState(initialInitiatives.map(i => ({ ...i, id: i.id || uuidv4() })));
    
    // This state is for the individual profile's dynamic sections
    const [workExperience, setWorkExperience] = useState(profile.work_experience || []);
    const [education, setEducation] = useState(profile.education || []);

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="role" value={profile.role} />
            
            {profile.role !== 'individual' && (
                <>
                    <input type="hidden" name="jobs" value={JSON.stringify(jobs)} />
                    <input type="hidden" name="programs" value={JSON.stringify(programs)} />
                    <input type="hidden" name="initiatives" value={JSON.stringify(initiatives)} />
                </>
            )}

            {profile.role === 'individual' ? (
                <div className="space-y-4">
                     <input type="hidden" name="work_experience" value={JSON.stringify(workExperience)} />
                     <input type="hidden" name="education" value={JSON.stringify(education)} />
                    {/* ... Your individual sections go here ... */}
                </div>
            ) : (
                <div className="space-y-4">
                    <AccordionSection title="Company Branding">
                        <InputField label="Organization Name" name="organization_name" defaultValue={profile.organization_name} />
                        <InputField label="Tagline" name="tagline" defaultValue={profile.tagline}/>
                        <ImageUploadField label="Organization Logo" name="logo_url" defaultValue={profile.logo_url} bucketName="avatars" />
                        <ImageUploadField label="Cover Photo (Banner)" name="cover_image_url" defaultValue={profile.cover_image_url} bucketName="avatars" />
                    </AccordionSection>
                    
                    {/* Other sections like About, Contact, etc. would go here */}

                    {(profile.role === 'company' || profile.role === 'university' || profile.role === 'ngo' || profile.role === 'government') && (
                        <AccordionSection title="Manage Job Postings">
                            <DynamicEntrySection
                                title="Job" entries={jobs} setEntries={setJobs}
                                fields={[
                                    { name: 'title', label: 'Job Title', placeholder: 'e.g., Marketing Manager' },
                                    { name: 'location', label: 'Location', placeholder: 'e.g., Hargeisa' },
                                    { name: 'job_type', label: 'Job Type', placeholder: 'e.g., Full-time' },
                                ]}
                                placeholderItem={{ title: '', location: '', job_type: '' }}
                            />
                        </AccordionSection>
                    )}
                    {profile.role === 'university' && (
                        <AccordionSection title="Manage Programs">
                            <DynamicEntrySection
                                title="Program" entries={programs} setEntries={setPrograms}
                                fields={[
                                    { name: 'title', label: 'Program Name', placeholder: 'e.g., B.Sc. in Computer Science' },
                                    { name: 'department', label: 'Department', placeholder: 'e.g., Faculty of Computing' },
                                    { name: 'duration', label: 'Duration', placeholder: 'e.g., 4 Years' },
                                ]}
                                placeholderItem={{ title: '', department: '', duration: '' }}
                            />
                        </AccordionSection>
                    )}
                     {(profile.role === 'ngo' || profile.role === 'government') && (
                        <AccordionSection title="Manage Initiatives/Tenders">
                             <DynamicEntrySection
                                title="Initiative" entries={initiatives} setEntries={setInitiatives}
                                fields={[
                                    { name: 'title', label: 'Title', placeholder: 'e.g., Clean Water Project' },
                                    { name: 'type', label: 'Type', placeholder: 'e.g., Project, Tender' },
                                    { name: 'status', label: 'Status', placeholder: 'e.g., Ongoing, Open' },
                                ]}
                                placeholderItem={{ title: '', type: '', status: '' }}
                            />
                        </AccordionSection>
                    )}
                </div>
            )}
            <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200">
                {state.success && <div className="text-green-600"><span>Profile saved!</span></div>}
                {state.error && <div className="text-red-600"><span>{state.error}</span></div>}
                <SubmitButton />
            </div>
        </form>
    );
}