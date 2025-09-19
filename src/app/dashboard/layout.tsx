// File Path: app/dashboard/layout.tsx

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SidebarNav } from './_components/SidebarNav';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// This layout component will wrap all pages inside the /dashboard route
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  // Check for an active user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no user is logged in, redirect them to the login page
  if (!session) {
    redirect('/auth/login');
  }

  // If the user is logged in, display the layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Added a bit more padding for better spacing on larger screens */}
      <div className="container mx-auto px-4 py-24 md:py-32 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <SidebarNav />
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
