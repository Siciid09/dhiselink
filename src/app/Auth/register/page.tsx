"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { AtSign, Lock, User } from 'lucide-react';

export default function RegistrationPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // We pass the full_name here so our trigger can use it
                data: { 
                    full_name: fullName 
                }
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Registration successful! Please check your email to verify your account.");
            // You might want to redirect or just show the message
            // router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border">
                <h1 className="text-3xl font-bold text-center mb-2">Create Your Account</h1>
                <p className="text-gray-600 text-center mb-6">Join Dhiselink to get started.</p>
                
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full h-12 pl-10 pr-4 rounded-lg bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500" /></div>
                    <div className="relative"><AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-12 pl-10 pr-4 rounded-lg bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500" /></div>
                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-12 pl-10 pr-4 rounded-lg bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500" /></div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Register</button>
                </form>

                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                {message && <p className="mt-4 text-center text-green-500">{message}</p>}
            </div>
        </div>
    );
}
