"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter,
  ArrowUpDown,
  Calendar,
  MoreHorizontal,
  FileText,
  CreditCard,
  CalendarDays,
  Clock,
  Download,
  InboxIcon,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import Link from 'next/link';
import { mockClients, mockProjects, mockInvoices } from '@/lib/mock-data';
import { cn, formatCurrency } from '@/lib/utils';
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

// Get invoices for this client
const clientInvoices = mockInvoices.filter(invoice => 
  invoice.clientId === clientData.id
);

// Get project name from id
const getProjectName = (projectId: string) => {
  const project = mockProjects.find(project => project.id === projectId);
  return project ? project.name : 'General Services';
};

export default function ClientInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filter and sort invoices
  const filteredInvoices = clientInvoices
    .filter(invoice => 
      (statusFilter ? invoice.status === statusFilter : true) &&
      (
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProjectName(invoice.projectId).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'issueDate') {
        return sortDirection === 'asc' 
          ? new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
          : new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      } else if (sortBy === 'dueDate') {
        return sortDirection === 'asc'
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortBy === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortBy === 'amount') {
        return sortDirection === 'asc'
          ? a.total - b.total
          : b.total - a.total;
      } else if (sortBy === 'number') {
        return sortDirection === 'asc'
          ? a.number.localeCompare(b.number)
          : b.number.localeCompare(a.number);
      }
      return 0;
    });
  
  // Function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get days until due or days overdue
  const getDueDays = (dueDate: Date) => {
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
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Paid</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Overdue</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Toggle sort function
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Get total outstanding amount
  const totalOutstanding = clientInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">View and manage your invoices</p>
        </div>
        {totalOutstanding > 0 && (
          <div className="flex items-center gap-2">
            <Button>
              <CreditCard className="h-4 w-4 mr-2" /> Pay All ({formatCurrency(totalOutstanding)})
            </Button>
          </div>
        )}
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
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
                All Invoices
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('paid')}>
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('sent')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('overdue')}>
                Overdue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Invoices grid - small screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map(invoice => {
            const dueDays = getDueDays(invoice.dueDate);
            const isOverdue = dueDays < 0 && invoice.status !== 'paid';
            
            return (
              <Card key={invoice.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{invoice.number}</h3>
                      <StatusBadge status={invoice.status} />
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {getProjectName(invoice.projectId)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Issued on {formatDate(invoice.issueDate)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className={cn(
                          "text-muted-foreground",
                          isOverdue && "text-red-500 font-medium"
                        )}>
                          Due {formatDate(invoice.dueDate)}
                          {isOverdue && ' (Overdue)'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t p-3 bg-muted/30 flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/client/invoices/${invoice.id}`}>
                        <FileText className="h-4 w-4 mr-2" /> View
                      </Link>
                    </Button>
                    {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                      <Button size="sm">
                        <CreditCard className="h-4 w-4 mr-2" /> Pay
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-2 p-8 text-center">
            <div className="flex flex-col items-center">
              <InboxIcon className="h-10 w-10 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-medium">No invoices found</h3>
              <p className="text-muted-foreground">No invoices matching your search criteria.</p>
            </div>
          </Card>
        )}
      </div>
      
      {/* Invoices table - large screens */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('number')}>
                  <div className="flex items-center">
                    Invoice #
                    {sortBy === 'number' && (
                      <ArrowUpDown className={cn(
                        "ml-2 h-4 w-4", 
                        sortDirection === 'desc' && "transform rotate-180"
                      )} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('issueDate')}>
                  <div className="flex items-center">
                    Issue Date
                    {sortBy === 'issueDate' && (
                      <ArrowUpDown className={cn(
                        "ml-2 h-4 w-4", 
                        sortDirection === 'desc' && "transform rotate-180"
                      )} />
                    )}
                  </div>
                </TableHead>
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
                <TableHead className="cursor-pointer" onClick={() => toggleSort('amount')}>
                  <div className="flex items-center">
                    Amount
                    {sortBy === 'amount' && (
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(invoice => {
                  const dueDays = getDueDays(invoice.dueDate);
                  const isOverdue = dueDays < 0 && invoice.status !== 'paid';
                  
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{getProjectName(invoice.projectId)}</TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>
                        <div className={cn(
                          isOverdue && "text-red-500 font-medium"
                        )}>
                          {formatDate(invoice.dueDate)}
                          {isOverdue && (
                            <div className="flex items-center text-xs mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              <span>{Math.abs(dueDays)} days overdue</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/client/invoices/${invoice.id}`}>
                              View
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
                                <Link href={`/client/invoices/${invoice.id}/download`}>
                                  <Download className="h-4 w-4 mr-2" /> Download PDF
                                </Link>
                              </DropdownMenuItem>
                              {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/client/invoices/${invoice.id}/pay`}>
                                    <CreditCard className="h-4 w-4 mr-2" /> Pay Invoice
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {invoice.status === 'paid' && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/client/invoices/${invoice.id}/receipt`}>
                                    <CheckCircle className="h-4 w-4 mr-2" /> View Receipt
                                  </Link>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <InboxIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
                      <h3 className="font-medium">No invoices found</h3>
                      <p className="text-sm text-muted-foreground">
                        No invoices matching your search criteria.
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