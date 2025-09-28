import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/(auth)/login/actions';
import { LogIn, UserPlus } from 'lucide-react';

export default async function AuthButton() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-all">
        Dashboard
      </Link>
      <form action={signOut}>
        <button className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-all">
          Sign Out
        </button>
      </form>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2">
        <LogIn size={16}/> Login
      </Link>
      <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-all flex items-center gap-2">
        <UserPlus size={16}/> Sign Up
      </Link>
    </div>
  );
}