// File Path: app/auth/register/page.tsx

"use client";

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AtSign, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // This will redirect the user to your site after they click the verification link
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess("Success! Please check your email to verify your account.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border">
                <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">Create an Account</h1>
                <p className="text-gray-600 mb-8">Start your journey with Dhiselink.</p>
                
                {success ? (
                    <div className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-3">
                        <CheckCircle />
                        <p>{success}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSignUp} className="space-y-5">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email Address" className="w-full h-12 px-4 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500" />
                        <input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" className="w-full h-12 px-4 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500" />
                        
                        {error && <p className="text-red-600 flex items-center gap-2"><AlertTriangle size={16}/> {error}</p>}
                        
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                )}
                 <p className="text-center text-sm text-gray-600 mt-8">
                    Already have an account? <a href="/auth/login" className="font-bold text-blue-600 hover:underline">Sign In</a>
                </p>
            </div>
        </div>
    );
}