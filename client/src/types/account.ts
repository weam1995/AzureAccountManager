// Common definitions for account management

// Account types
export enum AccountType {
  Standard = "Standard",
  Administrator = "Administrator",
  ServiceAccount = "ServiceAccount",
  ReadOnly = "ReadOnly"
}

// Account status
export enum AccountStatus {
  Active = "Active",
  Inactive = "Inactive",
  Locked = "Locked",
  Pending = "Pending"
}

// Base account interface
export interface BaseAccount {
  id: string;
  displayName: string;
  email: string;
  department: string;
  status: AccountStatus;
  lastLogin: string;
  accountType: AccountType;
  createdAt: string;
}

// Standard account type
export interface StandardAccount extends BaseAccount {
  jobTitle: string;
  manager?: string;
  phoneNumber?: string;
}

// Unix account type
export interface UnixAccount extends BaseAccount {
  username: string;
  shell: string;
  homeDirectory: string;
  groups: string[];
}

// Filter options for accounts
export interface AccountFilterOptions {
  search: string;
  status: string;
  department: string;
}

// Pagination model for API responses
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

// Department type
export interface Department {
  id: string;
  name: string;
}
