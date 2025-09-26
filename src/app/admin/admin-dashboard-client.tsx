"use client";

import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { User, Briefcase, Building, Lightbulb, Landmark, Settings } from "lucide-react";

// Imports for the real tab components
import JobsTab from './components/JobsTab';
import IdeasTab from './components/IdeasTab';
import HeritageSitesTab from './components/HeritageSitesTab';
import SettingsTab from './components/SettingsTab';
import UserManagementTab from "./components/UserManagementTab";

export default function AdminDashboardClient({ 
    initialProfiles, 
    initialJobs, 
    initialIdeas, 
    initialHeritageSites,
    initialPartners,
    initialTestimonials,
    initialStats 
}: { 
    initialProfiles: any[], 
    initialJobs: any[], 
    initialIdeas: any[],
    initialHeritageSites: any[],
    initialPartners: any[],
    initialTestimonials: any[],
    initialStats: any 
}) {
  const tabConfig = [
    { name: "Overview", icon: Building },
    { name: "User Management", icon: User },
    { name: "Jobs", icon: Briefcase },
    { name: "Ideas", icon: Lightbulb },
    { name: "Heritage Sites", icon: Landmark },
    { name: "Site Settings", icon: Settings },
  ];

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-slate-200 p-1 mb-6">
        {tabConfig.map((tab) => (
          <Tab key={tab.name} as={Fragment}>
            {({ selected }) => (
              <button
                className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-sm font-medium leading-5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 ${
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "bg-transparent text-slate-600 hover:bg-white/[0.6] hover:text-slate-900"
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>

      <Tab.Panels>
        {/* Overview Panel */}
        <Tab.Panel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border"><User className="text-blue-500 mb-2" /> <h3 className="font-bold text-2xl">{initialStats.userCount}</h3> <p>Total Users</p></div>
            <div className="bg-white p-6 rounded-xl border"><Building className="text-green-500 mb-2" /> <h3 className="font-bold text-2xl">{initialStats.orgCount}</h3> <p>Total Organizations</p></div>
            <div className="bg-white p-6 rounded-xl border"><Briefcase className="text-purple-500 mb-2" /> <h3 className="font-bold text-2xl">{initialStats.jobCount}</h3> <p>Total Jobs Posted</p></div>
          </div>
        </Tab.Panel>
        
        {/* User Management Panel */}
        <Tab.Panel>
            <UserManagementTab initialProfiles={initialProfiles} />
        </Tab.Panel>

        {/* Jobs Panel */}
        <Tab.Panel>
            <JobsTab initialJobs={initialJobs} />
        </Tab.Panel>

        {/* Ideas Panel */}
        <Tab.Panel>
            <IdeasTab initialIdeas={initialIdeas} />
        </Tab.Panel>

        {/* Heritage Sites Panel */}
        <Tab.Panel>
            <HeritageSitesTab initialHeritageSites={initialHeritageSites} />
        </Tab.Panel>

        {/* Site Settings Panel */}
        <Tab.Panel>
            <SettingsTab initialPartners={initialPartners} initialTestimonials={initialTestimonials} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}