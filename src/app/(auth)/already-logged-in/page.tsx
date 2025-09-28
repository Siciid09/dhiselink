import Link from 'next/link';
// UPDATED: Using a standard icon for consistency
import { CheckCircle } from 'lucide-react';

export default function AlreadyLoggedInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center p-4">
      <div className="max-w-md">
        <div className="mb-8">
            {/* UPDATED: Using a standard icon */}
            <CheckCircle className="w-24 h-24 text-amber-500 mx-auto" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">You're Already Logged In!</h1>
        <p className="mt-2 text-lg text-slate-600">
          There's no need to visit this page when you're already signed in.
        </p>
        <div className="mt-8">
            {/* UPDATED: Button theme */}
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition-all duration-300"
          >
            Go to Your Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
