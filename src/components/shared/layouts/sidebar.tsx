"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { 
  HomeIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  ClipboardDocumentCheckIcon,
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Navigation items for each user role
const navigationItems: Record<UserRole, Array<{
  name: string;
  href: string;
  icon: React.ElementType;
}>> = {
  'agency-owner': [
    { name: 'Overview', href: '/agency-owner/dashboard', icon: HomeIcon },
    { name: 'Team', href: '/agency-owner/team', icon: UsersIcon },
    { name: 'Clients', href: '/agency-owner/clients', icon: UsersIcon },
    { name: 'Projects', href: '/agency-owner/projects', icon: BriefcaseIcon },
    { name: 'Tasks', href: '/agency-owner/tasks', icon: ClipboardDocumentCheckIcon },
    { name: 'Documents', href: '/agency-owner/documents', icon: DocumentIcon },
    { name: 'Invoices', href: '/agency-owner/invoices', icon: DocumentTextIcon },
    { name: 'Messages', href: '/agency-owner/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Settings', href: '/agency-owner/settings', icon: Cog6ToothIcon },
  ],
  'agency-member': [
    { name: 'Overview', href: '/agency-member/dashboard', icon: HomeIcon },
    { name: 'Team', href: '/agency-member/team', icon: UsersIcon },
    { name: 'Clients', href: '/agency-member/clients', icon: UsersIcon },
    { name: 'Projects', href: '/agency-member/projects', icon: BriefcaseIcon },
    { name: 'Tasks', href: '/agency-member/tasks', icon: ClipboardDocumentCheckIcon },
    { name: 'Documents', href: '/agency-member/documents', icon: DocumentIcon },
    { name: 'Messages', href: '/agency-member/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Settings', href: '/agency-member/settings', icon: Cog6ToothIcon },
  ],
  'freelancer': [
    { name: 'Overview', href: '/freelancer/dashboard', icon: HomeIcon },
    { name: 'Clients', href: '/freelancer/clients', icon: UsersIcon },
    { name: 'Projects', href: '/freelancer/projects', icon: BriefcaseIcon },
    { name: 'Tasks', href: '/freelancer/tasks', icon: ClipboardDocumentCheckIcon },
    { name: 'Documents', href: '/freelancer/documents', icon: DocumentIcon },
    { name: 'Invoices', href: '/freelancer/invoices', icon: DocumentTextIcon },
    { name: 'Messages', href: '/freelancer/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Settings', href: '/freelancer/settings', icon: Cog6ToothIcon },
  ],
  'client': [
    { name: 'Dashboard', href: '/client/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/client/projects', icon: BriefcaseIcon },
    { name: 'Messages', href: '/client/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Documents', href: '/client/documents', icon: DocumentIcon },
    { name: 'Invoices', href: '/client/billing', icon: CreditCardIcon },
    { name: 'Settings', href: '/client/settings', icon: Cog6ToothIcon },
  ],
};

interface SidebarProps {
  userRole: UserRole;
  userName: string;
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Get navigation items for the current user role
  const navItems = navigationItems[userRole];


  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full"
        >
          {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-[#E0E0E0] transform transition-transform duration-200 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-4 py-6">
          <Image 
            src="/one-client-logo-black.png" 
            alt="OneClient Logo" 
            width={40}
            height={40}
            className="h-auto"
          />
          <span className="ml-3 font-semibold text-xl">OneClient</span>
        </div>

        <div className="px-2 py-1">
          <div className="bg-white rounded-md px-4 py-2 mb-4">
            <div className="text-base">{userName}</div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive 
                    ? 'bg-white text-[#101828]' 
                    : 'text-[#636c7a] hover:bg-muted/50'
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={cn('mr-3 h-5 w-5 flex-shrink-0')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
} 