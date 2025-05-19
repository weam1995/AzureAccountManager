import { useAccount } from "@azure/msal-react";

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  const account = useAccount();
  
  return (
    <div className="fixed inset-x-0 top-0 md:hidden bg-white border-b border-neutral-100 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            className="text-neutral-600 mr-3"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
          <svg 
            className="w-8 h-8 text-msblue-primary mr-2" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.5 12.5V0H0V11.5H11.5V12.5Z" />
            <path d="M24 11.5V0H12.5V11.5H24Z" />
            <path d="M11.5 24V12.5H0V24H11.5Z" />
            <path d="M24 24V12.5H12.5V24H24Z" />
          </svg>
          <h1 className="text-lg font-semibold text-neutral-700">Account Portal</h1>
        </div>
        <div>
          {account ? (
            <div className="h-8 w-8 rounded-full bg-msblue-light flex items-center justify-center text-white font-medium">
              {account.name?.charAt(0) || account.username?.charAt(0) || "U"}
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-neutral-200"></div>
          )}
        </div>
      </div>
    </div>
  );
}
