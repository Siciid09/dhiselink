"use client";

import React, { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { FormConfig, FormField } from './form-config';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { createClient } from '@/lib/supabase/client';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import RichTextEditor from './RichTextEditor';

// --- Reusable Field Components ---

const FieldWrapper = ({ field, children }: { field: FormField; children: React.ReactNode }) => (
    <div className={field.type === 'richtext' ? 'md:col-span-2' : ''}>
        <label htmlFor={field.name} className="text-sm font-semibold text-slate-800">
            {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1.5">{children}</div>
        {field.helpText && <p className="text-xs text-slate-500 mt-1.5">{field.helpText}</p>}
    </div>
);

const baseInputClasses = "w-full h-11 px-4 rounded-lg bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400";

const InputField = ({ field }: { field: FormField }) => (
    <FieldWrapper field={field}>
        <input type="text" id={field.name} name={field.name} placeholder={field.placeholder} required={field.required} className={baseInputClasses} />
    </FieldWrapper>
);

const TextareaField = ({ field }: { field: FormField }) => (
    <FieldWrapper field={field}>
        <textarea id={field.name} name={field.name} placeholder={field.placeholder} required={field.required} rows={5} className={`${baseInputClasses} h-auto py-3`} />
    </FieldWrapper>
);

const SelectField = ({ field, onChange }: { field: FormField; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
    <FieldWrapper field={field}>
        <select id={field.name} name={field.name} required={field.required} onChange={onChange} className={`${baseInputClasses} appearance-none`}>
            {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </FieldWrapper>
);

const DatePickerField = ({ field, showTimeSelect = false }: { field: FormField; showTimeSelect?: boolean }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    return (
        <FieldWrapper field={field}>
            <DatePicker name={field.name} selected={startDate} onChange={(date) => setStartDate(date)} showTimeSelect={showTimeSelect} dateFormat={showTimeSelect ? "MMMM d, yyyy h:mm aa" : "yyyy-MM-dd"} className={baseInputClasses} placeholderText={field.placeholder || "Select a date"} required={field.required} />
        </FieldWrapper>
    );
};

const FileUploadField = ({ field, user }: { field: FormField; user: User }) => {
    const supabase = createClient();
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const allowMultiple = field.name.includes('gallery') || field.name.includes('images');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setIsUploading(true);
        const uploadPromises = Array.from(files).map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const bucketName = 'public-uploads';
            const filePath = `${user.id}/${field.name}/${uuidv4()}.${fileExt}`;
            const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
            if (error) throw error;
            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
            return data.publicUrl;
        });
        try {
            const urls = await Promise.all(uploadPromises);
            setUploadedFiles(prev => allowMultiple ? [...prev, ...urls] : [urls[0]]);
        } catch (error: any) {
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <FieldWrapper field={field}>
            <input type="hidden" name={field.name} value={uploadedFiles.join(',')} />
            <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor={field.name} className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? <Loader2 className="w-8 h-8 mb-2 text-slate-500 animate-spin" /> : <UploadCloud className="w-8 h-8 mb-2 text-slate-500" />}
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>
                    <input id={field.name} type="file" className="hidden" onChange={handleFileUpload} multiple={allowMultiple} accept="image/*" />
                </label>
            </div>
            {uploadedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {uploadedFiles.map(url => (
                        <div key={url} className="relative">
                            <img src={url} alt="Upload preview" className="w-full h-24 object-cover rounded-md" />
                            <button type="button" onClick={() => setUploadedFiles(prev => prev.filter(u => u !== url))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"><X size={14} /></button>
                        </div>
                    ))}
                </div>
            )}
        </FieldWrapper>
    );
};

const SubmitButton = ({ text }: { text: string }) => {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-lg shadow-md hover:bg-slate-900 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2 min-w-[150px]">
            {pending ? <><Loader2 className="animate-spin" size={20} /><span>Saving...</span></> : text}
        </button>
    );
};


// --- Main CreateForm Component ---
interface CreateFormProps {
    config: FormConfig;
    action: (prevState: any, formData: FormData) => Promise<any>;
    user: User;
    onBack?: () => void;
}

export function CreateForm({ config, action, user, onBack }: CreateFormProps) {
    const initialState = { error: null, success: false };
    const [state, dispatch] = useFormState(action, initialState);
    const [conditionalType, setConditionalType] = useState('');

    const renderField = (field: FormField) => {
        const props = (field.name === 'type' && config.conditionalFields) ? { onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setConditionalType(e.target.value) } : {};
        switch (field.type) {
            case 'textarea': return <TextareaField key={field.name} field={field} />;
            case 'select': return <SelectField key={field.name} field={field} {...props} />;
            case 'date': return <DatePickerField key={field.name} field={field} />;
            case 'datetime': return <DatePickerField key={field.name} field={field} showTimeSelect />;
            case 'upload': return <FileUploadField key={field.name} field={field} user={user} />;
            case 'richtext': return <FieldWrapper field={field}><RichTextEditor name={field.name} required={field.required} /></FieldWrapper>;
            default: return <InputField key={field.name} field={field} />;
        }
    };

    const conditionalFields = config.conditionalFields?.[conditionalType] || [];

    return (
        <form action={dispatch} className="space-y-6">
            <input type="hidden" name="opportunity_type" value={config.opportunityType} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {config.fields.map(field => (
                    <div key={field.name} className={field.type === 'richtext' || field.type === 'upload' ? 'md:col-span-2' : ''}>
                        {renderField(field)}
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {conditionalFields.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 pt-6 border-t overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                            {conditionalFields.map(field => (
                                <div key={field.name} className={field.type === 'richtext' || field.type === 'upload' ? 'md:col-span-2' : ''}>
                                    {renderField(field)}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-6 border-t flex items-center justify-between mt-8">
                {onBack && (
                    <button type="button" onClick={onBack} className="text-sm font-semibold text-slate-600 hover:text-amber-600">
                        &larr; Choose a different type
                    </button>
                )}
                <div className={`flex-grow flex ${onBack ? 'justify-end' : 'justify-start'}`}>
                    <SubmitButton text={config.submitButtonText} />
                </div>
            </div>
            {state.error && <p className="text-center font-medium text-red-600 mt-4 p-3 bg-red-50 rounded-lg">{state.error}</p>}
        </form>
    );
}