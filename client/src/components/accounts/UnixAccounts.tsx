import { useState } from "react";
import { useFetchWithMsal } from "@/hooks/useFetchWithMsal";
import { api } from "@/lib/api";
import { protectedResources } from "@/lib/msal";
import { 
  PaginatedResponse, 
  UnixAccount, 
  AccountFilterOptions
} from "@/types/account";
import AccountFilter from "./AccountFilter";
import AccountCard from "./AccountCard";
import Pagination from "./Pagination";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { ErrorNotification } from "@/components/ui/ErrorNotification";

export default function UnixAccounts() {
  // Filter & pagination state
  const [filterOptions, setFilterOptions] = useState<AccountFilterOptions>({
    search: "",
    status: "",
    department: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Build API request
  const request = api.getUnixAccounts({
    page: currentPage,
    pageSize,
    search: filterOptions.search,
    status: filterOptions.status,
    department: filterOptions.department
  });
  
  // Fetch data with MSAL authentication
  const { 
    data, 
    error, 
    loading, 
    refetch 
  } = useFetchWithMsal<PaginatedResponse<UnixAccount>>(
    request, 
    { 
      dependencies: [currentPage, filterOptions],
      scopes: protectedResources.PWMAPI.scopes
    }
  );

  // Handler for filter changes
  const handleFilterChange = (newFilters: AccountFilterOptions) => {
    setFilterOptions(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Account actions
  const handleEditAccount = (id: string) => {
    console.log("Edit unix account:", id);
    // Implement edit functionality
  };

  const handleResetPassword = (id: string) => {
    console.log("Reset password for unix account:", id);
    // Implement password reset
  };

  const handleManageAccess = (id: string) => {
    console.log("Manage access for unix account:", id);
    // Implement access management
  };

  const handleLockUnlock = async (id: string, isLocked: boolean) => {
    try {
      if (isLocked) {
        const unlockRequest = api.unlockAccount(id);
        const { error } = await useFetchWithMsal(unlockRequest, { 
          scopes: protectedResources.PWMAPI.scopes 
        });
        if (error) throw error;
      } else {
        const lockRequest = api.lockAccount(id);
        const { error } = await useFetchWithMsal(lockRequest, { 
          scopes: protectedResources.PWMAPI.scopes 
        });
        if (error) throw error;
      }
      refetch();
    } catch (error) {
      console.error("Error toggling account lock status:", error);
    }
  };

  // Render Unix-specific details 
  const renderUnixDetails = (account: UnixAccount) => {
    return (
      <>
        <div>
          <p className="text-xs font-medium uppercase text-neutral-500">Username</p>
          <p className="mt-1 text-sm text-neutral-700">{account.username}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-neutral-500">Shell</p>
          <p className="mt-1 text-sm text-neutral-700">{account.shell}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-neutral-500">Groups</p>
          <p className="mt-1 text-sm text-neutral-700">
            {account.groups.slice(0, 3).join(", ")}
            {account.groups.length > 3 && ` +${account.groups.length - 3} more`}
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Account Search and Filter */}
      <AccountFilter 
        filterOptions={filterOptions} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Loading State */}
      {loading && <LoadingOverlay message="Loading Unix accounts..." />}
      
      {/* Error State */}
      {error && (
        <ErrorNotification 
          title="Error Fetching Unix Accounts" 
          message={error.message} 
          onRetry={refetch} 
        />
      )}
      
      {/* Account Cards */}
      {data && data.items.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.items.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={() => handleEditAccount(account.id)}
                onResetPassword={() => handleResetPassword(account.id)}
                onManageAccess={() => handleManageAccess(account.id)}
                onLockUnlock={() => handleLockUnlock(account.id, account.status === "Locked")}
                renderCustomDetails={() => renderUnixDetails(account)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {data.totalCount > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              onPageChange={setCurrentPage}
              totalItems={data.totalCount}
              pageSize={pageSize}
            />
          )}
        </>
      ) : (
        !loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100 mb-4">
              <i className="ri-terminal-line text-xl text-neutral-500"></i>
            </div>
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No Unix accounts found</h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              No Unix accounts match your current filter criteria. Try adjusting your filters or add a new Unix account.
            </p>
          </div>
        )
      )}
    </div>
  );
}
