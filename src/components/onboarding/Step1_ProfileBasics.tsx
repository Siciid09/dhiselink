import { IndividualFormData } from './IndividualOnboardingForm';

interface Props {
    formData: IndividualFormData;
    setFormData: React.Dispatch<React.SetStateAction<IndividualFormData>>;
    nextStep: () => void;
}

export default function Step1_ProfileBasics({ formData, setFormData, nextStep }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's start with the basics</h2>
            <p className="text-gray-600 mb-6">Tell us a bit about yourself. This information will be on your public profile.</p>

            <div className="space-y-4">
                <div>
                    <label className="font-medium text-gray-700">Full Name</label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="font-medium text-gray-700">Professional Title</label>
                    <input type="text" name="professional_title" placeholder="e.g., Civil Engineer" value={formData.professional_title} onChange={handleChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="font-medium text-gray-700">Short Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
            </div>

            <div className="mt-8 text-right">
                <button onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                    Next Step
                </button>
            </div>
        </div>
    );
}