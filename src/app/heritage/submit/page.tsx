"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { submitHeritageSite } from './actions';
import { Landmark, AlertTriangle, UploadCloud, Image as ImageIcon } from 'lucide-react';
import React, { useState, ChangeEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@supabase/supabase-js';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="w-full py-3 px-6 bg-sky-600 text-white font-bold rounded-lg">{pending ? "Submitting..." : "Submit Heritage Site"}</button>;
}

const FileUpload = ({ name, label, onUploadComplete, multiple = false }: { name: string, label: string, onUploadComplete: (urls: string[]) => void, multiple?: boolean }) => {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const supabase = createClientComponentClient();
    
    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const files = event.target.files;
            if (!files || files.length === 0) throw new Error('No file selected.');
            
            const uploadPromises = Array.from(files).map(async file => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${uuidv4()}.${fileExt}`;
                const { error } = await supabase.storage.from('heritage').upload(fileName, file);
                if (error) throw error;
                const { data } = supabase.storage.from('heritage').getPublicUrl(fileName);
                return data.publicUrl;
            });
            
            const newUrls = await Promise.all(uploadPromises);

            if (multiple) {
                setPreviews(prev => [...prev, ...newUrls]);
                onUploadComplete(newUrls);
            } else {
                setPreviews([newUrls[0]]);
                onUploadComplete(newUrls);
            }
        } catch (error: any) { alert(error.message); } 
        finally { setUploading(false); }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="mt-1 flex items-center gap-4">
                <label htmlFor={name} className="cursor-pointer bg-white py-2 px-4 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50">{uploading ? 'Uploading...' : 'Choose File(s)'}</label>
                <input id={name} type="file" onChange={handleUpload} className="hidden" accept="image/*" multiple={multiple} />
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
                {previews.map(url => <img key={url} src={url} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />)}
            </div>
        </div>
    );
};

export default function SubmitHeritagePage() {
    const [state, formAction] = useFormState(submitHeritageSite, { error: null });
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    return (
        <div className="bg-slate-50 min-h-screen py-24">
            <div className="container mx-auto max-w-2xl px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border">
                    <div className="text-center mb-8">
                        <Landmark className="mx-auto h-12 w-12 text-amber-500 bg-amber-100 p-2 rounded-full" />
                        <h1 className="text-3xl font-bold mt-4">Add a New Heritage Site</h1>
                    </div>
                    <form action={formAction} className="space-y-6">
                        <input type="hidden" name="cover_image_url" value={coverImageUrl} />
                        <input type="hidden" name="gallery_images" value={JSON.stringify(galleryImages)} />
                        
                        <div><label className="font-medium">Site Name</label><input name="title" required className="w-full mt-1 p-3 border rounded-lg" /></div>
                        <div><label className="font-medium">Category</label>
                            <select name="category" required className="w-full mt-1 p-3 border rounded-lg">
                                <option>Archaeological</option><option>Historical Landmark</option><option>Natural Wonder</option><option>Cultural Practice</option><option>Monument</option>
                            </select>
                        </div>
                         <div><label className="font-medium">Location</label><input name="location" required className="w-full mt-1 p-3 border rounded-lg" /></div>
                        <div><label className="font-medium">Summary (Short Description)</label><textarea name="summary" rows={3} required className="w-full mt-1 p-3 border rounded-lg"></textarea></div>
                        <div><label className="font-medium">Full Description</label><textarea name="description" rows={6} className="w-full mt-1 p-3 border rounded-lg"></textarea></div>
                        
                        <FileUpload name="cover_image_upload" label="Cover Image (Required)" onUploadComplete={(urls) => setCoverImageUrl(urls[0])} />
                        <FileUpload name="gallery_upload" label="Image Gallery (Optional)" onUploadComplete={(urls) => setGalleryImages(prev => [...prev, ...urls])} multiple />

                        <SubmitButton />
                        {state.error && <div className="p-4 bg-red-50 text-red-800 rounded-lg"><AlertTriangle className="inline-block mr-2" />{state.error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}