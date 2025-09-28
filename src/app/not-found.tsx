// app/not-found.tsx
"use client"; // This line is absolutely essential!

import Link from 'next/link';
import Lottie from 'lottie-react';
import { notFoundAnimationData } from '@/lib/animation-data'; // Adjust path if you saved the file elsewhere

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center px-4">
      
      {/* This div controls the size of the animation */}
      <div className="w-full max-w-lg">
        <Lottie 
          animationData={notFoundAnimationData} 
          loop={true}
          autoplay={true}
        />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl -mt-12 md:-mt-20">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-lg text-slate-600">
        Oops! The page you're looking for seems to have floated away.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-900"
      >
        Go back home
      </Link>
    </div>
  );
}