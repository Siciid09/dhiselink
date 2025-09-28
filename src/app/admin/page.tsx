import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./admin-dashboard-client";

// These lines force Next.js to always render this page dynamically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const supabase = createClient();

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

  // Fetch all data for all tabs
  const { data: profiles } = await supabase.from("profiles").select('*');
  const { data: jobs } = await supabase.from("jobs").select('*, profiles(organization_name)');
  const { data: ideas } = await supabase.from("ideas").select('*');
  const { data: heritage_sites } = await supabase.from("heritage_sites").select('*');
  const { data: partners } = await supabase.from("partners").select('*').order('display_order');
  const { data: testimonials } = await supabase.from("testimonials").select('*');
  
  // Fetch stats for the overview panel
  const { count: userCount } = await supabase.from("profiles").select('*', { count: 'exact', head: true });
  const { count: jobCount } = await supabase.from("jobs").select('*', { count: 'exact', head: true });
  
  const stats = {
    userCount: userCount ?? 0,
    jobCount: jobCount ?? 0,
    orgCount: profiles?.filter(p => p.role !== 'individual').length ?? 0,
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Admin Headquarters</h1>
      <AdminDashboardClient
        initialProfiles={profiles || []}
        initialJobs={jobs || []}
        initialIdeas={ideas || []}
        initialHeritageSites={heritage_sites || []}
        initialPartners={partners || []}
        initialTestimonials={testimonials || []}
        initialStats={stats}
      />
    </div>
  );
}