import { useState, useEffect } from "react";
import { useFetchWithMsal } from "@/hooks/useFetchWithMsal";
import { api } from "@/lib/api";
import { AccountFilterOptions, Department } from "@/types/account";

interface AccountFilterProps {
  filterOptions: AccountFilterOptions;
  onFilterChange: (newFilters: AccountFilterOptions) => void;
}

export default function AccountFilter({ 
  filterOptions, 
  onFilterChange 
}: AccountFilterProps) {
  // Local state for form inputs
  const [search, setSearch] = useState(filterOptions.search);
  const [status, setStatus] = useState(filterOptions.status);
  const [department, setDepartment] = useState(filterOptions.department);
  
  // Fetch departments for dropdown
  const { data: departments } = useFetchWithMsal<Department[]>(api.getDepartments());
  
  // Apply filters on input change with debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== filterOptions.search || 
          status !== filterOptions.status || 
          department !== filterOptions.department) {
        onFilterChange({
          search,
          status,
          department
        });
      }
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [search, status, department]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100 mb-6">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="ri-search-line text-neutral-400"></i>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-msblue-primary focus:border-msblue-primary" 
            placeholder="Search accounts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <select 
            className="block w-full pl-3 pr-8 py-2 border border-neutral-300 rounded-md text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-msblue-primary focus:border-msblue-primary"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Locked">Locked</option>
            <option value="Pending">Pending</option>
          </select>
          
          <select 
            className="block w-full pl-3 pr-8 py-2 border border-neutral-300 rounded-md text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-msblue-primary focus:border-msblue-primary"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
