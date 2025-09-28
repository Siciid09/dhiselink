// app/organizations/page.tsx

import { Suspense } from 'react';
import OrganizationsClientPage from './OrganizationsClientPage';
import { Loader2 } from 'lucide-react';

// A simple loading component for the fallback
function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );
}

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrganizationsClientPage />
    </Suspense>
  );
}