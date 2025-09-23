"use client"; // This page must be a client component

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, AtSign, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { signUp } from './actions';

// Component 1: This part uses the hook and contains your form.
function RegisterForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

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
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User /></div>
              <input name="fullName" placeholder="Full Name" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><AtSign /></div>
              <input name="email" type="email" placeholder="Email Address" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock /></div>
              <input name="password" type="password" placeholder="Password (min. 6 characters)" required minLength={6} className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border" />
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

// Component 2: The main page export, which wraps the form in Suspense.
export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
