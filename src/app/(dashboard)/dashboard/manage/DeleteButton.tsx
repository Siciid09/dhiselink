"use client";

import { deleteItem } from './actions'; // Correctly imports from its own actions file
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteButton({ item }: { item: { id: string, type: string } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const deleteItemWithId = deleteItem.bind(null, item.id, item.type);

    const handleDelete = async () => {
        startTransition(async () => {
            await deleteItemWithId();
            setIsOpen(false);
        });
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)} 
                title="Delete" 
                className="p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
            >
                <Trash2 size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
                                    <AlertTriangle className="text-red-600 h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Confirm Deletion</h2>
                            </div>
                            <p className="text-slate-600 my-4">Are you sure you want to permanently delete this item? This action cannot be undone.</p>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
                                <button type="button" onClick={handleDelete} disabled={isPending} className="px-5 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 w-28">
                                    {isPending ? <Loader2 className="animate-spin" size={18}/> : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}