"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile, deleteAccount } from './actions';
import { Save, CheckCircle, AlertTriangle, ChevronUp, UploadCloud, FileText, Plus, Trash2, ShieldAlert } from 'lucide-react';
import React, { useState, useRef, ChangeEvent, useTransition } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';

// --- Reusable Components (Unchanged) ---
function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-sm hover:bg-sky-700 disabled:bg-slate-400 transition-colors"><Save size={18} /> {pending ? "Saving..." : "Save All Changes"}</button>;
}

const InputField = ({ label, name, value, ...props }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{props.required && <span className="text-red-500">*</span>}</label>
        <input id={name} name={name} value={value || ''} {...props} className="w-full h-11 px-4 rounded-lg bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
    </div>
);

const SelectField = ({ label, name, value, options, ...props }: any) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{props.required && <span className="text-red-500">*</span>}</label>
        <select id={name} name={name} value={value || ''} {...props} className="w-full h-11 px-4 rounded-lg bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
             <option value="">-- Select --</option>
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextareaField = ({ label, name, value, helpText, ...props }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea id={name} name={name} value={Array.isArray(value) ? value.join(', ') : value || ''} {...props} className="w-full p-4 rounded-lg bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
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
    
    const isImage = !props.acceptedFileTypes || props.acceptedFileTypes.includes("image");

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                {isImage ? (
                    fileUrl ? <img src={fileUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover border" /> : <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center border"><UploadCloud /></div>
                ) : (
                    fileUrl ? <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-lg text-sm flex items-center gap-2"><FileText size={16} /><span>View Uploaded File</span></a> : <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center border"><FileText /></div>
                )}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                <input type="file" ref={fileInputRef} onChange={handleUpload} {...props} className="hidden" />
            </div>
             {props.helpText && <p className="text-xs text-slate-500 mt-1">{props.helpText}</p>}
        </div>
    );
};

type DynamicItem = { id: string; [key: string]: any; };
const DynamicEntrySection = ({ title, entries = [], setEntries, fields, placeholderItem }: any) => {
    const handleEntryChange = (id: string, field: string, value: string) => setEntries(entries.map((e: any) => e.id === id ? { ...e, [field]: value } : e));
    const addEntry = () => setEntries([...entries, { ...placeholderItem, id: uuidv4() }]);
    const removeEntry = (id: string) => setEntries(entries.filter((e: any) => e.id !== id));

    return (
        <div>
            {entries.map((entry: DynamicItem) => (
                <div key={entry.id} className="bg-slate-50 p-4 rounded-lg mb-4 border relative">
                    <button type="button" onClick={() => removeEntry(entry.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field: any) => field.type === 'select' ?
                            <SelectField key={field.name} label={field.label} value={entry[field.name]} options={field.options} onChange={(e: any) => handleEntryChange(entry.id, field.name, e.target.value)} /> :
                            <InputField key={field.name} label={field.label} value={entry[field.name]} placeholder={field.placeholder} onChange={(e: any) => handleEntryChange(entry.id, field.name, e.target.value)} />
                        )}
                    </div>
                </div>
            ))}
            <button type="button" onClick={addEntry} className="mt-2 flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"><Plus size={16} /> Add {title}</button>
        </div>
    );
};

const AccordionSection = ({ title, children }: any) => (
    <Disclosure defaultOpen>
        {({ open }) => (
            <div className="bg-white rounded-lg p-4 border shadow-sm">
                <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800"><span>{title}</span><ChevronUp className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`} /></Disclosure.Button>
                <Transition as={React.Fragment} enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
                    <Disclosure.Panel className="pt-4 mt-4 border-t space-y-4">{children}</Disclosure.Panel>
                </Transition>
            </div>
        )}
    </Disclosure>
);

// --- New Delete Account Modal ---
function DeleteAccountModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = () => {
        startTransition(async () => {
            await deleteAccount();
        });
    };

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900 flex items-center gap-2"><ShieldAlert className="text-red-500"/>Permanently Delete Account</Dialog.Title>
                                <div className="mt-4 space-y-4">
                                    <p className="text-sm text-slate-600">This action cannot be undone. This will permanently delete your profile, content, and all associated data.</p>
                                    <p className="text-sm text-slate-600 font-medium">To confirm, please type <strong className="text-red-600">delete</strong> into the box below.</p>
                                    <InputField name="confirm" value={confirmText} onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmText(e.target.value)} />
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button type="button" className="px-4 py-2 text-sm font-medium rounded-md bg-slate-100 hover:bg-slate-200" onClick={onClose}>Cancel</button>
                                    <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300" onClick={handleDelete} disabled={confirmText !== 'delete' || isPending}>
                                        {isPending ? 'Deleting...' : 'Delete Account'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}


// --- Main Form Component ---
export default function SettingsForm({ profile }: { profile: any }) {
    const [state, formAction] = useFormState(updateProfile, { error: null, success: false });
    const isIndividual = profile.role === 'individual';
    const orgType = profile.organization_type;
    
    const [formData, setFormData] = useState(profile);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const handleChange = (e: ChangeEvent<any>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileUploadComplete = (name: string, url: string) => setFormData({ ...formData, [name]: url });

    // Dynamic entry states
    const [workExperience, setWorkExperience] = useState(profile.work_experience?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);
    const [education, setEducation] = useState(profile.education?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);
    const [certifications, setCertifications] = useState(profile.certifications?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);
    const [awards, setAwards] = useState(profile.awards?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);
    const [keyContacts, setKeyContacts] = useState(profile.key_contacts?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);
    const [notableAlumni, setNotableAlumni] = useState(profile.notable_alumni?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);
    const [projects, setProjects] = useState(profile.projects?.map((i: any) => ({...i, id: i.id || uuidv4() })) || []);

    return (
        <>
            <form action={formAction} className="space-y-6">
                {/* Hidden fields to pass essential data */}
                <input type="hidden" name="id" value={profile.id} />
                <input type="hidden" name="role" value={profile.role} />
                <input type="hidden" name="organization_type" value={orgType} />
                
                {/* Hidden fields for file uploads */}
                <input type="hidden" name="avatar_url" value={formData.avatar_url || ''} />
                <input type="hidden" name="resume_url" value={formData.resume_url || ''} />
                <input type="hidden" name="logo_url" value={formData.logo_url || ''} />
                <input type="hidden" name="cover_image_url" value={formData.cover_image_url || ''} />

                {/* Hidden fields for dynamic JSON data */}
                <input type="hidden" name="work_experience" value={JSON.stringify(workExperience)} />
                <input type="hidden" name="education" value={JSON.stringify(education)} />
                <input type="hidden" name="certifications" value={JSON.stringify(certifications)} />
                <input type="hidden" name="awards" value={JSON.stringify(awards)} />
                <input type="hidden" name="key_contacts" value={JSON.stringify(keyContacts)} />
                <input type="hidden" name="notable_alumni" value={JSON.stringify(notableAlumni)} />
                <input type="hidden" name="projects" value={JSON.stringify(projects)} />


                {isIndividual ? (
                    // --- INDIVIDUAL FORM ---
                    <>
                        <AccordionSection title="Core Identity"><InputField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required /><InputField label="Professional Title" name="professional_title" value={formData.professional_title} onChange={handleChange} required /><InputField label="Location" name="location" value={formData.location} onChange={handleChange} required /><SelectField label="Experience Level" name="experience_level" value={formData.experience_level} onChange={handleChange} options={['Student/Intern', 'Entry-Level', 'Mid-Level', 'Senior-Level', 'Executive']} required /></AccordionSection>
                        <AccordionSection title="Profile Media"><FileUploadField label="Profile Picture" name="avatar_url" defaultValue={formData.avatar_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} /><FileUploadField label="Resume / CV" name="resume_url" defaultValue={formData.resume_url} bucketName="resumes" userId={profile.id} onUploadComplete={handleFileUploadComplete} acceptedFileTypes=".pdf,.doc,.docx" helpText="Upload in PDF, DOC, or DOCX format." /></AccordionSection>
                        <AccordionSection title="Professional Profile"><TextareaField label="Bio / Summary" name="bio" value={formData.bio} onChange={handleChange} rows={5} required /><InputField label="Industry / Sector" name="industry" value={formData.industry} onChange={handleChange} required /><InputField label="Years of Experience" name="years_of_experience" type="number" value={formData.years_of_experience} onChange={handleChange} required /><TextareaField label="Core Skills" name="skills" value={formData.skills} onChange={handleChange} helpText="Separate skills with a comma." required /><TextareaField label="Languages Spoken" name="languages" value={formData.languages} onChange={handleChange} helpText="Separate languages with a comma." /></AccordionSection>
                        <AccordionSection title="Work Experience"><DynamicEntrySection title="Experience" entries={workExperience} setEntries={setWorkExperience} fields={[ { name: 'title', label: 'Job Title' }, { name: 'company', label: 'Company' }, { name: 'duration', label: 'Duration (e.g., 2020-Present)' }]} placeholderItem={{ title: '', company: '', duration: '' }} /></AccordionSection>
                        <AccordionSection title="Education"><DynamicEntrySection title="Education" entries={education} setEntries={setEducation} fields={[ { name: 'degree', label: 'Degree' }, { name: 'school', label: 'School / University' }, { name: 'field_of_study', label: 'Field of Study' }]} placeholderItem={{ degree: '', school: '', field_of_study: '' }} /></AccordionSection>
                        <AccordionSection title="Certifications"><DynamicEntrySection title="Certification" entries={certifications} setEntries={setCertifications} fields={[ { name: 'name', label: 'Certification Name' }, { name: 'issuer', label: 'Issuing Body' }, { name: 'year', label: 'Year Issued' }]} placeholderItem={{ name: '', issuer: '', year: '' }} /></AccordionSection>
                        <AccordionSection title="Awards & Recognition"><DynamicEntrySection title="Award" entries={awards} setEntries={setAwards} fields={[{ name: 'title', label: 'Award Title' }, { name: 'issuer', label: 'Awarded by' }, { name: 'year', label: 'Year' }]} placeholderItem={{ title: '', issuer: '', year: '' }} /></AccordionSection>
                        <AccordionSection title="Contact & Links"><InputField label="Phone / WhatsApp" name="phone" value={formData.phone} onChange={handleChange} /><InputField label="Portfolio URL" name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} /><InputField label="Website URL" name="website_url" value={formData.website_url} onChange={handleChange} /><InputField label="LinkedIn Profile URL" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} /><InputField label="GitHub Profile URL" name="github_url" value={formData.github_url} onChange={handleChange} /></AccordionSection>
                    </>
                ) : (
                    // --- ORGANIZATION FORM ---
                    <>
                        <AccordionSection title="Core Identity">
                            <InputField label="Official Organization Name" name="organization_name" value={formData.organization_name} onChange={handleChange} required />
                             <InputField label="Tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
                            <InputField label="Headquarters Location" name="location" value={formData.location} onChange={handleChange} required />
                             <SelectField label="Organization Sub-Type" name="organization_subtype" value={formData.organization_subtype} onChange={handleChange} options={['For-Profit', 'Non-Profit', 'Government', 'Educational']} />
                            <InputField label="Year Founded" name="year_founded" type="number" value={formData.year_founded} onChange={handleChange} required />
                            <FileUploadField label="Organization Logo" name="logo_url" defaultValue={formData.logo_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} acceptedFileTypes="image/*" />
                            <FileUploadField label="Cover Photo (Banner)" name="cover_image_url" defaultValue={formData.cover_image_url} bucketName="avatars" userId={profile.id} onUploadComplete={handleFileUploadComplete} acceptedFileTypes="image/*" />
                        </AccordionSection>
                        
                        <AccordionSection title="Profile & Mission">
                            <TextareaField label="About Us / Mission Statement" name="bio" value={formData.bio} onChange={handleChange} rows={5} required />
                            <TextareaField label="Vision & Core Values" name="mission_vision" value={formData.mission_vision} onChange={handleChange} rows={3} />
                            <SelectField label="Number of Employees" name="employee_count" value={formData.employee_count} onChange={handleChange} options={['1-10', '11-50', '51-200', '201-1000', '1001+']} required />
                            <TextareaField label="Tags / Keywords" name="tags" value={formData.tags} onChange={handleChange} helpText="Separate with commas (e.g., Tech, Healthcare, Education)" />
                        </AccordionSection>

                        <AccordionSection title="Operations & Offerings">
                            {orgType === 'Company' && <><InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} required /><TextareaField label="Key Services" name="key_services" value={formData.key_services} onChange={handleChange} helpText="List your main services, separated by commas." /><TextareaField label="Products Offered" name="products_offerings" value={formData.products_offerings} onChange={handleChange} helpText="List your main products, separated by commas." /></>}
                            <TextareaField label="Operating Regions / Branch Locations" name="operating_regions" value={formData.operating_regions} onChange={handleChange} helpText="Separate regions with a comma." />
                        </AccordionSection>

                        {/* UNIVERSITY-SPECIFIC FIELDS */}
                        {orgType === 'University' && (
                            <AccordionSection title="Academic Information">
                                <InputField label="Accreditation" name="accreditation" value={formData.accreditation} onChange={handleChange} />
                                <TextareaField label="Faculties" name="faculties" value={formData.faculties} onChange={handleChange} helpText="Separate with commas." />
                                <TextareaField label="Departments" name="departments" value={formData.departments} onChange={handleChange} helpText="Separate with commas." />
                                <TextareaField label="Academic Programs" name="programs" value={formData.programs} onChange={handleChange} helpText="List key programs, separated by commas." />
                                <TextareaField label="Major Research Projects" name="research_projects" value={formData.research_projects} onChange={handleChange} helpText="List major projects, separated by commas." />
                                <DynamicEntrySection title="Notable Alumni" entries={notableAlumni} setEntries={setNotableAlumni} fields={[{ name: 'name', label: 'Alumni Name' }, { name: 'achievement', label: 'Notable Achievement' }]} placeholderItem={{ name: '', achievement: '' }} />
                            </AccordionSection>
                        )}
                        
                        {/* NGO-SPECIFIC FIELDS */}
                        {orgType === 'NGO' && (
                            <AccordionSection title="Community & Impact">
                                <InputField label="Community Focus" name="community_focus" value={formData.community_focus} onChange={handleChange} required />
                                <InputField label="Members Count" name="members_count" type="number" value={formData.members_count} onChange={handleChange} />
                                <TextareaField label="Public Services" name="public_services" value={formData.public_services} onChange={handleChange} helpText="List services offered, separated by commas." />
                                <TextareaField label="Announcements" name="announcements" value={formData.announcements} onChange={handleChange} rows={4} />
                                <DynamicEntrySection title="Projects" entries={projects} setEntries={setProjects} fields={[{ name: 'name', label: 'Project Name' }, { name: 'description', label: 'Brief Description' }]} placeholderItem={{ name: '', description: '' }} />
                            </AccordionSection>
                        )}
                        
                        <AccordionSection title="Awards & Recognition"><DynamicEntrySection title="Award" entries={awards} setEntries={setAwards} fields={[{ name: 'title', label: 'Award Title' }, { name: 'issuer', label: 'Awarded by' }, { name: 'year', label: 'Year' }]} placeholderItem={{ title: '', issuer: '', year: '' }} /></AccordionSection>

                        <AccordionSection title="Contact & Links">
                            <InputField label="Official Website URL" name="website_url" value={formData.website_url} onChange={handleChange} required />
                            <InputField label="Public Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            <InputField label="Public Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                            <TextareaField label="Social Media Links" name="social_links" value={formData.social_links} onChange={handleChange} helpText="Provide full URLs, one per line." />
                            <DynamicEntrySection title="Key Contacts" entries={keyContacts} setEntries={setKeyContacts} fields={[{ name: 'name', label: 'Contact Name' }, { name: 'title', label: 'Title/Role' }, { name: 'email', label: 'Email' }]} placeholderItem={{ name: '', title: '', email: '' }} />
                        </AccordionSection>
                    </>
                )}

                <div className="flex justify-end items-center gap-4 pt-6 border-t">
                    {state.success && <div className="text-green-600 flex items-center gap-2 mr-auto"><CheckCircle size={16} /><span>Profile saved successfully!</span></div>}
                    {state.error && <div className="text-red-600 flex items-center gap-2 mr-auto"><AlertTriangle size={16} /><span>{state.error}</span></div>}
                    <SubmitButton />
                </div>
            </form>

            {/* --- Danger Zone Section --- */}
            <div className="mt-10 pt-6 border-t-2 border-red-200">
                <h2 className="text-xl font-bold text-red-700">Danger Zone</h2>
                <p className="text-slate-600 mt-1">These actions are permanent and cannot be undone.</p>
                <div className="mt-4">
                    <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                        Delete My Account
                    </button>
                </div>
            </div>

            <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
        </>
    );
}