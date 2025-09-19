// File Path: app/dashboard/profile/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    const router = useRouter();
    const supabase = createClientComponentClient();

    // Fetch user and profile data on load
    useEffect(() => {
        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);

            // Fetch the profile from our API
            const response = await fetch('/api/profile');
            const profileData = await response.json();
            
            if (profileData) {
                setProfile(profileData);
            }
            setLoading(false);
        }
        loadProfile();
    }, [router, supabase.auth]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('Updating...');

        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: profile.full_name,
                title: profile.title,
            }),
        });

        if (response.ok) {
            setMessage('Profile updated successfully!');
        } else {
            const errorData = await response.json();
            setMessage(`Error: ${errorData.error}`);
        }
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    if (loading) {
        return <div className="pt-40 text-center">Loading profile...</div>;
    }

    return (
        <div className="bg-gray-50 pt-40 pb-24 min-h-screen">
            <div className="container mx-auto px-6 max-w-2xl">
                <div className="bg-white p-8 rounded-lg shadow-lg border">
                    <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
                    {profile && (
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" id="email" value={user?.email || ''} disabled className="w-full h-12 px-4 rounded-lg bg-gray-200 border-gray-300 cursor-not-allowed"/>
                            </div>
                            <div>
                                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" id="full_name" value={profile.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                                <input type="text" id="title" value={profile.title || ''} onChange={e => setProfile({...profile, title: e.target.value})} placeholder="e.g., Civil Engineer" className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
                                Save Changes
                            </button>
                            {message && <p className="text-center text-green-600 mt-4">{message}</p>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}