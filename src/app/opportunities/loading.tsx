import { Briefcase, MapPin, Search } from 'lucide-react';

// This is a single placeholder card with a pulsing animation.
const JobCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col animate-pulse">
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0"></div>
            <div className="w-full space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="h-4 w-1/2 rounded bg-slate-200"></div>
            </div>
        </div>
        <div className="my-4 space-y-2">
             <div className="h-3 w-full rounded bg-slate-200"></div>
             <div className="h-3 w-5/6 rounded bg-slate-200"></div>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
             <div className="h-3 w-1/4 rounded bg-slate-200"></div>
             <div className="h-10 w-24 rounded-lg bg-slate-200"></div>
        </div>
    </div>
);

// This is the main loading component that lays out the full page.
export default function OpportunitiesLoading() {
    return (
        <div>
            <header className="text-center mb-12">
                <div className="h-12 w-3/4 mb-4 rounded-lg bg-slate-200 mx-auto"></div>
                <div className="h-6 w-1/2 rounded-lg bg-slate-200 mx-auto"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* --- Filters & Search Sidebar Skeleton --- */}
                <aside className="md:col-span-1">
                    <div className="sticky top-24 p-6 bg-white rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
                        <div className="h-12 w-full rounded-lg bg-slate-200"></div>
                        <div className="space-y-3">
                            <div className="h-5 w-1/3 rounded-lg bg-slate-200"></div>
                            <div className="h-8 w-full rounded-md bg-slate-100"></div>
                            <div className="h-8 w-full rounded-md bg-slate-100"></div>
                            <div className="h-8 w-full rounded-md bg-slate-100"></div>
                        </div>
                    </div>
                </aside>

                {/* --- Job Listings Skeleton --- */}
                <main className="md:col-span-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
                    </div>
                </main>
            </div>
        </div>
    );
}