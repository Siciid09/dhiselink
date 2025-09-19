// File Path: app/auth/register/page.tsx

"use client";

import { useState, FormEvent, ChangeEvent, FC } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, AtSign, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

// Reusable Input Field Component for modern UI
const InputField: FC<{
    icon: JSX.Element;
    type: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    required?: boolean;
    minLength?: number;
}> = ({ icon, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            {icon}
        </div>
        <input {...props} className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
    </div>
);

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Corrected: Use the client from the installed auth-helpers package
    const supabase = createClientComponentClient();

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900">Create Your Account</h1>
                    <p className="text-gray-600 mt-2">Join the network building Somaliland&apos;s future.</p>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg border">
                    {success ? (
                        <div className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-3">
                            <CheckCircle />
                            <p>{success}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-5">
                            <InputField 
                                icon={<User />} 
                                type="text" 
                                value={fullName} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} 
                                placeholder="Full Name" 
                                required 
                            />
                            <InputField 
                                icon={<AtSign />} 
                                type="email" 
                                value={email} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                                placeholder="Email Address" 
                                required 
                            />
                            <InputField 
                                icon={<Lock />} 
                                type="password" 
                                value={password} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                                placeholder="Password (min. 6 characters)" 
                                required 
                                minLength={6} 
                            />
                            
                            {error && <p className="text-red-600 flex items-center gap-2 text-sm"><AlertTriangle size={16}/> {error}</p>}
                            
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all shadow-blue-200 shadow-md">
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account? <a href="/auth/login" className="font-bold text-blue-600 hover:underline">Sign In</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

