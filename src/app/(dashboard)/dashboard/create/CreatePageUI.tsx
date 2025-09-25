"use client";

import React, { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { formConfigurations, FormConfig, FormField } from './form-config';
import { createOpportunity } from './actions';
import { Loader2, Briefcase, BookOpen, Shield, AlertTriangle, Handshake, Lightbulb } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Components ---
const SubmitButton = ({ text }: { text: string }) => {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="px-8 py-3 bg-sky-600 text-white font-bold rounded-lg flex items-center justify-center gap-2">{pending ? <><Loader2 className="animate-spin" /><span>Saving...</span></> : text}</button>;
};
const InputField = ({ field }: { field: FormField }) => (<div><label className="text-sm font-semibold">{field.label}{field.required &&<span className="text-red-500">*</span>}</label><div className="mt-1.5"><input type="text" name={field.name} placeholder={field.placeholder} required={field.required} className="w-full h-11 px-4 rounded-lg bg-slate-50 border" /></div></div>);
const TextareaField = ({ field }: { field: FormField }) => (<div><label className="text-sm font-semibold">{field.label}{field.required &&<span className="text-red-500">*</span>}</label><div className="mt-1.5"><textarea name={field.name} placeholder={field.placeholder} required={field.required} rows={5} className="w-full p-4 rounded-lg bg-slate-50 border" /></div></div>);
const SelectField = ({ field, onChange }: { field: FormField, onChange?: (e: any) => void }) => (<div><label className="text-sm font-semibold">{field.label}{field.required &&<span className="text-red-500">*</span>}</label><div className="mt-1.5"><select name={field.name} required={field.required} onChange={onChange} className="w-full h-11 px-4 rounded-lg bg-slate-50 border appearance-none">{field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div></div>);
const DatePickerField = ({ field }: { field: FormField }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    return <div><label className="text-sm font-semibold">{field.label}</label><div className="mt-1.5"><DatePicker name={field.name} selected={startDate} onChange={(date) => setStartDate(date)} className="w-full h-11 px-4 rounded-lg bg-slate-50 border" placeholderText={field.placeholder} required={field.required} /></div></div>;
};

const iconMap: Record<string, React.ElementType> = { Briefcase, BookOpen, Shield, Handshake, Lightbulb };

// --- The Main Form Component ---
function CreateForm({ config, onBack }: { config: FormConfig, onBack: () => void }) {
    const [state, formAction] = useFormState(createOpportunity, { error: null });
    const [conditionalType, setConditionalType] = useState('');

    const renderField = (field: FormField) => {
        const props = field.name === 'type' ? { onChange: (e: any) => setConditionalType(e.target.value) } : {};
        switch (field.type) {
            case 'textarea': return <TextareaField key={field.name} field={field} {...props} />;
            case 'select': return <SelectField key={field.name} field={field} {...props} />;
            case 'date': return <DatePickerField key={field.name} field={field} />;
            default: return <InputField key={field.name} field={field} {...props} />;
        }
    };
    
    const conditionalFields = config.conditionalFields?.[conditionalType] || [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={onBack} className="text-sm font-semibold text-slate-600 hover:text-slate-900 mb-4">&larr; Back to choices</button>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{config.title}</h1>
            <form action={formAction} className="space-y-6">
                <input type="hidden" name="opportunity_type" value={config.opportunityType} />
                {config.fields.map(field => renderField(field))}
                <AnimatePresence>
                    {conditionalType && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-6 border-t">
                            {conditionalFields.map(field => renderField(field))}
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="pt-6 border-t"><SubmitButton text={config.submitButtonText} /></div>
                {state.error && <p className="p-4 mt-4 bg-red-50 text-red-800 rounded-lg">{state.error}</p>}
            </form>
        </motion.div>
    );
}

// --- MAIN UI COMPONENT ---
export default function CreatePageUI({ user, options }: { user: User, options: any[] }) {
    const [selectedType, setSelectedType] = useState<string | null>(null);

    if (!selectedType) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-sm border">
                <div className="text-center"><h1 className="text-3xl font-extrabold text-slate-900">Create New Content</h1><p className="text-slate-600 mt-2">What would you like to add today?</p></div>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {options.map((opt) => {
                        const Icon = iconMap[opt.iconName];
                        if (!Icon) return null;
                        return (
                            <button key={opt.title} onClick={() => setSelectedType(opt.title)} className="group p-6 bg-slate-50 rounded-xl border text-left hover:bg-white hover:border-sky-500">
                                <div className="p-3 bg-white rounded-lg border w-fit mb-3"><Icon className="h-6 w-6 text-sky-600" /></div>
                                <h3 className="font-bold text-slate-800">{opt.title}</h3><p className="text-sm text-slate-500">{opt.description}</p>
                            </button>
                        )
                    })}
                </div>
            </motion.div>
        );
    }

    const config = formConfigurations[selectedType];
    if (!config) return <div>Error: Form configuration not found. <button onClick={() => setSelectedType(null)}>Go Back</button></div>;

    return <CreateForm config={config} onBack={() => setSelectedType(null)} />;
}