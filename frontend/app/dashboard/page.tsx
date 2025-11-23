"use client";

import { Page } from "@/components/dashboard/Page";

export default function DashboardPage() {

  return (
    <Page 
      title="Dashboard" 
      subtitle="Welcome back!"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Content</h3>
          <p className="text-sm text-gray-600">Manage your content and posts</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-sm text-gray-600">View your performance metrics</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
          <p className="text-sm text-gray-600">Configure your preferences</p>
        </div>
      </div>
    </Page>
  );
}
