import { AccountType, StandardAccount, UnixAccount, AccountFilterOptions } from "../types/account";
import { RequestConfig } from "../hooks/useFetchWithMsal";

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

// Helper function to create query parameter string
const createQueryParams = (params?: GetAccountsParams): string => {
  if (!params) return '';
  
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);
  if (params.department) queryParams.append("department", params.department);
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// API functions (these will be used with the useFetchWithMsal hook)
export const api = {
  // Standard accounts
  getStandardAccounts: (params?: GetAccountsParams): RequestConfig => {
    const queryString = createQueryParams(params);
    return { 
      url: `${endpoints.standardAccounts}${queryString}` 
    };
  },
  
  // Unix accounts
  getUnixAccounts: (params?: GetAccountsParams): RequestConfig => {
    const queryString = createQueryParams(params);
    return { 
      url: `${endpoints.unixAccounts}${queryString}` 
    };
  },
  
  // Get account by ID
  getAccount: (id: string): RequestConfig => {
    return { 
      url: endpoints.account(id) 
    };
  },
  
  // Reset password
  resetPassword: (id: string): RequestConfig => {
    return {
      url: endpoints.resetPassword(id),
      method: "POST"
    };
  },
  
  // Lock account
  lockAccount: (id: string): RequestConfig => {
    return {
      url: endpoints.lockAccount(id),
      method: "POST"
    };
  },
  
  // Unlock account
  unlockAccount: (id: string): RequestConfig => {
    return {
      url: endpoints.unlockAccount(id),
      method: "POST"
    };
  },
  
  // Get departments for dropdown
  getDepartments: (): RequestConfig => {
    return { 
      url: endpoints.departments 
    };
  },
  
  // Get account types for dropdown
  getAccountTypes: (): RequestConfig => {
    return { 
      url: endpoints.accountTypes 
    };
  }
};
