import { useState } from 'react';
import { useAccount, useMsal } from '@azure/msal-react';
import { logout } from '../lib/msal';

export function UserProfileMenu() {
  const { instance } = useMsal();
  const account = useAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Extract initials from account name
  const getInitials = () => {
    if (account?.name) {
      return account.name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return account?.username?.charAt(0).toUpperCase() || 'U';
  };

  // Handle click outside to close menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center cursor-pointer"
        onClick={toggleMenu}
      >
        <div className="w-9 h-9 rounded-full bg-msblue-light flex items-center justify-center text-white font-medium">
          {getInitials()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-neutral-700">
            {account?.name || account?.username || 'User'}
          </p>
          <p className="text-xs text-neutral-400">
            {account?.username || account?.localAccountId || ''}
          </p>
        </div>
        <i className="ri-arrow-down-s-line ml-auto text-neutral-400"></i>
      </div>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeMenu}
          ></div>
          <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-md shadow-lg border border-neutral-200 z-20">
            <div className="p-2 border-b border-neutral-100">
              <p className="text-sm font-medium text-neutral-800">
                {account?.name || account?.username || 'User'}
              </p>
              <p className="text-xs text-neutral-500">{account?.username || ''}</p>
            </div>
            <div className="p-1">
              <button 
                className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md"
                onClick={handleLogout}
              >
                <i className="ri-logout-box-line mr-2"></i>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
