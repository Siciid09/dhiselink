"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Building, School, Landmark, AlertTriangle, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { updateUserRole } from './actions'; // This is the line that was missing

const roles = [
    { name: 'individual', title: "I'm an Individual", description: "A professional or student.", icon: <User size={32} /> },
    { name: 'company', title: "I'm a Company", description: "A business looking to hire.", icon: <Building size={32} /> },
    { name: 'university', title: "I'm a University", description: "An academic institution.", icon: <School size={32} /> },
    { name: 'ngo_gov', title: "I'm an NGO / GOV", description: "A public or non-profit entity.", icon: <Landmark size={32} /> },
    { name: 'other', title: "Other Organization", description: "Another type of organization.", icon: <Package size={32} /> },
];

export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl pt-24">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900">One Last Step!</h1>
                    <p className="mt-2 text-lg text-gray-600">To personalize your experience, please tell us who you are.</p>
                </div>

                <form action={updateUserRole}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {roles.map((role) => (
                            <label key={role.name} className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedRole === role.name ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-400'} ${role.name === 'other' ? 'lg:col-start-2' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value={role.name}
                                    className="hidden"
                                    onChange={() => setSelectedRole(role.name)}
                                />
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${selectedRole === role.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {role.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{role.title}</h3>
                                        <p className="text-sm text-gray-600">{role.description}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="mt-10 pt-4 text-center">
                        <motion.button
                            type="submit"
                            disabled={!selectedRole}
                            className="w-full max-w-xs px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
                            whileHover={{ scale: 1.05 }}
                        >
                            Continue
                        </motion.button>
                        {message && (
                           <p className="text-red-600 flex items-center justify-center gap-2 text-sm mt-4">
                               <AlertTriangle size={16}/> {message}
                           </p>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}