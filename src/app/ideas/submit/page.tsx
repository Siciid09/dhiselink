// File Path: app/ideas/submit/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function SubmitIdeaPage() {
    // Form state
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [summary, setSummary] = useState('');
    const [details, setDetails] = useState('');
    const [seeking, setSeeking] = useState('');
    
    // Auth and UI state
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Start in a loading state
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const supabase = createClientComponentClient();

    // This is the corrected hook that fixes the redirect loop
    useEffect(() => {
        const checkSession = async () => {
            // First, get the current session immediately on page load
            const { data: { session } } = await supabase.auth.getSession();
            
            // If there's no session, it means the user is truly not logged in
            if (!session) {
                router.push('/login');
            } else {
                // If there IS a session, set the user and stop the loading state
                setUser(session.user);
                setLoading(false);
            }
        };

        checkSession();
    }, [router, supabase.auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);

        const response = await fetch('/api/ideas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                category,
                summary,
                details,
                seeking: seeking.split(',').map(s => s.trim()),
            }),
        });
        
        const newIdea = await response.json();

        if (response.ok) {
            router.push(`/ideas/${newIdea.id}`);
        } else {
            setFormError(newIdea.error || "An error occurred while submitting.");
        }
        setIsSubmitting(false);
    };
    
    // Show a loading message while we verify the user's session
    if (loading) {
        return <div className="pt-40 text-center">Verifying authentication...</div>;
    }

    // If we are not loading and there is a user, show the form
    return (
        <div className="bg-gray-50 pt-40 pb-24 min-h-screen">
            <div className="container mx-auto px-6 max-w-2xl">
                <div className="bg-white p-8 rounded-lg shadow-lg border">
                    <h1 className="text-3xl font-bold mb-6">Submit a New Idea</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Idea Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                         <div>
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Summary (Short Pitch)</label>
                            <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} required rows={3} className="w-full p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Full Details</label>
                            <textarea id="details" value={details} onChange={e => setDetails(e.target.value)} required rows={6} className="w-full p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label htmlFor="seeking" className="block text-sm font-medium text-gray-700 mb-1">Seeking (Collaborators, Funding, etc.)</label>
                            <input type="text" id="seeking" value={seeking} onChange={e => setSeeking(e.target.value)} placeholder="Separate with commas, e.g., Developer, Funding" required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                            {isSubmitting ? 'Submitting...' : 'Submit Idea'}
                        </button>
                        {formError && <p className="text-red-500 text-center mt-4">{formError}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}