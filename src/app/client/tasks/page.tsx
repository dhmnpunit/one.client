"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  MoreHorizontal,
  ClipboardList,
  Inbox
} from "lucide-react";
import Link from 'next/link';
import { mockClients, mockProjects, mockTasks } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Get the first client for demonstration
const clientData = mockClients[0];

// Get projects for this client
const clientProjects = mockProjects.filter(project => 
  project.clientId === clientData.id
);

// Get tasks for client projects
const clientTasks = mockTasks.filter(task => 
  clientProjects.some(project => project.id === task.projectId)
);

// Get project name from id
const getProjectName = (projectId: string) => {
  const project = clientProjects.find(project => project.id === projectId);
  return project ? project.name : 'Unknown Project';
};

export default function ClientTasksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filter and sort tasks
  const filteredTasks = clientTasks
    .filter(task => 
      (statusFilter ? task.status === statusFilter : true) &&
      (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProjectName(task.projectId).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        // Handle potential null values
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        
        return sortDirection === 'asc' 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortBy === 'project') {
        return sortDirection === 'asc'
          ? getProjectName(a.projectId).localeCompare(getProjectName(b.projectId))
          : getProjectName(b.projectId).localeCompare(getProjectName(a.projectId));
      }
      return 0;
    });
  
  // Function to format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'No due date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get days until due
  const getDaysUntilDue = (dueDate: Date | null) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };
  
  // Toggle sort function
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">View tasks for your projects</p>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter ? (
                  <>Filter: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</>
                ) : (
                  <>Filter</>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Tasks list - small screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const daysUntilDue = getDaysUntilDue(task.dueDate);
            const isOverdue = daysUntilDue !== null && daysUntilDue < 0 && task.status !== 'completed';
            
            return (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{task.title}</h3>
                      <StatusBadge status={task.status} />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {getProjectName(task.projectId)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className={cn(
                          "text-muted-foreground",
                          isOverdue && "text-red-500 font-medium"
                        )}>
                          {task.dueDate ? (
                            <>
                              Due {formatDate(task.dueDate)}
                              {isOverdue && ' (Overdue)'}
                            </>
                          ) : (
                            'No due date'
                          )}
                        </span>
                      </div>
                      
                      {task.priority && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Priority</span>
                          <PriorityBadge priority={task.priority} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t p-3 bg-muted/30 flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/client/projects/${task.projectId}`}>
                        View Project
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-2 p-8 text-center">
            <div className="flex flex-col items-center">
              <Inbox className="h-10 w-10 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground">No tasks matching your search criteria.</p>
            </div>
          </Card>
        )}
      </div>
      
      {/* Tasks table - large screens */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] cursor-pointer" onClick={() => toggleSort('title')}>
                  <div className="flex items-center">
                    Task
                    {sortBy === 'title' && (
                      <ArrowUpDown className={cn(
                        "ml-2 h-4 w-4", 
                        sortDirection === 'desc' && "transform rotate-180"
                      )} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('project')}>
                  <div className="flex items-center">
                    Project
                    {sortBy === 'project' && (
                      <ArrowUpDown className={cn(
                        "ml-2 h-4 w-4", 
                        sortDirection === 'desc' && "transform rotate-180"
                      )} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('status')}>
                  <div className="flex items-center">
                    Status
                    {sortBy === 'status' && (
                      <ArrowUpDown className={cn(
                        "ml-2 h-4 w-4", 
                        sortDirection === 'desc' && "transform rotate-180"
                      )} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('dueDate')}>
                  <div className="flex items-center">
                    Due Date
                    {sortBy === 'dueDate' && (
                      <ArrowUpDown className={cn(
                        "ml-2 h-4 w-4", 
                        sortDirection === 'desc' && "transform rotate-180"
                      )} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => {
                  const daysUntilDue = getDaysUntilDue(task.dueDate);
                  const isOverdue = daysUntilDue !== null && daysUntilDue < 0 && task.status !== 'completed';
                  
                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getProjectName(task.projectId)}</TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                      <TableCell>
                        {task.priority ? (
                          <PriorityBadge priority={task.priority} />
                        ) : (
                          <span className="text-muted-foreground">Normal</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          isOverdue && "text-red-500 font-medium"
                        )}>
                          {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                          {isOverdue && (
                            <div className="flex items-center text-xs mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              <span>Overdue</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/client/projects/${task.projectId}`}>
                              View Project
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="ml-2">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/client/messages?task=${task.id}`}>
                                  Discuss Task
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Inbox className="h-8 w-8 text-muted-foreground/60 mb-2" />
                      <h3 className="font-medium">No tasks found</h3>
                      <p className="text-sm text-muted-foreground">
                        No tasks matching your search criteria.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 