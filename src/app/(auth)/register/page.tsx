"use client";

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, AtSign, Lock, AlertTriangle, CheckCircle, Phone, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { signUp } from './actions';

function RegisterForm() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900">Create Your Account</h1>
                    <p className="text-gray-600 mt-2">Join the network building the future.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border">
                    <form action={signUp} className="space-y-5">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="fullName" placeholder="Full Name" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border" />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="phone" type="tel" placeholder="Phone Number" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border" />
                        </div>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="email" type="email" placeholder="Email Address" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password (min. 6 characters)" required minLength={6} className="w-full h-12 pl-12 pr-12 rounded-lg bg-gray-50 border" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        <div className="relative">
                             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input name="repeatPassword" type={showPassword ? "text" : "password"} placeholder="Repeat Password" required minLength={6} className="w-full h-12 pl-12 pr-12 rounded-lg bg-gray-50 border" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Create Account</button>
                    </form>

                    {message && (
                        <div className={`p-4 mt-4 rounded-lg flex items-center gap-3 ${message.startsWith('Success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {message.startsWith('Success') ? <CheckCircle /> : <AlertTriangle />}
                            <p>{message}</p>
                        </div>
                    )}
                    <p className="text-center text-sm text-gray-600 mt-6">Already have an account? <Link href="/login" className="font-bold text-blue-600 hover:underline">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense>
            <RegisterForm />
        </Suspense>
    );
}