// src/app/(dashboard)/dashboard/[contentType]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { Briefcase, BookOpen, Heart, Wrench } from 'lucide-react';
import ManageContentClientUI from './ManageContentClientUI'; // Client Component

export default async function ManageContentPage({ params }: { params: { contentType: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { contentType } = params;
    const contentConfig: { [key: string]: { tableName: string; title: string; singular: string; icon: React.ElementType } } = {
        jobs: { tableName: 'jobs', title: 'Manage Jobs', singular: 'Job', icon: Briefcase },
        programs: { tableName: 'programs', title: 'Manage Programs', singular: 'Program', icon: BookOpen },
        initiatives: { tableName: 'initiatives', title: 'Manage Initiatives', singular: 'Initiative', icon: Heart },
        services: { tableName: 'services', title: 'Manage Services', singular: 'Service', icon: Wrench },
    };

    const config = contentConfig[contentType];
    if (!config) notFound();

    const { data: items, error } = await supabase
        .from(config.tableName)
        .select('*')
        .eq('organization_id', user.id)
        .order('created_at', { ascending: false });

    if (error) console.error("Fetch error:", error);

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">&larr; Back to Dashboard</Link>
                </div>
                <ManageContentClientUI
                    initialItems={items || []}
                    contentType={contentType}
                    contentConfig={config}
                />
            </div>
        </div>
    );
}
