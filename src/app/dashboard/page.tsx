// File Path: app/dashboard/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
            }
            setLoading(false);
        };
        getUser();
    }, [supabase]);

    if (loading) {
        return <div className="pt-40 text-center">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="pt-40 text-center">
                <p>You are not logged in.</p>
                <a href="/auth/login" className="text-blue-600">Go to Login</a>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-6 pt-40">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="mt-4 text-lg">Welcome back, {user?.email}!</p>
            <p className="mt-2">Your profile setup is complete.</p>

            <div className="mt-8 space-x-4">
                <a href="/dashboard/profile" className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg">Edit Profile</a>
                <a href="/dashboard/submit-idea" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg">Submit an Idea</a>
            </div>
        </div>
    );
}