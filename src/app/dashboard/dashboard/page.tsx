"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                // If no session, redirect to login page
                router.push('/login'); 
            } else {
                setUser(session.user);
                setLoading(false);
            }
        };

        checkUser();
    }, [router]);

    if (loading) {
        return <div className="pt-40 text-center">Loading...</div>; // Simple loading state
    }

    return (
        <div className="container mx-auto px-6 pt-40">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="mt-4 text-lg">
                Welcome back, {user?.email}!
            </p>
            {/* You can build out the rest of your dashboard here */}
        </div>
    );
}