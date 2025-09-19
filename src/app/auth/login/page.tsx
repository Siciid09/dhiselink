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

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // On success, redirect to the dashboard. The layout will handle the setup check.
            window.location.href = '/dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
             <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900">Welcome Back</h1>
                    <p className="text-gray-600 mt-2">Sign in to access your dashboard.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border">
                    <form onSubmit={handleSignIn} className="space-y-5">
                        <InputField icon={<AtSign />} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
                        <InputField icon={<Lock />} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                        
                        {error && <p className="text-red-600 flex items-center gap-2 text-sm"><AlertTriangle size={16}/> {error}</p>}
                        
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all shadow-blue-200 shadow-md">
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don&apos;t have an account? <a href="/auth/register" className="font-bold text-blue-600 hover:underline">Register Now</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Reusable Input Field Component
const InputField = ({ icon, ...props }: any) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            {icon}
        </div>
        <input {...props} className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
    </div>
);
