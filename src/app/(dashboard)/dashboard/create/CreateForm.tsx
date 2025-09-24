"use client";

import React, { useEffect, useState } from 'react'; // FIX: Added 'React' import
import { useFormState, useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import type { FormConfig, FormField } from './form-config';
import { createOpportunity } from './actions';

// --- Start of Consolidated UI Components ---

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, ...props }, ref) => (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-sky-500/50 bg-sky-600 text-white hover:bg-sky-700 h-10 px-4 py-2 ${className}`}
      disabled={isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

// --- End of Consolidated UI Components ---

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="w-full">
      {pending ? 'Saving...' : text}
    </Button>
  );
}

interface CreateFormProps {
    config: FormConfig;
    action: (prevState: any, formData: FormData) => Promise<any>;
    initialData?: Record<string, any> | null;
    isEditMode?: boolean;
}

export function CreateForm({ config, action, initialData, isEditMode }: CreateFormProps) {
  const initialState = { error: null, success: false };
  const [state, dispatch] = useFormState(action, initialState);
  
  const [formValues, setFormValues] = useState<Record<string, any>>(initialData || {});

  useEffect(() => {
    if (initialData) {
      setFormValues(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.name] || '';
    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required,
      onChange: handleInputChange,
      defaultValue: Array.isArray(value) ? value.join(', ') : value,
    };

    switch (field.type) {
      case 'textarea':
        return <Textarea {...commonProps} placeholder={field.placeholder} rows={5} />;
      
      case 'select':
        let options = field.options || [];
        if (field.dependsOn && field.optionsMap) {
          const parentValue = formValues[field.dependsOn];
          const dynamicOptions = parentValue ? field.optionsMap[parentValue] || [] : [];
          options = dynamicOptions.map(opt => ({ value: opt, label: opt }));
        }
        return (
          <Select {...commonProps}>
            <option value="" disabled>{field.placeholder}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        );
        
      case 'text':
      default:
        return <Input type="text" {...commonProps} placeholder={field.placeholder} />;
    }
  };

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="opportunity_type" value={config.opportunityType} />
      {isEditMode && initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      {config.fields.map(field => (
        <div key={field.name} className="grid w-full items-center gap-1.5">
          <label htmlFor={field.name} className="text-sm font-medium text-slate-800">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {renderField(field)}
          {field.helpText && <p className="text-xs text-slate-500 pt-1">{field.helpText}</p>}
        </div>
      ))}

      <div className="pt-4">
        {state.error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-bold">Error</p>
                <p>{state.error}</p>
            </div>
        )}
        <SubmitButton text={isEditMode ? 'Save Changes' : config.submitButtonText} />
      </div>
    </form>
  );
}