"use client";

import { useState } from 'react';
import { Briefcase, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { approveJobAction, rejectJobAction, deleteJobAction } from '@/app/admin/actions';

// Helper function to format dates
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

// Helper function to show toast notifications (requires a library like react-hot-toast)
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Replace this with your actual toast notification call
  console.log(`Toast: ${message} (${type})`);
  alert(message);
};

export default function JobsTab({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.organization_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (action: (id: string) => Promise<any>, id: string, successCallback: () => void) => {
    const result = await action(id);
    if (result.success) {
      successCallback();
      showToast(result.message);
    } else {
      showToast(result.message, 'error');
    }
  };

  const onApprove = (id: string) => handleAction(approveJobAction, id, () => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'active' } : j));
  });

  const onReject = (id: string) => handleAction(rejectJobAction, id, () => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'closed' } : j));
  });

  const onDelete = (id: string) => handleAction(deleteJobAction, id, () => {
    setJobs(jobs.filter(j => j.id !== id));
  });

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active': return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>;
      case 'closed': return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Closed/Rejected</span>;
      case 'draft': return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Pending</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><Briefcase size={20} /> Jobs Moderation</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm h-10 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-300"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Job Title</th>
              <th>Company</th>
              <th>Posted On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map(job => (
              <tr key={job.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{job.title}</td>
                <td>{job.organization_name || 'N/A'}</td>
                <td>{formatDate(job.created_at)}</td>
                <td>{getStatusChip(job.status)}</td>
                <td className="flex items-center gap-1">
                  {job.status === 'draft' && (
                    <>
                      <button onClick={() => onApprove(job.id)} title="Approve" className="text-green-600 p-2 hover:bg-green-100 rounded-full"><CheckCircle size={16} /></button>
                      <button onClick={() => onReject(job.id)} title="Reject" className="text-orange-600 p-2 hover:bg-orange-100 rounded-full"><XCircle size={16} /></button>
                    </>
                  )}
                  <button onClick={() => onDelete(job.id)} title="Delete" className="text-red-600 p-2 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}