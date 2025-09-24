"use client";

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Building, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUserRole } from './actions';

function SelectRoleForm() {
    const [selection, setSelection] = useState<{ role: string | null, orgType?: string }>({ role: null });
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    const orgTypes = [
        { name: 'Company', roleValue: 'company' },
        { name: 'University', roleValue: 'university' },
        { name: 'NGO', roleValue: 'ngo_gov' },
        { name: 'Government', roleValue: 'ngo_gov' },
        { name: 'Other', roleValue: 'other' },
    ];

    const handleRoleSelect = (role: string) => {
        if (role === 'individual') {
            setSelection({ role: 'individual' });
        } else {
            setSelection({ role: 'organization' });
        }
    };

    const handleOrgTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOrg = orgTypes.find(org => org.name === e.target.value);
        if (selectedOrg) {
            setSelection(prev => ({ ...prev, orgType: selectedOrg.name }));
        }
    };

    const isContinueDisabled = selection.role === 'organization' && !selection.orgType;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900">One Last Step!</h1>
                    <p className="mt-2 text-lg text-gray-600">To personalize your experience, please tell us who you are.</p>
                </div>
                <form action={updateUserRole}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Individual Button */}
                        <label className={`p-8 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center ${selection.role === 'individual' ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-400'}`}>
                            <input type="radio" name="role" value="individual" className="hidden" onChange={() => handleRoleSelect('individual')} />
                            <User size={32} className="mb-3" />
                            <h3 className="text-lg font-bold text-gray-900">I'm an Individual</h3>
                            <p className="text-sm text-gray-600">A professional or student.</p>
                        </label>
                        {/* Organization Button */}
                        <label className={`p-8 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center ${selection.role === 'organization' ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-400'}`}>
                            <input type="radio" name="role" value="organization" className="hidden" onChange={() => handleRoleSelect('organization')} />
                            <Building size={32} className="mb-3" />
                            <h3 className="text-lg font-bold text-gray-900">I'm an Organization</h3>
                            <p className="text-sm text-gray-600">A business, NGO, or institution.</p>
                        </label>
                    </div>

                    <AnimatePresence>
                        {selection.role === 'organization' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <label htmlFor="organization_type" className="font-medium text-gray-700">Specify Organization Type</label>
                                <select
                                    id="organization_type"
                                    name="organization_type"
                                    onChange={handleOrgTypeChange}
                                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">-- Select a type --</option>
                                    {orgTypes.map(org => <option key={org.name} value={org.name}>{org.name}</option>)}
                                </select>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 pt-4 text-center">
                        <motion.button type="submit" disabled={isContinueDisabled} className="w-full max-w-xs px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg disabled:bg-gray-400" whileHover={{ scale: 1.05 }}>
                            Continue
                        </motion.button>
                        {message && (<p className="text-red-600 flex items-center justify-center gap-2 text-sm mt-4"><AlertTriangle size={16}/> {message}</p>)}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function SelectRolePage() {
    return (
        <Suspense>
            <SelectRoleForm />
        </Suspense>
    );
}