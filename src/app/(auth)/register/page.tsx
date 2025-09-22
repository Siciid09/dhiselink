"use client";

import { useSearchParams } from 'next/navigation';
import { User, AtSign, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
// Import our new server action
import { signUp } from './actions';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Join the network building Somaliland's future.</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg border">
          {/* The form now calls the server action directly */}
          <form action={signUp} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User /></div>
              <input name="fullName" placeholder="Full Name" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><AtSign /></div>
              <input name="email" type="email" placeholder="Email Address" required className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock /></div>
              <input name="password" type="password" placeholder="Password (min. 6 characters)" required minLength={6} className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-blue-200 shadow-md">
              Create Account
            </button>
          </form>

          {/* This will show success or error messages from the server action */}
          {message && (
            <div className={`p-4 mt-4 rounded-lg flex items-center gap-3 ${message.startsWith('Success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.startsWith('Success') ? <CheckCircle /> : <AlertTriangle />}
              <p>{message}</p>
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? 
            <Link href="/login" className="font-bold text-blue-600 hover:underline"> Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}