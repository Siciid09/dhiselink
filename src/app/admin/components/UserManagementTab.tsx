"use client";

import { useState } from 'react';
import { User, ShieldCheck, Search, ShieldOff, Trash2 } from 'lucide-react';
import { banUserAction, deleteSiteAction } from '@/app/admin/actions';

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  console.log(`Toast: ${message} (${type})`);
  alert(message);
};

export default function UserManagementTab({ initialProfiles }: { initialProfiles: any[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [search, setSearch] = useState("");

  const filteredProfiles = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.organization_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const onBan = async (id: string) => {
    const result = await banUserAction(id);
    if (result.success) {
      setProfiles(profiles.map(p => p.id === id ? { ...p, is_banned: true } : p));
      showToast(result.message);
    } else {
      showToast(result.message, 'error');
    }
  };
  
  const onDelete = async (id: string) => {
    if (!confirm("Are you sure? This will permanently delete the user and cannot be undone.")) {
      return;
    }
    const result = await deleteSiteAction(id);
    if (result.success) {
      setProfiles(profiles.filter(p => p.id !== id));
      showToast(result.message);
    } else {
      showToast(result.message, 'error');
    }
  };


  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><User size={20} /> User Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, org, or email..."
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
              <th className="p-3">Name / Organization</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map(profile => (
              <tr key={profile.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium">{profile.organization_name || profile.full_name || 'N/A'}</td>
                <td>{profile.email}</td>
                <td>{profile.role || 'N/A'}</td>
                <td>
                  {profile.is_banned ? (
                    <span className="text-red-600 flex items-center gap-1 text-xs"><ShieldOff size={14} /> Banned</span>
                  ) : (
                    <span className="text-green-600 flex items-center gap-1 text-xs"><ShieldCheck size={14} /> Active</span>
                  )}
                </td>
                <td className="flex items-center gap-1">
                  {!profile.is_banned && (
                    <button onClick={() => onBan(profile.id)} title="Ban User" className="text-orange-600 p-2 hover:bg-orange-100 rounded-full">
                      <ShieldOff size={16} />
                    </button>
                  )}
                  <button onClick={() => onDelete(profile.id)} title="Delete User" className="text-red-600 p-2 hover:bg-red-100 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}