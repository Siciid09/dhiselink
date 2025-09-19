// File Path: app/admin/layout.tsx

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from './_components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // 1. Check if user is logged in
  if (!session) {
    redirect('/auth/login');
  }

  // 2. Check if the user is an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    // If not an admin, redirect to the main dashboard
    redirect('/dashboard');
  }

  // If they are an admin, show the admin layout
  return (
    <div className="flex min-h-screen w-full bg-gray-100/40">
        <AdminSidebar />
        <main className="flex flex-col flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
    </div>
  );
}