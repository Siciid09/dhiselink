import { useState } from 'react';
import { IndividualFormData } from './IndividualOnboardingForm';
import { X } from 'lucide-react';

interface Props {
    formData: IndividualFormData;
    setFormData: React.Dispatch<React.SetStateAction<IndividualFormData>>;
    nextStep: () => void;
    prevStep: () => void;
}

export default function Step2_Skills({ formData, setFormData, nextStep, prevStep }: Props) {
    const [currentSkill, setCurrentSkill] = useState('');

    const handleAddSkill = () => {
        if (currentSkill && !formData.skills.includes(currentSkill)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, currentSkill] }));
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Skills & Expertise</h2>
            <p className="text-gray-600 mb-6">List your key skills. This helps organizations find you for the right opportunities.</p>

            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={currentSkill} 
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    placeholder="e.g., Project Management"
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleAddSkill} className="px-5 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700">Add</button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[50px]">
                {formData.skills.map(skill => (
                    <span key={skill} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500"><X size={14} /></button>
                    </span>
                ))}
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300">
                    Previous
                </button>
                <button onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                    Next Step
                </button>
            </div>
        </div>
    );
}