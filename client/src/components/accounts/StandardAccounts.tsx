import { useEffect } from "react";
import { useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { api } from "@/lib/api";
import { protectedResources } from "@/lib/msal";
import { 
  StandardAccount, 
  AccountFilterOptions
} from "@/types/account";
import AccountFilter from "./AccountFilter";
import AccountCard from "./AccountCard";
import Pagination from "./Pagination";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { ErrorNotification } from "@/components/ui/ErrorNotification";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchStandardAccountsThunk, 
  setCurrentPage, 
  setFilterOptions 
} from "@/store/accountsSlice";

export default function StandardAccounts() {
  const dispatch = useAppDispatch();
  
  // Get state from Redux store
  const { 
    data, 
    loading, 
    error 
  } = useAppSelector(state => state.accounts.standardAccounts);
  const currentPage = useAppSelector(state => state.accounts.currentPage);
  const pageSize = useAppSelector(state => state.accounts.pageSize);
  const filterOptions = useAppSelector(state => state.accounts.filterOptions);

  // Get access token using MSAL
  const { result, acquireToken } = useMsalAuthentication(
    InteractionType.Silent,
    { scopes: protectedResources.PWMAPI.scopes }
  );

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    const fetchData = async () => {
      // Make sure we have a token
      let accessToken: string;
      
      if (!result?.accessToken) {
        const authResult = await acquireToken();
        if (!authResult?.accessToken) {
          console.error("Failed to acquire token");
          return;
        }
        accessToken = authResult.accessToken;
      } else {
        accessToken = result.accessToken;
      }

      // Dispatch the thunk to fetch data
      dispatch(fetchStandardAccountsThunk({
        page: currentPage,
        pageSize,
        filterOptions,
        accessToken
      }));
    };

    fetchData();
  }, [dispatch, currentPage, pageSize, filterOptions, result, acquireToken]);

  // Handler for filter changes
  const handleFilterChange = (newFilters: AccountFilterOptions) => {
    dispatch(setFilterOptions(newFilters));
    dispatch(setCurrentPage(1)); // Reset to first page when filters change
  };

  // Handler for page changes
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Function to retry data fetching
  const handleRetry = async () => {
    if (result?.accessToken) {
      dispatch(fetchStandardAccountsThunk({
        page: currentPage,
        pageSize,
        filterOptions,
        accessToken: result.accessToken
      }));
    } else {
      const authResult = await acquireToken();
      if (authResult?.accessToken) {
        dispatch(fetchStandardAccountsThunk({
          page: currentPage,
          pageSize,
          filterOptions,
          accessToken: authResult.accessToken
        }));
      }
    }
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

  const handleLockUnlock = async (id: string, isLocked: boolean) => {
    try {
      let accessToken: string;
      
      if (!result?.accessToken) {
        const authResult = await acquireToken();
        if (!authResult?.accessToken) {
          throw new Error("Failed to acquire access token");
        }
        accessToken = authResult.accessToken;
      } else {
        accessToken = result.accessToken;
      }

      if (isLocked) {
        const unlockRequest = api.unlockAccount(id);
        await fetch(unlockRequest.url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
      } else {
        const lockRequest = api.lockAccount(id);
        await fetch(lockRequest.url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
      }
      
      // Refresh data after lock/unlock
      handleRetry();
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
          message={error} 
          onRetry={handleRetry} 
        />
      )}
      
      {/* Account Cards */}
      {data && data.items.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.items.map((account: StandardAccount) => (
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
              onPageChange={handlePageChange}
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
