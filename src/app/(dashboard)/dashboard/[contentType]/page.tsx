"use client"; // MUST be first line

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormState, useFormStatus } from 'react-dom';
import { PlusCircle, Edit, Trash2, Save, X, Briefcase, BookOpen, Heart, AlertTriangle, Wrench } from 'lucide-react';
import { manageContent } from '../create/actions'; // Client action
import Link from 'next/link';

// ================== CLIENT COMPONENT ==================
interface ActionState {
  error?: string | null;
  success?: boolean;
}

export function ManageContentClientUI({ initialItems, contentType, contentConfig }: { initialItems: any[], contentType: string, contentConfig: any }) {
    const [items, setItems] = useState(initialItems);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    const refetchItems = async () => {
        const response = await fetch(`/api/content/${contentType}`);
        if (response.ok) {
            const data = await response.json();
            setItems(data);
        }
    };

    const handleAddNew = () => {
        const newItem = { id: 'new', title: '', description: '', location: '', type: '', department: '' };
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
                <h1 className="text-3xl font-bold text-slate-900">{contentConfig.title}</h1>
                <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700">
                    <PlusCircle size={18} /> Add New {contentConfig.singular}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
                <AnimatePresence>
                    {items.map(item => (
                        editingItemId === item.id 
                        ? <EditForm key={item.id} item={item} contentType={contentType} onCancel={cancelEdit} onSaveSuccess={refetchItems} />
                        : <ListItem key={item.id} item={item} contentType={contentType} onEdit={() => setEditingItemId(item.id)} />
                    ))}
                </AnimatePresence>
                {!editingItemId && items.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <contentConfig.icon className="mx-auto text-slate-400" size={40} />
                        <p className="mt-4 font-semibold text-slate-600">You have no {contentType} yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ListItem({ item, contentType, onEdit }: { item: any, contentType: string, onEdit: () => void }) {
    const [state, formAction] = useFormState(manageContent, { error: null });
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 rounded-lg bg-slate-50 border flex justify-between items-center">
            <div>
                <p className="font-bold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500">{item.location || item.type || item.department}</p>
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

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 flex items-center gap-2 disabled:bg-sky-400">
            <Save size={16}/> {pending ? 'Saving...' : 'Save'}
        </button>
    );
}

function EditForm({ item, contentType, onCancel, onSaveSuccess }: { item: any, contentType: string, onCancel: () => void, onSaveSuccess: () => void }) {
    const [state, formAction] = useFormState(manageContent, { error: null });

    useEffect(() => {
        if (state.success) {
            onCancel();
            onSaveSuccess();
        }
    }, [state.success, onCancel, onSaveSuccess]);

    return (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-4 rounded-lg bg-sky-50 border-2 border-sky-200 overflow-hidden">
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="intent" value={item.id === 'new' ? 'create' : 'update'} />
                <input type="hidden" name="contentType" value={contentType} />
                {item.id !== 'new' && <input type="hidden" name="id" value={item.id} />}

                <div>
                    <label className="font-medium text-gray-700 text-sm">Title</label>
                    <input name="title" required defaultValue={item.title} placeholder="e.g., Senior Software Engineer" className="mt-1 w-full h-10 px-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                    <label className="font-medium text-gray-700 text-sm">Description</label>
                    <textarea name="description" rows={4} defaultValue={item.description} placeholder="Describe the item..." className="mt-1 w-full p-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-sky-500"></textarea>
                </div>
                <div>
                    <label className="font-medium text-gray-700 text-sm">Location / Type / Department</label>
                    <input name="secondary_field" defaultValue={item.location || item.type || item.department} placeholder="e.g., Hargeisa, Remote, Full-time" className="mt-1 w-full h-10 px-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-sky-500" />
                </div>

                <div className="flex justify-end items-center gap-4 pt-4 border-t">
                    {state.error && <p className="text-red-500 text-sm flex items-center gap-2 mr-auto"><AlertTriangle size={16}/>{state.error}</p>}
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100">Cancel</button>
                    <SubmitButton />
                </div>
            </form>
        </motion.div>
    );
}

// ================== SERVER COMPONENT ==================
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export default async function ManageContentPage({ params }: { params: { contentType: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { contentType } = params;
    const contentConfig: { [key: string]: { tableName: string; title: string; singular: string; icon: React.ElementType; } } = {
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
