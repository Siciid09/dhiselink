"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { User, AtSign, Lock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signUp } from './actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2">
            {pending ? <><Loader2 className="animate-spin" size={20} /> Creating Account...</> : 'Create Account'}
        </button>
    );
}

function RegisterForm() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900">Create Your Account</h1>
                    <p className="text-slate-600 mt-2">Join the network building the future.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border">
                    <form action={signUp} className="space-y-5">
                        <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input name="fullName" placeholder="Full Name" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" /></div>
                        <div className="relative"><AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input name="email" type="email" placeholder="Email Address" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" /></div>
                        <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input name="password" type="password" placeholder="Password (min. 6 characters)" required minLength={6} className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" /></div>
                        <SubmitButton />
                    </form>

                    {message && (<div className={`p-4 mt-4 rounded-lg flex items-center gap-3 bg-red-50 text-red-800`}><AlertTriangle /><p>{message}</p></div>)}
                    <p className="text-center text-sm text-slate-600 mt-6">Already have an account? <Link href="/login" className="font-bold text-amber-600 hover:underline">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (<Suspense><RegisterForm /></Suspense>);
}