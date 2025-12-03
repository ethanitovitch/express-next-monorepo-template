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
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Content</h3>
          <p className="text-sm text-muted-foreground">Manage your content and posts</p>
        </div>
        
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground">View your performance metrics</p>
        </div>
        
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your preferences</p>
        </div>
      </div>
    </Page>
  );
}
