"use client";

import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { FormConfig, FormField } from './form-config';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useFormStatus } from 'react-dom';

// --- START: All Field components are now defined in this file ---

const FieldWrapper = ({ field, children }: { field: FormField, children: React.ReactNode }) => (
    <div>
        <label htmlFor={field.name} className="text-sm font-semibold text-slate-800">
            {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1.5">{children}</div>
        {field.helpText && <p className="text-xs text-slate-500 mt-1.5">{field.helpText}</p>}
    </div>
);

const baseInputClasses = "w-full h-11 px-4 rounded-lg bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400";

const InputField = ({ field, defaultValue }: { field: FormField; defaultValue?: any }) => (
    <FieldWrapper field={field}>
        <input type="text" id={field.name} name={field.name} defaultValue={defaultValue} placeholder={field.placeholder} required={field.required} className={baseInputClasses} />
    </FieldWrapper>
);

const TextareaField = ({ field, defaultValue }: { field: FormField; defaultValue?: any }) => (
     <FieldWrapper field={field}>
        <textarea id={field.name} name={field.name} defaultValue={defaultValue} placeholder={field.placeholder} required={field.required} rows={5} className={`${baseInputClasses} h-auto py-3`} />
    </FieldWrapper>
);

const SelectField = ({ field, defaultValue }: { field: FormField; defaultValue?: any }) => (
    <FieldWrapper field={field}>
        <select id={field.name} name={field.name} defaultValue={defaultValue} required={field.required} className={`${baseInputClasses} appearance-none`}>
            {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </FieldWrapper>
);

const DatePickerField = ({ field, defaultValue, showTimeSelect = false }: { field: FormField; defaultValue?: any, showTimeSelect?: boolean }) => {
    const [startDate, setStartDate] = useState(defaultValue ? new Date(defaultValue) : null);
    return (
        <FieldWrapper field={field}>
             <DatePicker
                name={field.name}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect={showTimeSelect}
                dateFormat={showTimeSelect ? "MMMM d, yyyy h:mm aa" : "yyyy-MM-dd"}
                className={baseInputClasses}
                placeholderText={field.placeholder || "Select a date"}
                required={field.required}
             />
        </FieldWrapper>
    )
};

const FileUploadField = ({ field, user }: { field: FormField; user: User }) => {
    const supabase = createClientComponentClient();
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setIsUploading(true);

        const uploadPromises = Array.from(files).map(async (file) => {
            const filePath = `${user.id}/attachments/${Date.now()}-${file.name}`;
            const { error } = await supabase.storage.from('initiatives').upload(filePath, file);
            if (error) throw error;
            const { data } = supabase.storage.from('initiatives').getPublicUrl(filePath);
            return data.publicUrl;
        });

        const urls = await Promise.all(uploadPromises);
        setUploadedFiles(prev => [...prev, ...urls]);
        setIsUploading(false);
    };

    return (
        <FieldWrapper field={field}>
            <input type="hidden" name={field.name} value={uploadedFiles.join(',')} />
            <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-2 text-slate-500" />
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} multiple />
                </label>
            </div>
            {isUploading && <p className="text-sm text-slate-500 mt-2">Uploading...</p>}
            {uploadedFiles.length > 0 && (
                 <div className="mt-4 space-y-2">
                    {uploadedFiles.map(url => (
                        <div key={url} className="flex items-center justify-between p-2 bg-slate-100 rounded-md text-sm">
                            <FileText size={16} className="text-slate-500" />
                            <span className="truncate mx-2">{url.split('/').pop()}</span>
                            <button type="button" onClick={() => setUploadedFiles(prev => prev.filter(u => u !== url))}><X size={16} /></button>
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
        <button type="submit" disabled={pending} className="px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2 min-w-[150px]">
            {pending ? <><Loader2 className="animate-spin" size={20} /><span>Saving...</span></> : text}
        </button>
    );
};
// --- END: Field components ---


// --- MAIN CREATEFORM COMPONENT ---
interface CreateFormProps {
    config: FormConfig;
    action: (prevState: any, formData: FormData) => Promise<any>;
    user: User;
    initialData?: Record<string, any> | null;
    isEditMode?: boolean;
    onBack?: () => void;
}

export function CreateForm({ config, action, user, initialData, isEditMode, onBack }: CreateFormProps) {
  const initialState = { error: null, success: false };
  const [state, dispatch] = useFormState(action, initialState);
  
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'textarea': return <TextareaField key={field.name} field={field} defaultValue={initialData?.[field.name]} />;
      case 'select': return <SelectField key={field.name} field={field} defaultValue={initialData?.[field.name]} />;
      case 'date': return <DatePickerField key={field.name} field={field} defaultValue={initialData?.[field.name]} />;
      case 'datetime': return <DatePickerField key={field.name} field={field} showTimeSelect defaultValue={initialData?.[field.name]} />;
      case 'upload': return <FileUploadField key={field.name} field={field} user={user} />;
      case 'text':
      default:
        return <InputField key={field.name} field={field} defaultValue={initialData?.[field.name]} />;
    }
  };

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="opportunity_type" value={config.opportunityType} />
      {isEditMode && initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {config.fields.map(field => (
            <div key={field.name} className={field.type === 'textarea' || field.type === 'upload' ? 'md:col-span-2' : ''}>
                 {renderField(field)}
            </div>
        ))}
      </div>

      <div className="pt-6 border-t flex items-center justify-between mt-8">
        {onBack && (
            <button type="button" onClick={onBack} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                &larr; Choose a different type
            </button>
        )}
        <div className={`flex-grow flex ${onBack ? 'justify-end' : 'justify-start'}`}>
            <SubmitButton text={isEditMode ? 'Save Changes' : config.submitButtonText} />
        </div>
      </div>
       {state.error && <p className="text-center font-medium text-red-600 mt-4 p-3 bg-red-50 rounded-lg">{state.error}</p>}
    </form>
  );
}