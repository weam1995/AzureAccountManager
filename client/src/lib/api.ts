import { AccountType, StandardAccount, UnixAccount, AccountFilterOptions } from "../types/account";

// Base URL for ASP.NET Core C# API endpoints
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// API endpoints
export const endpoints = {
  standardAccounts: `${baseUrl}/accounts/standard`,
  unixAccounts: `${baseUrl}/accounts/unix`,
  account: (id: string) => `${baseUrl}/accounts/${id}`,
  resetPassword: (id: string) => `${baseUrl}/accounts/${id}/reset-password`,
  lockAccount: (id: string) => `${baseUrl}/accounts/${id}/lock`,
  unlockAccount: (id: string) => `${baseUrl}/accounts/${id}/unlock`,
  departments: `${baseUrl}/departments`,
  accountTypes: `${baseUrl}/account-types`
};

// API types for requests
export interface GetAccountsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  department?: string;
  type?: AccountType;
}

// API functions (these will be used with the useFetchWithMsal hook)
export const api = {
  // Standard accounts
  getStandardAccounts: (params?: GetAccountsParams) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.department) queryParams.append("department", params.department);
    }
    
    const url = `${endpoints.standardAccounts}?${queryParams.toString()}`;
    return { url };
  },
  
  // Unix accounts
  getUnixAccounts: (params?: GetAccountsParams) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.department) queryParams.append("department", params.department);
    }
    
    const url = `${endpoints.unixAccounts}?${queryParams.toString()}`;
    return { url };
  },
  
  // Get account by ID
  getAccount: (id: string) => {
    return { url: endpoints.account(id) };
  },
  
  // Reset password
  resetPassword: (id: string) => {
    return {
      url: endpoints.resetPassword(id),
      method: "POST"
    };
  },
  
  // Lock account
  lockAccount: (id: string) => {
    return {
      url: endpoints.lockAccount(id),
      method: "POST"
    };
  },
  
  // Unlock account
  unlockAccount: (id: string) => {
    return {
      url: endpoints.unlockAccount(id),
      method: "POST"
    };
  },
  
  // Get departments for dropdown
  getDepartments: () => {
    return { url: endpoints.departments };
  },
  
  // Get account types for dropdown
  getAccountTypes: () => {
    return { url: endpoints.accountTypes };
  }
};
