import { useState } from "react";
import { Button } from "@/components/ui/button";
import StandardAccounts from "@/components/accounts/StandardAccounts";
import UnixAccounts from "@/components/accounts/UnixAccounts";

type TabType = "standard" | "unix";

export default function AccountManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("standard");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between py-6 md:space-x-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Account Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage standard and Unix accounts in your organization</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button className="bg-msblue-primary hover:bg-msblue-secondary text-white">
            <i className="ri-add-line mr-1"></i> Add Account
          </Button>
          <Button variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
            <i className="ri-refresh-line mr-1"></i> Refresh
          </Button>
        </div>
      </div>
      
      {/* Account Type Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex -mb-px">
          <button 
            className={`px-4 py-3 border-b-2 text-sm font-medium ${
              activeTab === "standard" 
                ? "border-msblue-primary text-msblue-primary" 
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
            onClick={() => setActiveTab("standard")}
          >
            Standard Accounts
          </button>
          <button 
            className={`px-4 py-3 border-b-2 text-sm font-medium ${
              activeTab === "unix" 
                ? "border-msblue-primary text-msblue-primary" 
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
            onClick={() => setActiveTab("unix")}
          >
            Unix Accounts
          </button>
        </div>
      </div>
      
      {/* Account Tab Content */}
      {activeTab === "standard" ? (
        <StandardAccounts />
      ) : (
        <UnixAccounts />
      )}
    </div>
  );
}
