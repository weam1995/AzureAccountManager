import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar for desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile header with menu toggle */}
      <MobileHeader onMenuToggle={toggleSidebar} />
      
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pt-0 md:pt-0 pb-6 px-4 md:px-8 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
