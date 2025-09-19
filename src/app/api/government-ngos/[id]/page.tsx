// File Path: app/government-ngos/[id]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { MapPin, Briefcase } from 'lucide-react';

export default function GovNgoDetailPage({ params }: { params: { id: string } }) {
    const [institution, setInstitution] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;
        
        const fetchInstitutionDetails = async () => {
            try {
                const response = await fetch(`/api/government-ngos/${params.id}`);
                if (!response.ok) throw new Error('Institution not found');
                const data = await response.json();
                setInstitution(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutionDetails();
    }, [params.id]);

    if (loading) {
        return <div className="pt-40 text-center">Loading institution profile...</div>;
    }

    if (!institution) {
        return <div className="pt-40 text-center">Institution not found.</div>;
    }

    return (
        <div className="bg-white min-h-screen pt-32 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-gray-50 p-8 rounded-lg shadow-lg border">
                    <div className="flex items-start gap-6 mb-8">
                        <img 
                            src={institution.logo_url} 
                            alt={`${institution.name} logo`}
                            className="w-24 h-24 object-contain rounded-md border p-2 bg-white flex-shrink-0"
                            onError={(e) => e.currentTarget.src = `https://placehold.co/128x128/e2e8f0/4a5568?text=${institution.name.charAt(0)}`}
                        />
                        <div>
                            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{institution.type}</span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mt-2">{institution.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {institution.location}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                         <h2 className="text-xl font-bold mb-2 text-gray-800">About</h2>
                         <p className="text-gray-600 leading-relaxed mb-6">{institution.summary}</p>
                         <div className="border-t pt-6">
                            <h3 className="font-bold text-lg">Active Projects</h3>
                            <p className="text-4xl font-bold text-blue-600 mt-2">{institution.active_projects}</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}