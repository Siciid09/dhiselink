"use client";

import { useState, Fragment } from "react";
import { Tab, Dialog, Transition } from "@headlessui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Briefcase, Building, ShieldCheck, Trash2, Search } from "lucide-react";
import { deleteJobAction, banUserAction } from "./actions";

// Helper function to format dates
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

export default function AdminDashboardClient({ initialProfiles, initialJobs, initialStats }: { initialProfiles: any[], initialJobs: any[], initialStats: any }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [jobs, setJobs] = useState(initialJobs);
  const [stats, setStats] = useState(initialStats);
  
  // State for modals
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Search state
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    p.organization_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    p.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredJobs = jobs.filter(j => 
    j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.profiles?.organization_name?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const handleDelete = async () => {
    if (selectedItem?.id) {
      await deleteJobAction(selectedItem.id);
      setJobs(jobs.filter(j => j.id !== selectedItem.id));
      setDeleteModalOpen(false);
    }
  };

  const handleBan = async () => {
    if (selectedItem?.id) {
      await banUserAction(selectedItem.id);
      setProfiles(profiles.map(p => p.id === selectedItem.id ? { ...p, is_banned: true } : p));
      setBanModalOpen(false);
    }
  };
  
  // Dummy data for charts
  const signupData = [
    { name: 'Jan', users: 30 }, { name: 'Feb', users: 45 }, { name: 'Mar', users: 60 },
    { name: 'Apr', users: 50 }, { name: 'May', users: 70 }, { name: 'Jun', users: 90 },
  ];

  return (
    <>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-slate-200 p-1 mb-6">
          <Tab as={Fragment}>
            {({ selected }) => <button className={selected ? 'bg-white text-blue-700' : 'bg-transparent text-slate-600'} >Overview</button>}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => <button className={selected ? 'bg-white text-blue-700' : 'bg-transparent text-slate-600'} >User Management</button>}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => <button className={selected ? 'bg-white text-blue-700' : 'bg-transparent text-slate-600'} >Job Management</button>}
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Overview Panel */}
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border"><User className="text-blue-500 mb-2" /> <h3 className="font-bold text-2xl">{stats.userCount}</h3> <p>Total Users</p></div>
              <div className="bg-white p-6 rounded-xl border"><Building className="text-green-500 mb-2" /> <h3 className="font-bold text-2xl">{stats.orgCount}</h3> <p>Total Organizations</p></div>
              <div className="bg-white p-6 rounded-xl border"><Briefcase className="text-purple-500 mb-2" /> <h3 className="font-bold text-2xl">{stats.jobCount}</h3> <p>Total Jobs Posted</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl border h-96">
                <h3 className="font-bold mb-4">User Signups This Year</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={signupData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="users" fill="#3b82f6" /></BarChart>
                </ResponsiveContainer>
            </div>
          </Tab.Panel>
          
          {/* User Management Panel */}
          <Tab.Panel>
             <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search users by name or email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full max-w-sm h-12 pl-10 pr-4 rounded-lg bg-white border border-slate-300" />
             </div>
             <div className="overflow-x-auto bg-white rounded-xl border">
                 <table className="w-full text-sm text-left">
                     <thead><tr><th>Name / Org</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                     <tbody>
                         {filteredProfiles.map(p => (
                             <tr key={p.id}>
                                 <td>{p.organization_name || p.full_name}</td>
                                 <td>{p.email}</td>
                                 <td>{p.role}</td>
                                 <td>
                                     <button onClick={() => { setSelectedItem(p); setBanModalOpen(true); }} className="text-red-600 p-2"><ShieldCheck size={16} /></button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
          </Tab.Panel>
          
          {/* Job Management Panel */}
          <Tab.Panel>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search jobs by title or company..." value={jobSearch} onChange={(e) => setJobSearch(e.target.value)} className="w-full max-w-sm h-12 pl-10 pr-4 rounded-lg bg-white border border-slate-300" />
             </div>
             <div className="overflow-x-auto bg-white rounded-xl border">
                 <table className="w-full text-sm text-left">
                     <thead><tr><th>Job Title</th><th>Company</th><th>Posted On</th><th>Status</th><th>Actions</th></tr></thead>
                     <tbody>
                         {filteredJobs.map(j => (
                             <tr key={j.id}>
                                 <td>{j.title}</td>
                                 <td>{j.profiles?.organization_name}</td>
                                 <td>{formatDate(j.created_at)}</td>
                                 <td><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{j.status}</span></td>
                                 <td>
                                     <button onClick={() => { setSelectedItem(j); setDeleteModalOpen(true); }} className="text-red-600 p-2"><Trash2 size={16} /></button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setDeleteModalOpen(false)}>
              <div className="fixed inset-0 bg-black/30" />
              <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                      <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">Delete Job Post</Dialog.Title>
                      <p className="mt-2 text-sm text-gray-500">Are you sure you want to delete this job post? This action cannot be undone.</p>
                      <div className="mt-4 space-x-2"><button onClick={handleDelete} className="bg-red-600 text-white">Confirm Delete</button><button onClick={() => setDeleteModalOpen(false)}>Cancel</button></div>
                  </Dialog.Panel>
              </div></div>
          </Dialog>
      </Transition>
      
      {/* Ban Confirmation Modal */}
       <Transition appear show={isBanModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setBanModalOpen(false)}>
               <div className="fixed inset-0 bg-black/30" />
              <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                      <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">Ban User</Dialog.Title>
                      <p className="mt-2 text-sm text-gray-500">Are you sure you want to ban this user? This will prevent them from accessing certain features.</p>
                      <div className="mt-4 space-x-2"><button onClick={handleBan} className="bg-red-600 text-white">Confirm Ban</button><button onClick={() => setBanModalOpen(false)}>Cancel</button></div>
                  </Dialog.Panel>
              </div></div>
          </Dialog>
      </Transition>
    </>
  );
}

// Basic styling for table and buttons (add to your global CSS)
/*
  table { border-collapse: collapse; }
  th, td { padding: 0.75rem 1.5rem; border-bottom: 1px solid #e5e7eb; }
  thead { background-color: #f9fafb; }
  tbody tr:hover { background-color: #f9fafb; }
  button { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; border: 1px solid transparent; }
  button:hover { opacity: 0.9; }
*/