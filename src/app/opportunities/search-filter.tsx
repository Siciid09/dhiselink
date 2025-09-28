"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search } from 'lucide-react';

export default function SearchFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleTypeFilter = (type: string) => {
        const params = new URLSearchParams(searchParams);
        if (type && type !== 'All') {
            params.set('type', type.toLowerCase());
        } else {
            params.delete('type');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
    const activeType = searchParams.get('type') || 'All';

    return (
        <div className="mb-12">
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by title, organization, or tags..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('q')?.toString()}
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {jobTypes.map(type => {
                    const isActive = type.toLowerCase() === activeType.toLowerCase();
                    return (
                        <button
                            key={type}
                            onClick={() => handleTypeFilter(type)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isActive ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border'}`}
                        >
                            {type}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}


/// i can click and see the actual post when i create new so there is no nead to go back to fix that creating folder pages, but when i click ti the the exlore page or visit the job not showing really so the explore pages really need udpate mate, its ot showing the new udpated jobs, not showing by latest, and also 