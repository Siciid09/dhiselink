"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, MapPin, Loader2, Shield, Package, Search, Building, University } from 'lucide-react';

type OrgProfile = {
  id: string;
  slug: string; // <-- Added slug
  organization_name: string;
  logo_url: string | null;
  location: string | null;
  bio: string | null;
  organization_type: 'Company' | 'University' | 'Government' | 'NGO' | 'Other' | null;
  tags: string[] | null;
};

const iconMap = {
    Company: Building,
    University: University,
    Government: Landmark,
    NGO: Shield,
    Other: Package
};

const OrgCard = ({ profile }: { profile: OrgProfile }) => {
  const shortDescription = profile.bio ? profile.bio.split(' ').slice(0, 15).join(' ') + '...' : 'A leading organization in our network.';
  const RoleIcon = (profile.organization_type && iconMap[profile.organization_type]) || Building;

  return (
    <motion.div layout variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="bg-white rounded-xl border border-slate-200 h-full group transition-all duration-300 hover:shadow-xl hover:border-amber-500/50 hover:-translate-y-1 flex flex-col">
      <div className="p-6 flex-grow">
        {/* Card content remains the same */}
        <div className="flex items-start gap-4">
            <img src={profile.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.organization_name}`} alt={`${profile.organization_name} logo`} className="w-16 h-16 bg-white object-contain rounded-lg border p-1 flex-shrink-0" />
            <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700"><RoleIcon size={14} /> {profile.organization_type || 'Organization'}</span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">{profile.organization_name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><MapPin size={14} /> {profile.location || 'Location not specified'}</p>
            </div>
        </div>
        <p className="text-slate-600 text-sm mt-4 flex-grow line-clamp-2">{shortDescription}</p>
        {profile.tags && (<div className="mt-4 flex flex-wrap gap-2">{profile.tags.slice(0, 2).map(tag => (<span key={tag} className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{tag}</span>))}</div>)}
      </div>
      <div className="px-6 pb-6 mt-auto">
        {/* --- UPDATED: The link now uses profile.slug --- */}
        <a href={`/organizations/${profile.slug}`} className="block text-center w-full bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-900 group-hover:bg-amber-500 transition-colors duration-200">View Profile</a>
      </div>
    </motion.div>
  );
};


export default function OrganizationsPage() {
    const [data, setData] = useState<{ organizations: OrgProfile[], featured: OrgProfile[], tags: string[] }>({ organizations: [], featured: [], tags: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => { setSearchQuery(searchInput); }, 300);
        return () => { clearTimeout(timer); };
    }, [searchInput]);

    useEffect(() => {
        const fetchOrgs = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (activeTab !== 'All') params.append('type', activeTab);
                if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
                if (searchQuery) params.append('search', searchQuery);
                const response = await fetch(`/api/organizations?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch organizations.');
                const result = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrgs();
    }, [activeTab, selectedTags, searchQuery]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const tabs = ['All', 'Company', 'University', 'Government', 'NGO', 'Other'];

    if (error) { return <div className="text-center py-40 text-red-500">Error: {error}</div>; }
    // ... rest of the component JSX remains the same ...
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900">Explore Our Network</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Discover the companies, universities, and organizations driving progress in our community.</p>
                </header>
                {data.featured.length > 0 && (<div className="mb-16"><h2 className="text-2xl font-bold text-slate-800 mb-6">Featured Organizations</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{data.featured.map(org => <OrgCard key={org.id} profile={org} />)}</div></div>)}
                <div className="mb-12"><div className="relative mb-4"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Search by organization name..." onChange={(e) => setSearchInput(e.target.value)} className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none" /></div><div className="flex flex-wrap items-center gap-x-2 gap-y-3"><div className="text-sm font-semibold text-slate-600 mr-2">Filter by:</div>{tabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === tab ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'}`}>{tab}</button>))}</div>{data.tags.length > 0 && (<div className="mt-4 flex flex-wrap items-center gap-2">{data.tags.map(tag => (<button key={tag} onClick={() => handleTagToggle(tag)} className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${selectedTags.includes(tag) ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-50'}`}>{tag}</button>))}</div>)}</div>
                <main>{loading ? (<div className="flex justify-center items-center p-20"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>) : (<AnimatePresence>{data.organizations.length > 0 ? (<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>{data.organizations.map(org => ( <OrgCard key={org.id} profile={org} /> ))}</motion.div>) : (<div className="text-center bg-white p-12 rounded-lg border-2 border-dashed"><Building className="mx-auto h-12 w-12 text-slate-300" /><h3 className="mt-4 text-lg font-medium text-slate-800">No Organizations Found</h3><p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p></div>)}</AnimatePresence>)}</main>
            </div>
        </div>
    );
}