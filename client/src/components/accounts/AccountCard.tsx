import { BaseAccount, AccountStatus } from "@/types/account";
import { Button } from "@/components/ui/button";

interface AccountCardProps {
  account: BaseAccount;
  onEdit: () => void;
  onResetPassword: () => void;
  onManageAccess: () => void;
  onLockUnlock: () => void;
  renderCustomDetails?: () => React.ReactNode;
}

export default function AccountCard({
  account,
  onEdit,
  onResetPassword,
  onManageAccess,
  onLockUnlock,
  renderCustomDetails
}: AccountCardProps) {
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Status badge color
  const getStatusBadgeClass = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.Active:
        return "bg-green-100 text-status-success";
      case AccountStatus.Locked:
        return "bg-red-100 text-status-error";
      case AccountStatus.Inactive:
        return "bg-neutral-100 text-neutral-600";
      case AccountStatus.Pending:
        return "bg-yellow-100 text-status-warning";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100 card-hover">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-neutral-100">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-msblue-light flex items-center justify-center text-white font-medium">
            {getInitials(account.displayName)}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-neutral-800">{account.displayName}</h3>
            <p className="text-sm text-neutral-500">{account.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-3 md:mt-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(account.status)}`}>
            {account.status}
          </span>
          <button className="p-1.5 text-neutral-500 hover:text-neutral-700 rounded-md hover:bg-neutral-50">
            <i className="ri-more-2-fill"></i>
          </button>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderCustomDetails ? (
          renderCustomDetails()
        ) : (
          <>
            <div>
              <p className="text-xs font-medium uppercase text-neutral-500">Department</p>
              <p className="mt-1 text-sm text-neutral-700">{account.department}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-neutral-500">Last Login</p>
              <p className="mt-1 text-sm text-neutral-700">{formatDate(account.lastLogin)}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-neutral-500">Account Type</p>
              <p className="mt-1 text-sm text-neutral-700">{account.accountType}</p>
            </div>
          </>
        )}
      </div>
      
      <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-end space-x-2 rounded-b-lg">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-neutral-300 text-neutral-700 hover:bg-white"
          onClick={onEdit}
        >
          Edit
        </Button>
        
        {account.status === AccountStatus.Locked ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-300 text-status-error hover:bg-white"
            onClick={onLockUnlock}
          >
            Unlock Account
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-neutral-300 text-neutral-700 hover:bg-white"
            onClick={onResetPassword}
          >
            Reset Password
          </Button>
        )}
        
        <Button 
          size="sm" 
          className="bg-msblue-primary hover:bg-msblue-secondary text-white"
          onClick={onManageAccess}
        >
          Manage Access
        </Button>
      </div>
    </div>
  );
}
