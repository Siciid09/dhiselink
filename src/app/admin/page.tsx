// File Path: app/admin/page.tsx

"use client"; // Recharts requires client-side rendering

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Building, Briefcase, Lightbulb } from 'lucide-react';
import React from 'react'; // Ensure React is imported for JSX

// Sample data - in a real application, you would fetch this from a secure API endpoint.
const analyticsData = {
    totalUsers: 1250,
    totalOrganizations: 150,
    totalJobs: 620,
    totalIdeas: 85,
    userSignups: [
        { name: 'Jan', users: 65 }, { name: 'Feb', users: 59 }, { name: 'Mar', users: 80 },
        { name: 'Apr', users: 81 }, { name: 'May', users: 56 }, { name: 'Jun', users: 55 },
    ],
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            {icon}
        </div>
    </div>
);

// The main component for the admin dashboard page.
// This MUST be the default export.
export default function AdminDashboardPage() {
    return (
        <div className="space-y-8 py-8">
            <h1 className="text-3xl font-bold">Admin Overview</h1>
            
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={analyticsData.totalUsers.toLocaleString()} icon={<Users />} />
                <StatCard title="Total Organizations" value={analyticsData.totalOrganizations.toLocaleString()} icon={<Building />} />
                <StatCard title="Active Jobs" value={analyticsData.totalJobs.toLocaleString()} icon={<Briefcase />} />
                <StatCard title="Submitted Ideas" value={analyticsData.totalIdeas.toLocaleString()} icon={<Lightbulb />} />
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                 <h2 className="text-xl font-semibold mb-4">New User Signups (Last 6 Months)</h2>
                 <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={analyticsData.userSignups}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip wrapperClassName="!bg-white !border-gray-300 rounded-lg shadow-lg" />
                            <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>
    );
}
