"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, MapPin, Loader2, Shield, Package, Search, Building } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

type OrgProfile = {
  id: string;
  organization_name: string;
  logo_url: string | null;
  location: string | null;
  bio: string | null;
  role: 'ngo_gov' | 'other';
  organization_type: 'Government' | 'NGO' | null;
  // Updated: Added the new subtype field
  organization_subtype: string | null; 
};

const OrgCard = ({ profile }: { profile: OrgProfile }) => {
  const shortDescription = profile.bio ? profile.bio.split(' ').slice(0, 15).join(' ') + '...' : 'Leading initiatives for community and public development.';
  
  // Updated: The display logic for the card's role/type
  let roleName = 'Organization';
  let RoleIcon = Building; 

  if (profile.role === 'other') {
    // If the role is 'other', display its specific subtype
    roleName = profile.organization_subtype || 'Organization';
    RoleIcon = Package;
  } else if (profile.organization_type === 'Government') {
    roleName = 'Government';
    RoleIcon = Landmark;
  } else if (profile.organization_type === 'NGO') {
    roleName = 'NGO';
    RoleIcon = Shield;
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <img src={profile.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.organization_name}`} alt={`${profile.organization_name} logo`} className="w-16 h-16 bg-white object-contain rounded-md border p-1 flex-shrink-0" />
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              <RoleIcon size={14} /> {roleName}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">{profile.organization_name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><MapPin size={14} /> {profile.location || 'Location not specified'}</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm mt-4 flex-grow line-clamp-3">{shortDescription}</p>
      </div>
      <div className="px-6 pb-6 mt-auto">
        <Link href={`/organizations/${profile.id}`} className="block text-center w-full bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-200">View Profile</Link>
      </div>
    </motion.div>
  );
};

export default function GovernmentAndOthersPage() {
  const [orgs, setOrgs] = useState<OrgProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'Government' | 'NGO' | 'other'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await fetch('/api/government-ngos');
        if (!response.ok) throw new Error('Failed to fetch organizations.');
        const data = await response.json();
        setOrgs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);
  
  const handleSearch = useDebouncedCallback((term: string) => { setSearchQuery(term); }, 300);
  
  const filteredOrgs = useMemo(() => {
    return orgs
      .filter(org => {
        if (activeTab === 'all') return true;
        if (activeTab === 'other') return org.role === 'other';
        return org.organization_type === activeTab;
      })
      .filter(org => org.organization_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeTab, searchQuery, orgs]);

  const tabs = [
    { id: 'all', name: 'All' }, { id: 'Government', name: 'Government' },
    { id: 'NGO', name: 'NGOs' }, { id: 'other', name: 'Other' },
  ];

  if (loading) { return ( <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50"> <Loader2 className="w-10 h-10 animate-spin text-sky-500" /> <p className="mt-4 text-slate-600">Loading organizations...</p> </div> ); }
  if (error) { return <div className="text-center py-40 text-red-500">Error: {error}</div>; }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">Government & Other Entities</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Discover public sector bodies, non-governmental organizations, and other entities leading key initiatives.</p>
        </header>

        <div className="mb-12">
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search by organization name..." onChange={(e) => handleSearch(e.target.value)} className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div className="flex justify-center border-b">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`${activeTab === tab.id ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'} transition-all duration-200 whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-sm`}>
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>
        
        <main>
          <AnimatePresence>
            {filteredOrgs.length > 0 ? (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                {filteredOrgs.map(org => ( <OrgCard key={org.id} profile={org} /> ))}
              </motion.div>
            ) : (
              <div className="text-center bg-white p-12 rounded-lg border border-dashed"><Landmark className="mx-auto h-12 w-12 text-slate-300" /><h3 className="mt-4 text-lg font-medium text-slate-800">No Organizations Found</h3><p className="mt-1 text-sm text-slate-500">No organizations match your current search and filter.</p></div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}