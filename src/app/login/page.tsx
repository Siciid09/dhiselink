// File Path: app/login/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { AtSign, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border"
            >
                <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600 mb-8">Sign in to access your account.</p>

                <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Email Address</label>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

                <p className="text-center text-sm text-gray-600 mt-8">
                    Don&apos;t have an account? <Link href="/register" className="font-bold text-blue-600 hover:underline">Register Now</Link>
                </p>
            </motion.div>
        </div>
    );
}
