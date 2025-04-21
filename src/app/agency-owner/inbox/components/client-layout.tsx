"use client";

import { Sidebar } from '@/components/shared/layouts/sidebar';
import { cn } from '@/lib/utils';

interface ClientLayoutProps {
  children: React.ReactNode;
  userName: string;
}

export function ClientLayout({ children, userName }: ClientLayoutProps) {
  return (
    <div className="h-screen flex bg-[#E0E0E0] overflow-hidden">
      <Sidebar userRole="agency-owner" userName={userName} />
      
      {/* Main content area without the header */}
      <div className={cn("flex-1 p-2", "md:ml-64")}>
        <div className="rounded-lg bg-[#EFEFEF] border border-[#D8D8D8] h-full flex flex-col overflow-hidden">
          {/* Main content - no header */}
          <main className="flex-1 overflow-auto scrollbar-hide">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 