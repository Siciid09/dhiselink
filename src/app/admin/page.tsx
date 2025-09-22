import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./admin-dashboard-client";

// These two lines are the fix. They force Next.js to always render this page dynamically.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  // Fetch all data for the dashboard
  const { data: profiles } = await supabase.from("profiles").select('*');
  const { data: jobs } = await supabase.from("jobs").select('*, profiles(organization_name)');
  const { count: userCount } = await supabase.from("profiles").select('*', { count: 'exact', head: true });
  const { count: jobCount } = await supabase.from("jobs").select('*', { count: 'exact', head: true });
  
  const stats = {
    userCount: userCount ?? 0,
    jobCount: jobCount ?? 0,
    orgCount: profiles?.filter(p => p.role !== 'individual').length ?? 0,
  };

  return (
    <div className="flex">
        {/* Assuming you have a sidebar component for your admin layout */}
        {/* <AdminSidebar /> */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Admin Headquarters</h1>
            <AdminDashboardClient
                initialProfiles={profiles || []}
                initialJobs={jobs || []}
                initialStats={stats}
            />
        </main>
    </div>
  );
}