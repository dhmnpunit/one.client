"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, Download } from "lucide-react"

// Use a specific ClientInvoice interface
interface ClientInvoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue"; // Use specific statuses
  pdfUrl: string;
  project?: string; // Add optional project name
}

// Mock Data (Ensure statuses match the interface)
const invoices: ClientInvoice[] = [
  { id: "inv1", number: "INV-001", issueDate: "2024-07-01", dueDate: "2024-07-15", amount: 2500.00, status: "Paid", pdfUrl: "#", project: "E-commerce Platform" },
  { id: "inv2", number: "INV-002", issueDate: "2024-07-15", dueDate: "2024-07-30", amount: 1800.50, status: "Pending", pdfUrl: "#", project: "Mobile App Design" },
  { id: "inv3", number: "INV-000", issueDate: "2024-06-01", dueDate: "2024-06-15", amount: 3200.00, status: "Paid", pdfUrl: "#", project: "Brand Identity Refresh" },
  { id: "inv4", number: "INV-004", issueDate: "2024-05-15", dueDate: "2024-05-30", amount: 500.75, status: "Overdue", pdfUrl: "#", project: "Marketing Website" },
];

// Add StatusBadge component copied & adapted from agency owner page
const StatusBadge = ({ status }: { status: ClientInvoice['status'] }) => {
  let className = "px-2 py-1 text-xs font-medium rounded-full";
  switch (status) {
    case "Paid":
      className += " bg-green-100 text-green-800";
      break;
    case "Pending":
      className += " bg-yellow-100 text-yellow-800";
      break;
    case "Overdue":
      className += " bg-red-100 text-red-800";
      break;
    default:
      className += " bg-gray-100 text-gray-800";
  }
  return <span className={className}>{status}</span>;
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export default function ClientBillingPage() {
  const totalOutstanding = invoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
      </div>

       {totalOutstanding > 0 && (
        <Card className="bg-primary/10 border-primary/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary">Outstanding Balance</CardTitle>
             <CardDescription className="text-primary/80">
              You have invoices requiring payment.
             </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalOutstanding)}</p>
            <Button> 
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          </CardContent>
        </Card>
      )}

      <h2 className="text-xl font-semibold">Invoice History</h2>

      <div className="bg-white overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="relative px-6 py-3"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.number}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.project || '-'}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                       <Button size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay
                       </Button>
                    )}
                    <Button variant="outline" size="sm" asChild> 
                       <a href={invoice.pdfUrl} download={`${invoice.number}.pdf`}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                       </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 