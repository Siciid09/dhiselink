import { IndividualFormData } from './IndividualOnboardingForm';
import { User } from '@supabase/supabase-js';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/utils/supabase/client'; 

interface Props {
    user: User;
    formData: IndividualFormData;
    setFormData: React.Dispatch<React.SetStateAction<IndividualFormData>>;
    nextStep: () => void;
    prevStep: () => void;
}

export default function Step3_Credentials({ user, formData, setFormData, nextStep, prevStep }: Props) {
    const [uploading, setUploading] = useState(false);
    
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const filePath = `${user.id}/${file.name}`;
        
        const { data, error } = await supabase.storage
            .from('resumes') // Ensure you have a 'resumes' bucket in Supabase Storage
            .upload(filePath, file, { upsert: true });

        if (error) {
            alert("Error uploading file: " + error.message);
        } else if (data) {
            const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(data.path);
            setFormData(prev => ({ ...prev, cv_url: publicUrl, cv_filename: file.name }));
        }
        setUploading(false);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Credentials & Documents</h2>
            <p className="text-gray-600 mb-6">Finally, upload your CV or resume. This will only be shared with organizations you apply to.</p>

            <div>
                <label className="font-medium text-gray-700">Upload CV / Resume</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                        {formData.cv_filename && !uploading && <p className="text-sm font-semibold text-green-600">Uploaded: {formData.cv_filename}</p>}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300">
                    Previous
                </button>
                <button onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                    Review Information
                </button>
            </div>
        </div>
    );
}