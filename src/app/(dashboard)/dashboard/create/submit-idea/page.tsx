"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { submitIdea, updateIdea } from './actions';
import { AlertTriangle, Lightbulb, UploadCloud } from 'lucide-react';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="w-full py-3 px-6 bg-sky-600 text-white font-bold rounded-lg disabled:bg-slate-400">{pending ? "Saving..." : isEditMode ? "Save Changes" : "Submit Idea"}</button>;
}

const FileUpload = ({ name, label, defaultValue, onUploadComplete }: { name: string; label: string; defaultValue?: string; onUploadComplete: (url: string) => void }): JSX.Element => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const supabase = createClientComponentClient();
    
    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) throw new Error('No file selected.');
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const { error } = await supabase.storage.from('ideas').upload(fileName, file);
            if (error) throw error;

            const { data } = supabase.storage.from('ideas').getPublicUrl(fileName);
            setPreview(data.publicUrl);
            onUploadComplete(data.publicUrl);
        } catch (error: any) { alert(error.message); } 
        finally { setUploading(false); }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="mt-1 flex items-center gap-4">
                {preview ? <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" /> : <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center"><UploadCloud className="text-slate-400" /></div>}
                <label htmlFor={name} className="cursor-pointer bg-white py-2 px-4 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50">{uploading ? 'Uploading...' : 'Choose File'}</label>
                <input id={name} type="file" onChange={handleUpload} className="hidden" accept="image/*" />
            </div>
        </div>
    );
};

export default function SubmitIdeaPage({ user }: { user: User }) {
    const searchParams = useSearchParams();
    const ideaId = searchParams.get('id');
    const isEditMode = !!ideaId;
    
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(isEditMode);
    
    const action = isEditMode ? updateIdea : submitIdea;
    const [state, formAction] = useFormState(action, { error: null });

    const [coverImageUrl, setCoverImageUrl] = useState('');

    useEffect(() => {
        if (isEditMode) {
            const fetchIdea = async () => {
                const supabase = createClientComponentClient();
                const { data } = await supabase.from('ideas').select('*').eq('id', ideaId).single();
                setInitialData(data);
                if (data?.cover_image_url) setCoverImageUrl(data.cover_image_url);
                setLoading(false);
            };
            fetchIdea();
        }
    }, [ideaId, isEditMode]);

    if (loading) return <div className="text-center p-20">Loading idea...</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border">
            <div className="text-center mb-8">
                <Lightbulb className="mx-auto h-12 w-12 text-sky-500 bg-sky-100 p-2 rounded-full" />
                <h1 className="text-3xl font-bold mt-4">{isEditMode ? "Edit Your Idea" : "Share Your New Idea"}</h1>
                <p className="text-slate-600 mt-2">Bring your vision to the community.</p>
            </div>
            <form action={formAction} className="space-y-6">
                {isEditMode && <input type="hidden" name="id" value={ideaId} />}
                <input type="hidden" name="cover_image_url" value={coverImageUrl} />
                <div><label className="font-medium">Idea Title</label><input name="title" defaultValue={initialData?.title} required className="w-full mt-1 p-3 border rounded-lg" /></div>
                <div><label className="font-medium">Category / Topic</label><select name="category" defaultValue={initialData?.category || "General"} required className="w-full mt-1 p-3 border rounded-lg"><option>General</option><option>Engineering</option><option>Construction</option></select></div>
                <div><label className="font-medium">Description / Details</label><textarea name="details" defaultValue={initialData?.details} rows={6} required className="w-full mt-1 p-3 border rounded-lg"></textarea></div>
                <FileUpload name="cover_image_upload" label="Cover Image" defaultValue={initialData?.cover_image_url} onUploadComplete={setCoverImageUrl} />
                <div><label className="font-medium">Tags / Keywords</label><input name="tags" defaultValue={initialData?.tags?.join(', ')} placeholder="e.g., sustainability, housing" className="w-full mt-1 p-3 border rounded-lg" /></div>
                <div><label className="font-medium">Visibility</label><select name="visibility" defaultValue={initialData?.visibility || "draft"} required className="w-full mt-1 p-3 border rounded-lg"><option value="draft">Draft</option><option value="published">Published</option></select></div>
                <SubmitButton isEditMode={isEditMode} />
                {state.error && <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3"><p>{state.error}</p></div>}
            </form>
        </div>
    );
}