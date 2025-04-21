"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { List, MessageSquare, FileText, Package, DollarSign, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ClientProject {
  id: string;
  title: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'On Hold';
  dueDate: string;
  teamMembers: string[];
  progress: number;
  description?: string;
  startDate?: string;
  tasks?: { id: string; title: string; completed: boolean }[];
  documents?: { id: string; name: string; url: string; size: string }[];
}

const clientProjects: ClientProject[] = [
  {
    id: "p1", title: "E-commerce Platform", status: "In Progress", dueDate: "2024-09-15", 
    teamMembers: ["Alice Smith", "Bob Johnson", "Charlie Brown"], progress: 75,
    description: "Full-featured e-commerce platform with custom checkout.", startDate: "2024-06-01",
    tasks: [{id:"t1", title:"Setup project", completed: true}, {id:"t2", title:"Design homepage", completed: true}, {id:"t3", title:"Develop cart", completed: false}],
    documents: [{id: "d1", name: "Project Brief v1.pdf", url: "#", size: "1.2MB"}, {id: "d2", name: "Wireframes.fig", url: "#", size: "3.5MB"}]
  },
  {
    id: "p2", title: "Mobile App Design", status: "Planned", dueDate: "2024-11-01", 
    teamMembers: ["David Williams", "Eve Davis"], progress: 30,
    description: "UI/UX design phase for a new iOS and Android application.", startDate: "2024-08-01",
    tasks: [],
    documents: []
  },
  {
    id: "p3", title: "Brand Identity Refresh", status: "Completed", dueDate: "2024-06-30", 
    teamMembers: [],
     progress: 100,
    description: "Complete overhaul of brand assets and guidelines.", startDate: "2024-04-15",
    tasks: [{id:"t7", title:"Logo concepts", completed: true}, {id:"t8", title:"Style guide", completed: true}, {id:"t9", title:"Asset delivery", completed: true}],
    documents: [{id: "d3", name: "Final Logo Pack.zip", url: "#", size: "15MB"}, {id: "d4", name: "Brand Guidelines.pdf", url: "#", size: "4.1MB"}]
  },
];

const recentActivity = [
  { id: "a1", type: "task_completed", description: "Task 'User Authentication' marked complete.", project: "E-commerce Platform", projectId: "p1", timestamp: "2 hours ago" },
  { id: "a2", type: "file_uploaded", description: "Document 'Initial Wireframes v2' uploaded.", project: "Mobile App Design", projectId: "p2", timestamp: "1 day ago" },
  { id: "a3", type: "message_received", description: "New message from John Doe.", project: "E-commerce Platform", projectId: "p1", timestamp: "2 days ago" },
  { id: "a4", type: "project_status", description: "Project status changed to In Progress.", project: "Mobile App Design", projectId: "p2", timestamp: "3 days ago" },
];

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "On Hold":
        return "bg-amber-100 text-amber-800";
      case "Planned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={`${getStatusStyles()} font-medium hover:brightness-95`}>
      {status}
    </Badge>
  );
};

interface TeamAvatarsProps {
  members: string[];
}

const TeamAvatars = ({ members }: TeamAvatarsProps) => {
  const getAvatarUrl = (member: string) => {
    return `https://api.dicebear.com/7.x/micah/svg?seed=${member.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="flex -space-x-3">
      {members.slice(0, 3).map((member) => (
        <Avatar key={member} className="h-10 w-10 border-2 border-white">
          <AvatarImage src={getAvatarUrl(member)} alt={member} />
          <AvatarFallback>{member.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      {members.length > 3 && (
        <Avatar className="h-10 w-10 border-2 border-white">
           <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              +{members.length - 3}
           </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default function ClientDashboardPage() {
  
  const router = useRouter();

  const clientActiveProjectsCount = clientProjects.filter(p => p.status === 'In Progress' || p.status === 'Planned').length; 
  const clientUnreadMessages = 3;
  const clientPendingInvoices = 1;
  const clientFilesShared = recentActivity.filter(a => a.type === 'file_uploaded').length;

  const handleRowClick = (projectId: string) => {
    router.push(`/client/projects?projectId=${projectId}`);
  };

  return (
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
              <div className="flex items-center justify-between">
            <div>
                  <p className="text-sm text-[#707070]">Active Projects</p>
                  <p className="text-2xl font-medium text-[#333333]">{clientActiveProjectsCount}</p>
                </div>
                <div className="bg-[#F5F5F5] p-3 rounded-full">
                  <Package className="w-6 h-6 text-[#333333]" />
            </div>
            </div>
              <div className="mt-2 flex items-center text-xs text-[#707070]">
                <Link href="/client/projects" className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 hover:bg-blue-100">
                  View all projects
                </Link>
            </div>
            </div>
        
            <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
              <div className="flex items-center justify-between">
            <div>
                  <p className="text-sm text-[#707070]">Unread Messages</p>
                  <p className="text-2xl font-medium text-[#333333]">{clientUnreadMessages}</p>
            </div>
                <div className="bg-[#F5F5F5] p-3 rounded-full">
                  <MessageSquare className="w-6 h-6 text-[#333333]" />
            </div>
            </div>
              <div className="mt-2 flex items-center text-xs text-[#707070]">
                <Link href="/client/messages" className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100 hover:bg-purple-100">
                  Go to inbox
                 </Link>
            </div>
      </div>

             <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
                    <div className="flex items-center justify-between">
                      <div>
                  <p className="text-sm text-[#707070]">Pending Invoices</p>
                  <p className="text-2xl font-medium text-[#333333]">{clientPendingInvoices}</p>
                      </div>
                <div className="bg-[#F5F5F5] p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-[#333333]" />
                      </div>
                    </div>
              <div className="mt-2 flex items-center text-xs text-[#707070]">
                <Link href="/client/billing" className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100 hover:bg-amber-100">
                  View billing
                 </Link>
                    </div>
                  </div>
          
            <div className="bg-white p-4 rounded-lg border border-[#E0E0E0]">
              <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm text-[#707070]">Files Shared</p>
                  <p className="text-2xl font-medium text-[#333333]">{clientFilesShared}</p>
                </div>
                <div className="bg-[#F5F5F5] p-3 rounded-full">
                  <FileText className="w-6 h-6 text-[#333333]" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-[#707070]">
                <Link href="/client/documents" className="bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 hover:bg-green-100">
                  View documents
                 </Link>
              </div>
            </div>
          </div>

        <h2 className="text-xl font-semibold">Project Overview</h2>
        <div className="bg-white overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </TableHead>
                <TableHead className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
            {clientProjects.map((project) => (
                <TableRow 
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(project.id)}
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <TeamAvatars members={project.teamMembers} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <ProgressBar percentage={project.progress} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <Button variant="ghost" size="icon" tabIndex={-1} aria-hidden="true"> 
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        <span className="sr-only">View Details (navigates)</span>
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
              {clientProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
            </div>
            
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="bg-white overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-4 py-3 w-[50px] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   <span className="sr-only">Type</span>
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-gray-50">
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                         {activity.type === 'task_completed' && <List className="h-4 w-4 text-green-600" />}
                         {activity.type === 'file_uploaded' && <FileText className="h-4 w-4 text-blue-600" />}
                         {activity.type === 'message_received' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                         {activity.type === 'project_status' && <Package className="h-4 w-4 text-orange-600" />}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {activity.description}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {activity.project ? (
                          <Link href={`/client/projects?projectId=${activity.projectId}`} className="text-sm text-blue-600 hover:underline font-medium">
                             {activity.project}
                           </Link>
                      ) : (
                         <span className="text-sm text-gray-500">-</span> 
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.timestamp}
                    </TableCell>
                  </TableRow>
                  ))
                ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No recent activity.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
              </div>

      </div>
  )
} 