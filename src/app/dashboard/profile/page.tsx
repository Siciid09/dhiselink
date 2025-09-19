// File Path: app/dashboard/profile/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion } from 'framer-motion';

export default function ProfileSettingsPage() {
    // State for the form inputs that the user can edit
    const [profile, setProfile] = useState<any>(null);
    // New state to store the original, unchanged profile data
    const [initialProfile, setInitialProfile] = useState<any>(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    // Store the initial data separately
                    setInitialProfile(data); 
                } else {
                    setMessage("Could not load your profile data.");
                }
            } catch (error) {
                setMessage("An error occurred while fetching your profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('Updating...');
        
        const res = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        });

        if (res.ok) {
            const updatedData = await res.json();
            // Update both states with the newly saved data
            setProfile(updatedData);
            setInitialProfile(updatedData);
            setMessage('Profile updated successfully!');
        } else {
            const errorData = await res.json();
            setMessage(`Error: ${errorData.error || 'Could not update profile.'}`);
        }
        setIsSubmitting(false);
        setTimeout(() => setMessage(''), 4000);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }
    
    if (!profile) {
        return <div className="bg-white p-8 rounded-lg shadow-md border text-center">Could not find your profile. It may not have been created correctly during signup. Please contact support.</div>;
    }

    const isOrganization = profile?.account_type === 'organization';
    // Compare the current form state to the initial state to see if anything has changed
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-lg shadow-md border"
        >
            <h1 className="text-2xl font-bold tracking-tight mb-1">Profile & Settings</h1>
            <p className="text-gray-600 mb-6">Update your public information and account details here.</p>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={profile?.email || ''} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed" />
                </div>

                {isOrganization ? (
                    <>
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Organization Name</label>
                            <input type="text" name="name" id="name" value={profile?.name || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                            <input type="text" name="industry" id="industry" value={profile?.industry || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="full_name" id="full_name" value={profile?.full_name || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                         <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Professional Title</label>
                            <input type="text" name="title" id="title" value={profile?.title || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                    </>
                )}
                
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">{isOrganization ? 'Summary' : 'Bio'}</label>
                    <textarea name="bio" id="bio" rows={4} value={profile?.bio || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    {/* The button is now disabled if there are no changes */}
                    <button 
                        type="submit" 
                        disabled={!hasChanges || isSubmitting} 
                        className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    {message && <p className="text-sm text-gray-600 transition-opacity duration-300">{message}</p>}
                </div>
            </form>
        </motion.div>
    );
}