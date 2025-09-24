"use client";

import React, { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { formConfigs, FormConfig, FormField } from './form-config';
import { createOpportunity } from './actions';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UploadCloud, FileText, X, Loader2, Briefcase, BookOpen, Handshake, Shield, Heart, Lightbulb, LucideProps } from 'lucide-react';

// --- Sub-components (self-contained for simplicity) ---
const iconMap: Record<string, React.ElementType<LucideProps>> = { Briefcase, BookOpen, Handshake, Shield, Heart, Lightbulb };
interface ChooserOption { type: string; title: string; description: string; icon: string; }

function ChooserMenu({ options, onSelect }: { options: ChooserOption[], onSelect: (type: string) => void }) {
    return (
        <motion.div className="bg-white rounded-2xl shadow-xl border p-8">
            <div className="text-center mb-8"><h1 className="text-3xl font-bold text-gray-900">What would you like to create?</h1><p className="mt-2 text-gray-600">Your role allows you to create the following content types.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, index) => {
                    const IconComponent = iconMap[option.icon];
                    return (
                        <motion.button key={option.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => onSelect(option.type)} className="text-left p-6 border-2 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all w-full">
                            <div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-gray-100 text-gray-700">{IconComponent && <IconComponent size={24} />}</div><div><h3 className="text-lg font-bold text-gray-900">{option.title}</h3><p className="text-sm text-gray-600">{option.description}</p></div></div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}

const FieldWrapper = ({ field, children }: { field: FormField, children: React.ReactNode }) => (<div><label htmlFor={field.name} className="text-sm font-semibold text-slate-800">{field.label} {field.required && <span className="text-red-500">*</span>}</label><div className="mt-1.5">{children}</div>{field.helpText && <p className="text-xs text-slate-500 mt-1.5">{field.helpText}</p>}</div>);
const baseInputClasses = "w-full h-11 px-4 rounded-lg bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400";
const InputField = ({ field, d }: { field: FormField; d?: any }) => <FieldWrapper field={field}><input type="text" id={field.name} name={field.name} defaultValue={d} placeholder={field.placeholder} required={field.required} className={baseInputClasses} /></FieldWrapper>;
const TextareaField = ({ field, d }: { field: FormField; d?: any }) => <FieldWrapper field={field}><textarea id={field.name} name={field.name} defaultValue={d} placeholder={field.placeholder} required={field.required} rows={5} className={`${baseInputClasses} h-auto py-3`} /></FieldWrapper>;
const SelectField = ({ field, d }: { field: FormField; d?: any }) => <FieldWrapper field={field}><select id={field.name} name={field.name} defaultValue={d} required={field.required} className={`${baseInputClasses} appearance-none`}>{field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></FieldWrapper>;
const DatePickerField = ({ field, d, showTime }: { field: FormField; d?: any, showTime?: boolean }) => { const [startDate, setStartDate] = useState(d ? new Date(d) : null); return <FieldWrapper field={field}><DatePicker name={field.name} selected={startDate} onChange={setStartDate} showTimeSelect={showTime} dateFormat={showTime ? "MMMM d, yyyy h:mm aa" : "yyyy-MM-dd"} className={baseInputClasses} placeholderText={field.placeholder || "Select a date"} required={field.required} /></FieldWrapper>; };
const FileUploadField = ({ field, user }: { field: FormField; user: User }) => { const supabase = createClientComponentClient(); const [files, setFiles] = useState<string[]>([]); const [isUploading, setUploading] = useState(false); const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { if (!e.target.files) return; setUploading(true); const uploads = Array.from(e.target.files).map(async f => { const path = `${user.id}/attachments/${Date.now()}-${f.name}`; await supabase.storage.from('initiatives').upload(path, f); return supabase.storage.from('initiatives').getPublicUrl(path).data.publicUrl; }); const urls = await Promise.all(uploads); setFiles(prev => [...prev, ...urls]); setUploading(false); }; return <FieldWrapper field={field}><input type="hidden" name={field.name} value={files.join(',')} /><label htmlFor="uf" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100"><div className="text-center pt-5 pb-6"><UploadCloud className="w-8 h-8 mx-auto mb-2 text-slate-500" /><p className="text-sm text-slate-500">Click to upload or drag & drop</p></div><input id="uf" type="file" className="hidden" onChange={handleUpload} multiple /></label>{isUploading && <p>Uploading...</p>}{files.length > 0 && <div className="mt-2 space-y-1">{files.map(url => <div key={url} className="flex items-center justify-between p-1 bg-slate-100 rounded-md text-sm"><div className="flex items-center gap-2"><FileText size={16} /><span className="truncate">{url.split('/').pop()}</span></div><button type="button" onClick={() => setFiles(p => p.filter(u => u !== url))}><X size={16} /></button></div>)}</div>}</FieldWrapper>; };
const SubmitButton = ({ text }: { text: string }) => { const { pending } = useFormStatus(); return <button type="submit" disabled={pending} className="px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2 min-w-[150px]">{pending ? <><Loader2 className="animate-spin" size={20} /><span>Saving...</span></> : text}</button>; };


// --- The Main UI Component with the corrected logic ---
interface CreatePageUIProps { user: User; options: any[]; }

export default function CreatePageUI({ user, options }: CreatePageUIProps) {
    const [selection, setSelection] = useState<string | null>(null);
    const [subType, setSubType] = useState<string>('Project'); // For the internal dropdown
    const [state, formAction] = useFormState(createOpportunity, { error: null, success: false });

    useEffect(() => { if (options.length === 1) { setSelection(options[0].type); } }, [options]);
    
    const config = selection ? formConfigs[selection] : null;

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'textarea': return <TextareaField key={field.name} field={field} />;
            case 'select': return <SelectField key={field.name} field={field} />;
            case 'date': return <DatePickerField key={field.name} field={field} />;
            case 'datetime': return <DatePickerField key={field.name} field={field} showTime />;
            case 'upload': return <FileUploadField key={field.name} field={field} user={user} />;
            default: return <InputField key={field.name} field={field} />;
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div key={selection || 'chooser'} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                {!config ? (
                    <ChooserMenu options={options} onSelect={setSelection} />
                ) : (
                    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-200">
                        <header className="mb-10">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{config.pageTitle}</h1>
                            <p className="mt-2 text-lg text-slate-600">{config.pageDescription}</p>
                        </header>
                        
                        <form action={formAction} className="space-y-6">
                            {config.conditionalFields ? (
                                <>
                                    <input type="hidden" name="opportunity_type" value={subType} />
                                    {config.fields.map(field => (
                                        <div key={field.name}>
                                            <label htmlFor={field.name} className="text-sm font-semibold text-slate-800">{field.label}</label>
                                            <div className="mt-1.5">
                                                <select id={field.name} name="type" required className={baseInputClasses} value={subType} onChange={(e) => setSubType(e.target.value)}>
                                                    {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                    <AnimatePresence>
                                        {subType && config.conditionalFields?.[subType] && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-6 border-t">
                                                {config.conditionalFields[subType].map(field => <div key={field.name} className={field.type === 'textarea' || field.type === 'upload' ? 'md:col-span-2' : ''}>{renderField(field)}</div>)}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <>
                                    <input type="hidden" name="opportunity_type" value={config.opportunityType} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                        {config.fields.map(field => <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>{renderField(field)}</div>)}
                                    </div>
                                </>
                            )}
                            <div className="pt-6 border-t flex items-center justify-between mt-8">
                                {options.length > 1 && <button type="button" onClick={() => setSelection(null)} className="text-sm font-semibold text-slate-600 hover:text-slate-900">&larr; Back to choices</button>}
                                <div className={`flex-grow flex ${options.length > 1 ? 'justify-end' : 'justify-start'}`}><SubmitButton text={config.submitButtonText} /></div>
                            </div>
                            {state.error && <p className="text-center font-medium text-red-600 mt-4 p-3 bg-red-50 rounded-lg">{state.error}</p>}
                        </form>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
