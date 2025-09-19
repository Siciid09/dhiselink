// File Path: app/dashboard/post-job/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';
import { Briefcase, Info, AlertTriangle } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PostJobPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('full-time');
    const [industry, setIndustry] = useState('');
    const [description, setDescription] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [tags, setTags] = useState('');

    useEffect(() => {
        const checkUserSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Redirect to login if not authenticated
                window.location.href = '/login';
            } else {
                setUser(session.user);
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        // NOTE: In a real application, you would get the user's organization ID.
        // For now, we are simulating this. This will be the next step to build.
        console.log({
            title,
            location,
            jobType,
            industry,
            description,
            shortDescription,
            requirements: requirements.split('\n'), // Simple split by new line
            tags: tags.split(',').map(tag => tag.trim()), // Split by comma
        });

        // Placeholder for API call
        // const response = await fetch('/api/opportunities', { ... });
        
        // Simulate API call for now
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For now, we'll just show a success message.
        // In the next step, we will build the API logic to actually save this data.
        setSuccess('Job has been posted successfully! (Simulation)');
        
        setIsSubmitting(false);
    };
    
    if (loading) {
        return <div className="pt-40 text-center">Verifying access...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-3xl">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Post a New Opportunity</h1>
                    <p className="mt-2 text-lg text-gray-600">Fill out the details below to publish a new job, project, or internship on Dhiselink.</p>
                </header>

                <div className="bg-white p-8 rounded-lg shadow-lg border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="border-b pb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Briefcase /> Basic Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Hargeisa or Remote" required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">Type of Opportunity</label>
                                    <select id="jobType" value={jobType} onChange={e => setJobType(e.target.value)} className="w-full h-12 px-3 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                        <option value="temporary">Temporary</option>
                                        <option value="remote">Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                    <input type="text" id="industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g., Fintech, Construction" required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="border-b pb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Info /> Opportunity Details</h2>
                             <div>
                                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <input type="text" id="shortDescription" value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="A one-sentence summary for job cards." required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="mt-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={8} className="w-full p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                             <div className="mt-6">
                                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                                <textarea id="requirements" value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="List one requirement per line." required rows={5} className="w-full p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., react, fintech, project-management" required className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                <p className="text-xs text-gray-500 mt-1">Separate tags with a comma.</p>
                            </div>
                        </div>
                        
                        {/* Submission */}
                        <div>
                             {error && <p className="text-red-600 bg-red-50 p-3 rounded-md mb-4 flex items-center gap-2"><AlertTriangle size={16}/> {error}</p>}
                             {success && <p className="text-green-600 bg-green-50 p-3 rounded-md mb-4">{success}</p>}
                            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-lg">
                                {isSubmitting ? 'Submitting...' : 'Submit Opportunity'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

