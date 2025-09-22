import { IndividualFormData } from './IndividualOnboardingForm';
import { Edit } from 'lucide-react';

interface Props {
    formData: IndividualFormData;
    prevStep: () => void;
}

export default function Step4_Review({ formData, prevStep }: Props) {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Information</h2>
            <p className="text-gray-600 mb-6">Please confirm that the details below are correct before completing your profile setup.</p>

            <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
                <div>
                    <h3 className="font-semibold text-gray-800">Full Name</h3>
                    <p>{formData.full_name}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">Professional Title</h3>
                    <p>{formData.professional_title}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">Bio</h3>
                    <p>{formData.bio}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {formData.skills.map(s => <span key={s} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm">{s}</span>)}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-gray-800">CV / Resume</h3>
                    <p>{formData.cv_filename || "No file uploaded"}</p>
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button 
                    type="button" // This is a standard button
                    onClick={prevStep} 
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300"
                >
                    <Edit size={16} className="inline-block mr-2" />
                    Make Changes
                </button>
                <button 
                    type="submit" // THIS IS THE KEY: It submits the parent form
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                >
                    Complete Setup
                </button>
            </div>
        </div>
    );
}