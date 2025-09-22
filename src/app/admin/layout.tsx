import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // --- THIS IS THE CORRECTED, DATABASE-DRIVEN ADMIN CHECK ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    // If the logged-in user's profile does not have is_admin: true, redirect.
    redirect("/dashboard");
  }

  // If the check passes, the layout and the page inside it will render.
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}