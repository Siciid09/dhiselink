"use client";

import { useState } from 'react';
import { Lightbulb, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { approveIdeaAction, rejectIdeaAction, deleteIdeaAction } from '@/app/admin/actions';

// Re-using helper functions from the JobsTab example
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  console.log(`Toast: ${message} (${type})`);
  alert(message);
};

export default function IdeasTab({ initialIdeas }: { initialIdeas: any[] }) {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [search, setSearch] = useState("");

  const filteredIdeas = ideas.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase())
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

  const onApprove = (id: string) => handleAction(approveIdeaAction, id, () => {
    setIdeas(ideas.map(i => i.id === id ? { ...i, status: 'approved' } : i));
  });

  const onReject = (id: string) => handleAction(rejectIdeaAction, id, () => {
    setIdeas(ideas.map(i => i.id === id ? { ...i, status: 'rejected' } : i));
  });

  const onDelete = (id: string) => handleAction(deleteIdeaAction, id, () => {
    setIdeas(ideas.filter(i => i.id !== id));
  });
  
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'approved': return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Rejected</span>;
      case null:
      case 'pending': 
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Pending</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
       <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><Lightbulb size={20} /> Ideas Moderation</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search ideas..."
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
              <th className="p-3">Idea Title</th>
              <th>Category</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIdeas.map(idea => (
              <tr key={idea.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{idea.title}</td>
                <td>{idea.category || 'N/A'}</td>
                <td>{formatDate(idea.created_at)}</td>
                <td>{getStatusChip(idea.status)}</td>
                <td className="flex items-center gap-1">
                   {(!idea.status || idea.status === 'pending') && (
                    <>
                      <button onClick={() => onApprove(idea.id)} title="Approve" className="text-green-600 p-2 hover:bg-green-100 rounded-full"><CheckCircle size={16} /></button>
                      <button onClick={() => onReject(idea.id)} title="Reject" className="text-orange-600 p-2 hover:bg-orange-100 rounded-full"><XCircle size={16} /></button>
                    </>
                  )}
                  <button onClick={() => onDelete(idea.id)} title="Delete" className="text-red-600 p-2 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}