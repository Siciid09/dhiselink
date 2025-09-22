import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function TestAdminPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1>Test Page</h1>
        <p>Status: NOT LOGGED IN</p>
      </div>
    );
  }

  // Fetch the entire profile for the current user
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*') // Select EVERYTHING
    .eq('id', user.id)
    .single();

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        <h1>Error Fetching Profile from Database</h1>
        <p>This likely means a Row Level Security policy is blocking the request.</p>
        <hr style={{ margin: '2rem 0' }} />
        <h2>Full Error Details:</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      <h1>Admin Test Page</h1>
      <p>This page shows exactly what the server sees for your user profile.</p>
      
      <hr style={{ margin: '2rem 0' }} />

      <h2>Current User ID:</h2>
      <p>{user.id}</p>
      
      <hr style={{ margin: '2rem 0' }} />

      <h2>Profile Data Found in `profiles` Table:</h2>
      {profile ? (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      ) : (
        <p style={{ color: 'red', fontWeight: 'bold' }}>PROFILE NOT FOUND!</p>
      )}
    </div>
  );
}