import Link from 'next/link';
import { login } from './actions';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Welcome Back</h1>
          <p className="text-slate-600 mt-2">Sign in to access your dashboard.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border">
          <form action={login} className="space-y-5">
            <input name="email" placeholder="Email Address" required className="w-full h-12 px-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" />
            <input name="password" type="password" placeholder="Password" required className="w-full h-12 px-4 rounded-lg bg-slate-50 border focus:ring-2 focus:ring-amber-500" />
            {searchParams?.message && <p className="p-4 bg-red-50 text-red-800 rounded-lg text-center">{searchParams.message}</p>}
            <button className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900">Sign In</button>
          </form>
          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account? 
            <Link href="/register" className="font-bold text-amber-600 hover:underline"> Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}