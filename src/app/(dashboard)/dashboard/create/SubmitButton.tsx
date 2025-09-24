// File: app/dashboard/components/SubmitButton.tsx

"use client";

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

export function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full mt-6 px-8 py-4 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                </>
            ) : (
                text
            )}
        </button>
    );
}