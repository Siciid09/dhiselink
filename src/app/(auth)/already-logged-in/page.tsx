import Link from 'next/link';
import { LogIn } from 'lucide-react';
// This import will now work correctly
import FuturisticRobot from '@/components/FuturisticRobot'; 

export default function AlreadyLoggedInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center p-4">
      <div className="max-w-md">
        <div className="mb-8">
            <FuturisticRobot initialPose={false} /> 
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">You're Already Logged In!</h1>
        <p className="mt-2 text-lg text-gray-600">
          There's no need to visit this page when you're already a member.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Go to Your Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}