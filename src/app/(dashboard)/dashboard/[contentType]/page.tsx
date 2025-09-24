// File: app/dashboard/manage/[contentType]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Save, X, Briefcase, BookOpen, Heart, AlertTriangle } from 'lucide-react';
// FIX 1: Corrected the import path to 'post-opportunity'
import { manageContent } from '../post-job/actions'; 
import Link from 'next/link';

// --- Client Component for the Interactive List ---
"use client";

// Define the shape of our form state
interface ActionState {
  error?: string | null;
  success?: boolean;
}

function ManageContentList({ initialItems, contentType, contentConfig }: { initialItems: any[], contentType: string, contentConfig: any }) {
    const [items, setItems] = useState(initialItems);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    const handleAddNew = () => {
        const newItem = { id: 'new', title: '', description: '', location: '' };
        setItems([newItem, ...items]);
        setEditingItemId('new');
    };
    
    const cancelEdit = () => {
        if (editingItemId === 'new') {
            setItems(items.filter(item => item.id !== 'new'));
        }
        setEditingItemId(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{contentConfig.title}</h1>
                <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700">
                    <PlusCircle size={18} /> Add New {contentConfig.singular}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
                <AnimatePresence>
                    {items.map(item => (
                        editingItemId === item.id 
                        ? <EditForm key={item.id} item={item} contentType={contentType} onCancel={cancelEdit} />
                        : <ListItem key={item.id} item={item} contentType={contentType} onEdit={() => setEditingItemId(item.id)} />
                    ))}
                </AnimatePresence>
                {items.length === 0 && (
                     <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <contentConfig.icon className="mx-auto text-slate-400" size={40} />
                        <p className="mt-4 font-semibold text-slate-600">You have no {contentType} yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- List Item Component (Read-only view) ---
function ListItem({ item, contentType, onEdit }: { item: any, contentType: string, onEdit: () => void }) {
    // FIX 2: Provide a proper initial state to useFormState
    const [state, formAction] = useFormState(manageContent, { error: null, success: false });
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 rounded-lg bg-slate-50 border flex justify-between items-center">
            <div>
                <p className="font-bold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500">{item.location || item.type}</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onEdit} className="p-2 text-slate-500 hover:text-sky-600"><Edit size={16} /></button>
                <form action={formAction}>
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="contentType" value={contentType} />
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="p-2 text-slate-500 hover:text-red-600"><Trash2 size={16} /></button>
                </form>
            </div>
        </motion.div>
    );
}

// --- Edit Form Component (Expandable form) ---
function EditForm({ item, contentType, onCancel }: { item: any, contentType: string, onCancel: () => void }) {
    // FIX 2: Provide a proper initial state to useFormState
    const [state, formAction] = useFormState(manageContent, { error: null, success: false });
    
    useEffect(() => {
        if(state.success) onCancel();
    }, [state.success, onCancel]);

    return (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-4 rounded-lg bg-sky-50 border-2 border-sky-200 overflow-hidden">
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="intent" value={item.id === 'new' ? 'create' : 'update'} />
                <input type="hidden" name="contentType" value={contentType} />
                <input type="hidden" name="id" value={item.id} />

                <div>
                    <label className="font-medium text-gray-700 text-sm">Title</label>
                    <input name="title" required defaultValue={item.title} placeholder="e.g., Senior Software Engineer" className="mt-1 w-full h-10 px-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-sky-500" />
                </div>
                 <div>
                    <label className="font-medium text-gray-700 text-sm">Description</label>
                    <textarea name="description" rows={4} defaultValue={item.description} placeholder="Describe the item..." className="mt-1 w-full p-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-sky-500"></textarea>
                </div>
                <div>
                    <label className="font-medium text-gray-700 text-sm">Location</label>
                    <input name="location" defaultValue={item.location} placeholder="e.g., Hargeisa, Remote" className="mt-1 w-full h-10 px-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-sky-500" />
                </div>
                
                <div className="flex justify-end items-center gap-4 pt-4 border-t">
                    {state.error && <p className="text-red-500 text-sm flex items-center gap-2"><AlertTriangle size={16}/>{state.error}</p>}
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 flex items-center gap-2"><Save size={16}/> Save</button>
                </div>
            </form>
        </motion.div>
    );
}

// --- Main Server Component Page ---
export default async function ManageContentPage({ params }: { params: { contentType: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { contentType } = params;
    const contentConfig: { [key: string]: { tableName: string; title: string; singular: string; icon: React.ElementType; } } = {
        jobs: { tableName: 'jobs', title: 'Manage Jobs', singular: 'Job', icon: Briefcase },
        programs: { tableName: 'programs', title: 'Manage Programs', singular: 'Program', icon: BookOpen },
        initiatives: { tableName: 'initiatives', title: 'Manage Initiatives', singular: 'Initiative', icon: Heart },
    };

    const config = contentConfig[contentType];
    if (!config) notFound();

    const { data: items, error } = await supabase
        .from(config.tableName)
        .select('*')
        .eq('organization_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch error:", error);
    }

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">&larr; Back to Dashboard</Link>
                </div>
                <ManageContentList 
                    initialItems={items || []} 
                    contentType={contentType} 
                    contentConfig={config}
                />
            </div>
        </div>
    );
}