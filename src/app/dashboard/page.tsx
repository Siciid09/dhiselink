// File Path: app/dashboard/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { ArrowRight, Briefcase, Lightbulb, CheckCircle } from 'lucide-react';

export default function DashboardHomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                // Fetch profile from your API
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const profileData = await res.json();
                    setProfile(profileData);
                }
            }
            setLoading(false);
        };
        fetchUserData();
    }, [supabase]);

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

    const isOrganization = profile?.account_type === 'organization';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile?.name || user?.email}</h1>
                <p className="text-gray-600">Here’s what’s happening with your account today.</p>
            </div>

            {/* Profile Completeness Widget */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16">
                        <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36">
                            <circle className="text-gray-200" strokeWidth="4" cx="18" cy="18" r="14" fill="transparent"></circle>
                            <circle className="text-blue-600" strokeWidth="4" strokeDasharray="87.9" strokeDashoffset="20" cx="18" cy="18" r="14" fill="transparent" strokeLinecap="round"></circle>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold">80%</div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Profile Strength: Strong</h3>
                        <p className="text-sm text-gray-600">Great job! A complete profile attracts more opportunities.</p>
                        <a href="/dashboard/profile" className="text-sm font-bold text-blue-600 hover:underline mt-1 inline-block">
                            View or Edit Profile <ArrowRight className="inline h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Dynamic Action Widgets */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {isOrganization ? (
                    // Widget for Organizations
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Briefcase /> Your Job Postings</h3>
                        <p className="text-gray-600 my-2">You currently have <span className="font-bold">3 active</span> job postings.</p>
                        <a href="/dashboard/post-job" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg inline-block hover:bg-blue-700">
                            Post a New Job
                        </a>
                    </div>
                ) : (
                    // Widget for Professionals/Individuals
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Lightbulb /> Your Ideas</h3>
                        <p className="text-gray-600 my-2">You have submitted <span className="font-bold">1 idea</span> to the hub.</p>
                        <a href="/dashboard/submit-idea" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg inline-block hover:bg-blue-700">
                            Submit a New Idea
                        </a>
                    </div>
                )}
                
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="font-bold text-lg flex items-center gap-2"><CheckCircle /> Next Steps</h3>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                        <li>Explore the <a href="/jobs" className="text-blue-600 hover:underline">Opportunities</a> page.</li>
                        <li>Discover talented individuals on the <a href="/professionals" className="text-blue-600 hover:underline">Professionals</a> page.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}