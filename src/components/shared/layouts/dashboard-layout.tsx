"use client";

import { UserRole } from '@/types';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  userName: string;
}

export function DashboardLayout({
  children,
  userRole,
  userName,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  // Paths where the header should be hidden
  const agencyOwnerMessagesPath = '/agency-owner/messages';
  const agencyOwnerSettingsPath = '/agency-owner/settings';
  const agencyMemberMessagesPath = '/agency-member/messages'; // Added for agency member
  const clientMessagesPath = '/client/messages'; // Added for client
  const freelancerMessagesPath = '/freelancer/messages'; // Added for freelancer

  // Determine if the header should be shown based on role and path
  const shouldShowHeader = !((
    userRole === 'agency-owner' && 
    (pathname === agencyOwnerMessagesPath || pathname === agencyOwnerSettingsPath)
  ) || (
    userRole === 'agency-member' && 
    pathname === agencyMemberMessagesPath
  ) || (
    userRole === 'client' && 
    pathname === clientMessagesPath
  ) || (
    userRole === 'freelancer' && 
    pathname === freelancerMessagesPath
  ));

  return (
    <div className="h-screen flex bg-[#E0E0E0] overflow-hidden">
      <Sidebar userRole={userRole} userName={userName} />
      
      {/* Main content area */}
      <div className={cn("flex-1 p-2", "md:ml-64")}>
        {/* Main content with header and children */}
        <div className="rounded-lg bg-[#EFEFEF] border border-[#D8D8D8] h-full flex flex-col overflow-hidden">
          {/* Main content */}
          <main className="flex-1 overflow-auto scrollbar-hide">
            {/* Header - now part of scrollable content */}
            {shouldShowHeader && (
              <header className="bg-[#EFEFEF]">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                  <div className="flex-1 flex justify-start">
                    <div className="relative w-[440px] mt-4">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-[#C8C8C8]" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search for projects, clients, tags & tasks"
                        className="block w-full h-10 rounded-full border border-[#C8C8C8] bg-[#FFF] pl-10 pr-4 text-[#616161] focus:ring-0 focus:outline-none placeholder:text-[#a0a0a0]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="relative">
                      <BellIcon className="h-5 w-5" />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                    </Button>
                  </div>
                </div>
              </header>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 