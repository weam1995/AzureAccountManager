import { Link, useLocation } from "wouter";
import { UserProfileMenu } from "./UserProfileMenu";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  // Navigation links
  const navLinks = [
    { name: "Dashboard", path: "/", icon: "ri-dashboard-line" },
    { name: "Account Management", path: "/account-management", icon: "ri-user-settings-line" },
    { name: "Access Control", path: "/access-control", icon: "ri-shield-user-line" },
    { name: "Resources", path: "/resources", icon: "ri-server-line" },
    { name: "Settings", path: "/settings", icon: "ri-settings-4-line" },
  ];

  // Dynamic classes based on active route
  const getLinkClasses = (path: string) => {
    const isActive = location === path;
    return `flex items-center px-3 py-2.5 text-sm rounded-md ${
      isActive
        ? "bg-msblue-primary text-white"
        : "text-neutral-700 hover:bg-neutral-50"
    }`;
  };

  // Determine sidebar visibility classes
  const sidebarClasses = `
    ${isOpen ? "fixed inset-y-0 left-0 z-50" : "hidden"} 
    md:flex flex-col w-64 bg-white border-r border-neutral-100 shadow-sm
  `;

  // Backdrop for mobile sidebar
  const backdropClasses = `
    ${isOpen ? "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" : "hidden"}
  `;

  return (
    <>
      {/* Backdrop for mobile */}
      <div className={backdropClasses} onClick={onClose}></div>
      
      <aside className={sidebarClasses}>
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-center">
            <svg 
              className="w-8 h-8 text-msblue-primary mr-3" 
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
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link href={link.path}>
                  <a className={getLinkClasses(link.path)}>
                    <i className={`${link.icon} text-lg mr-3`}></i>
                    <span>{link.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="border-t border-neutral-100 p-4">
          <UserProfileMenu />
        </div>
      </aside>
    </>
  );
}
