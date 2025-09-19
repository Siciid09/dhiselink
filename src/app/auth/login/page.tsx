// File Path: app/auth/login/page.tsx

"use client";

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AtSign, Lock, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // IMPORTANT: On success, redirect to the onboarding checker, not the dashboard
            window.location.href = '/dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border">
                 <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">Welcome Back</h1>
                 <p className="text-gray-600 mb-8">Sign in to access your account.</p>

                <form onSubmit={handleSignIn} className="space-y-5">
                     <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email Address" className="w-full h-12 px-4 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500" />
                     <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" className="w-full h-12 px-4 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500" />
                    
                     {error && <p className="text-red-600 flex items-center gap-2"><AlertTriangle size={16}/> {error}</p>}
                    
                     <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                         {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                 <p className="text-center text-sm text-gray-600 mt-8">
                    Don&apos;t have an account? <a href="/auth/register" className="font-bold text-blue-600 hover:underline">Register Now</a>
                </p>
            </div>
        </div>
    );
}