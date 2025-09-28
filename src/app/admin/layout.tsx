// admin/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // --- Database-driven admin check ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  // Layout without AdminSidebar
  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
