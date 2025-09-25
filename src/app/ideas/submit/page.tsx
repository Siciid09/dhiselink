"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { submitIdea } from './actions';
import { AlertTriangle, Lightbulb, UploadCloud } from 'lucide-react';
import React, { useState, useRef, ChangeEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="w-full py-3 px-6 bg-sky-600 text-white font-bold rounded-lg disabled:bg-slate-400">{pending ? "Submitting..." : "Submit Idea"}</button>;
}

const FileUpload = ({ name, label, onUploadComplete }: { name: string, label: string, onUploadComplete: (url: string) => void }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
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

export default function SubmitIdeaPage() {
    const [state, formAction] = useFormState(submitIdea, { error: null });
    const [coverImageUrl, setCoverImageUrl] = useState('');

    return (
        <div className="bg-slate-50 min-h-screen py-24">
            <div className="container mx-auto max-w-2xl px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border">
                    <div className="text-center mb-8">
                        <Lightbulb className="mx-auto h-12 w-12 text-sky-500 bg-sky-100 p-2 rounded-full" />
                        <h1 className="text-3xl font-bold mt-4">Share Your New Idea</h1>
                        <p className="text-slate-600 mt-2">Bring your vision to the community.</p>
                    </div>
                    <form action={formAction} className="space-y-6">
                        <input type="hidden" name="cover_image_url" value={coverImageUrl} />
                        <div><label className="font-medium">Idea Title</label><input name="title" required className="w-full mt-1 p-3 border rounded-lg" /></div>
                        <div><label className="font-medium">Category / Topic</label>
                            <select name="category" required className="w-full mt-1 p-3 border rounded-lg"><option value="General">General</option><option value="Engineering">Engineering</option><option value="Construction">Construction</option><option value="Design">Design</option><option value="Tech">Tech</option><option value="Community">Community</option></select>
                        </div>
                        <div><label className="font-medium">Description / Details</label><textarea name="details" rows={6} required className="w-full mt-1 p-3 border rounded-lg"></textarea></div>
                        <FileUpload name="cover_image_upload" label="Cover Image" onUploadComplete={setCoverImageUrl} />
                        <div><label className="font-medium">Tags / Keywords</label><input name="tags" placeholder="e.g., sustainability, housing, fintech" className="w-full mt-1 p-3 border rounded-lg" /></div>
                        <div><label className="font-medium">Visibility</label>
                            <select name="visibility" defaultValue="draft" required className="w-full mt-1 p-3 border rounded-lg"><option value="draft">Draft (Only you can see)</option><option value="published">Published (Visible to everyone)</option></select>
                        </div>
                        <SubmitButton />
                        {state.error && <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3"><AlertTriangle /><p>{state.error}</p></div>}
                    </form>
                </div>
            </div>
        </div>
    );
}