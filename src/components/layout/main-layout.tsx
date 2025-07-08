'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
        </AnimatePresence>
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "md:ltr:ml-64 md:rtl:mr-64", // Adjust margin based on language direction
          "pt-4",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
} 