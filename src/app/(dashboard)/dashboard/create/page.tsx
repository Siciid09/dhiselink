import React, { Suspense } from 'react'; // FIX: Added 'React' import
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateForm } from './CreateForm';
import { formConfigs } from './form-config';
import { createOpportunity, updateOpportunity } from './actions';
import { roleConfig } from '../page';
import ChooserMenu from './ChooserMenu';

export default async function CreatePage({ searchParams }: { searchParams: { type?: string, id?: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile) redirect('/select-role');

    const type = searchParams.type;
    const id = searchParams.id;
    const isEditMode = !!id;

    const userRoleConfig = roleConfig[profile.role] || roleConfig.company;
    const allowedTypes = userRoleConfig.creatableContentTypes.map((ct: any) => ct.type);

    if (type && !allowedTypes.includes(type)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-red-600">Authorization Error</h2>
                    <p className="text-slate-600 mt-2">You are not permitted to create this content type.</p>
                    <Link href="/dashboard/create" className="mt-4 inline-block text-sky-600 hover:underline">Go Back</Link>
                </div>
            </div>
        );
    }

    let initialData: Record<string, any> | null = null;
    const config = type ? formConfigs[type] : null;

    if (isEditMode && id && config) {
        let tableName = '';
        switch (config.opportunityType) {
            case 'Job': tableName = 'jobs'; break;
            case 'Program': tableName = 'programs'; break;
            case 'Service': tableName = 'services'; break;
            default: tableName = 'initiatives'; break;
        }
        const { data } = await supabase.from(tableName).select('*').eq('id', id).eq('organization_id', user.id).single();
        initialData = data;
    }
    
    return (
        <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                 <div className="mb-6">
                    <Link href={isEditMode ? "/dashboard/manage" : "/dashboard"} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                        <ArrowLeft size={16} /> Back to {isEditMode ? "Management" : "Dashboard"}
                    </Link>
                </div>
                <Suspense fallback={<div className="bg-white rounded-xl shadow-sm p-20 text-center font-semibold">Loading Form...</div>}>
                    {config ? (
                        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-200">
                            <header className="mb-10">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                  {isEditMode ? `Edit ${config.opportunityType}` : config.pageTitle}
                                </h1>
                                <p className="mt-2 text-lg text-slate-600">
                                  {config.pageDescription}
                                </p>
                            </header>
                            <CreateForm
                                config={config}
                                action={isEditMode ? updateOpportunity : createOpportunity}
                                initialData={initialData}
                                isEditMode={isEditMode}
                            />
                        </div>
                    ) : (
                        <ChooserMenu options={userRoleConfig.creatableContentTypes} />
                    )}
                {/* FIX: Corrected closing tag typo */}
                </Suspense> 
            </div>
        </div>
    );
}