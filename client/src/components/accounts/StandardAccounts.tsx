import { useState, useEffect } from "react";
import { useFetchWithMsal } from "@/hooks/useFetchWithMsal";
import { api } from "@/lib/api";
import { 
  PaginatedResponse, 
  StandardAccount, 
  AccountFilterOptions
} from "@/types/account";
import AccountFilter from "./AccountFilter";
import AccountCard from "./AccountCard";
import Pagination from "./Pagination";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { ErrorNotification } from "@/components/ui/ErrorNotification";

export default function StandardAccounts() {
  // Filter & pagination state
  const [filterOptions, setFilterOptions] = useState<AccountFilterOptions>({
    search: "",
    status: "",
    department: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Build API request
  const request = api.getStandardAccounts({
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
  } = useFetchWithMsal<PaginatedResponse<StandardAccount>>(
    request, 
    { 
      dependencies: [currentPage, filterOptions] 
    }
  );

  // Handler for filter changes
  const handleFilterChange = (newFilters: AccountFilterOptions) => {
    setFilterOptions(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Account actions
  const handleEditAccount = (id: string) => {
    console.log("Edit account:", id);
    // Implement edit functionality
  };

  const handleResetPassword = (id: string) => {
    console.log("Reset password for account:", id);
    // Implement password reset
  };

  const handleManageAccess = (id: string) => {
    console.log("Manage access for account:", id);
    // Implement access management
  };

  // Create specialized hooks for account locking/unlocking
  const { refetch: executeUnlock } = useFetchWithMsal(
    null, // Start with null config so it doesn't execute immediately
    { immediate: false }
  );
  
  const { refetch: executeLock } = useFetchWithMsal(
    null, // Start with null config so it doesn't execute immediately
    { immediate: false }
  );

  const handleLockUnlock = async (id: string, isLocked: boolean) => {
    try {
      if (isLocked) {
        // Pass the request config to refetch
        await executeUnlock(api.unlockAccount(id));
      } else {
        // Pass the request config to refetch
        await executeLock(api.lockAccount(id));
      }
      // Refresh the accounts list
      refetch();
    } catch (error) {
      console.error("Error toggling account lock status:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Account Search and Filter */}
      <AccountFilter 
        filterOptions={filterOptions} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Loading State */}
      {loading && <LoadingOverlay message="Loading accounts..." />}
      
      {/* Error State */}
      {error && (
        <ErrorNotification 
          title="Error Fetching Accounts" 
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
              <i className="ri-user-search-line text-xl text-neutral-500"></i>
            </div>
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No accounts found</h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              No accounts match your current filter criteria. Try adjusting your filters or add a new account.
            </p>
          </div>
        )
      )}
    </div>
  );
}
