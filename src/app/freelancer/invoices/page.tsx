"use client";

import React, { useState, useRef, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Plus,
  ChevronDownIcon, 
  Filter,
  X, 
  Calendar,
  Building, 
  CreditCard,
  Check, 
  Send, 
  Clock,
  AlertCircle,
  Eye
} from "lucide-react";
import Avatar from "boring-avatars";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Invoice status types for filtering
type Status = "All" | "Paid" | "Pending" | "Overdue";

// Invoice item interface
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Invoice interface
interface Invoice {
  id: string;
  client: string;
  clientName: string;
  clientEmail: string;
  project: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  status: string;
  avatarColors: string[];
  paymentMethod: string;
  notes: string;
  items: InvoiceItem[];
}

// Sample invoice data
const invoicesData: Invoice[] = [
  {
    id: "INV-2023-001",
    client: "Acme Corporation",
    clientName: "Ahmet Yilmaz",
    clientEmail: "ahmet@techsolutions.com",
    project: "Website Redesign",
    amount: "$2,500.00",
    issueDate: "Oct 1, 2023",
    dueDate: "Oct 15, 2023",
    status: "paid",
    avatarColors: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
    paymentMethod: "Credit Card",
    notes: "Payment received on time. Thank you!",
    items: [
      { id: "item1", description: "Website Design", quantity: 1, unitPrice: 1500, total: 1500 },
      { id: "item2", description: "Responsive Development", quantity: 1, unitPrice: 800, total: 800 },
      { id: "item3", description: "Content Migration", quantity: 2, unitPrice: 100, total: 200 }
    ]
  },
  {
    id: "INV-2023-002",
    client: "TechStart Inc",
    clientName: "Zeynep Ozturk",
    clientEmail: "zeynep@digitalmarketing.com",
    project: "Mobile App Development",
    amount: "$1,750.50",
    issueDate: "Oct 5, 2023",
    dueDate: "Oct 20, 2023",
    status: "paid",
    avatarColors: ["#A0B9C6", "#7A9CA5", "#6C7E8E", "#4B5A72", "#324267"],
    paymentMethod: "Bank Transfer",
    notes: "Payment for phase 1 development work",
    items: [
      { id: "item4", description: "UI/UX Design", quantity: 1, unitPrice: 850, total: 850 },
      { id: "item5", description: "Front-end Development", quantity: 1, unitPrice: 900.50, total: 900.50 }
    ]
  },
  {
    id: "INV-2023-003",
    client: "Global Solutions",
    clientName: "Mehmet Kaya",
    clientEmail: "mehmet@innovate.com",
    project: "SEO Optimization",
    amount: "$3,200.00",
    issueDate: "Oct 10, 2023",
    dueDate: "Oct 25, 2023",
    status: "pending",
    avatarColors: ["#F5BB9C", "#EE9480", "#EB6877", "#D83F87", "#A91CF0"],
    paymentMethod: "PayPal",
    notes: "Awaiting payment confirmation",
    items: [
      { id: "item6", description: "SEO Audit", quantity: 1, unitPrice: 800, total: 800 },
      { id: "item7", description: "Keyword Research", quantity: 1, unitPrice: 600, total: 600 },
      { id: "item8", description: "Content Optimization", quantity: 6, unitPrice: 300, total: 1800 }
    ]
  },
  {
    id: "INV-2023-004",
    client: "InnovateTech",
    clientName: "Ayse Demir",
    clientEmail: "ayse@creativedesigns.com",
    project: "Backend Development",
    amount: "$4,500.00",
    issueDate: "Sep 15, 2023",
    dueDate: "Sep 30, 2023",
    status: "overdue",
    avatarColors: ["#5E7CE2", "#72A1ED", "#7CCAED", "#92F2DA", "#B8F7D4"],
    paymentMethod: "Credit Card",
    notes: "Second payment reminder sent on Oct 5",
    items: [
      { id: "item9", description: "API Development", quantity: 1, unitPrice: 2200, total: 2200 },
      { id: "item10", description: "Database Integration", quantity: 1, unitPrice: 1800, total: 1800 },
      { id: "item11", description: "Authentication System", quantity: 1, unitPrice: 500, total: 500 }
    ]
  },
  {
    id: "INV-2023-005",
    client: "Digital Dynamics",
    clientName: "Mustafa Celik",
    clientEmail: "mustafa@global.com",
    project: "Content Marketing",
    amount: "$2,800.75",
    issueDate: "Oct 15, 2023",
    dueDate: "Oct 30, 2023",
    status: "pending",
    avatarColors: ["#6FD08C", "#A2E665", "#CAF7CE", "#E2F6D3", "#F9F7D3"],
    paymentMethod: "Bank Transfer",
    notes: "Invoice sent with project delivery",
    items: [
      { id: "item12", description: "Content Strategy", quantity: 1, unitPrice: 950, total: 950 },
      { id: "item13", description: "Blog Articles (5)", quantity: 5, unitPrice: 250, total: 1250 },
      { id: "item14", description: "Social Media Content", quantity: 3, unitPrice: 200.25, total: 600.75 }
    ]
  }
];

// Calculate invoice total - Move this function up before useMemo hooks
const calculateTotal = (items: InvoiceItem[]) => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

// Format currency - Move this function up before useMemo hooks
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    minimumFractionDigits: 2
    }).format(amount);
  };

export default function InvoicesPage() {
  const [filter, setFilter] = useState<Status>("All");
  const [localInvoicesData] = useState(invoicesData);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [invoiceDetailPanelOpen, setInvoiceDetailPanelOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  // Calculate totals for stat cards
  const totalInvoiced = useMemo(() => {
    return formatCurrency(
      localInvoicesData.reduce((sum, invoice) => {
        return sum + calculateTotal(invoice.items);
      }, 0)
    );
  }, [localInvoicesData]);

  const totalPaid = useMemo(() => {
    return formatCurrency(
      localInvoicesData
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => {
          return sum + calculateTotal(invoice.items);
        }, 0)
    );
  }, [localInvoicesData]);

  const totalPending = useMemo(() => {
    return formatCurrency(
      localInvoicesData
        .filter(invoice => invoice.status === 'pending')
        .reduce((sum, invoice) => {
          return sum + calculateTotal(invoice.items);
        }, 0)
    );
  }, [localInvoicesData]);

  const totalOverdue = useMemo(() => {
    return formatCurrency(
      localInvoicesData
        .filter(invoice => invoice.status === 'overdue')
        .reduce((sum, invoice) => {
          return sum + calculateTotal(invoice.items);
        }, 0)
    );
  }, [localInvoicesData]);

  // Function to render status badge
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "paid") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>;
    } else if (status === "pending") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    } else if (status === "overdue") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Overdue</span>;
    }
    return null;
  };

  // Download CSV of invoices
  const downloadInvoicesCSV = () => {
    // This function is kept for future functionality, but currently does nothing
    alert("Download functionality not available");
  };

  // Open invoice detail panel
  const handleOpenInvoiceDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailPanelOpen(true);
  };

  // Show invoice preview
  const previewInvoice = () => {
    setPreviewModalOpen(true);
  };

  // Download invoice as PDF
  const downloadInvoicePDF = async () => {
    if (!selectedInvoice) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set font styles
      pdf.setFont("helvetica", "normal");
      
      // Add PDF content directly
      // Header section
      pdf.setFontSize(22);
      pdf.text("INVOICE", 20, 20);
      pdf.setFontSize(12);
      pdf.text(selectedInvoice.id, 20, 28);
      
      // Company info
      pdf.setFontSize(16);
      pdf.text("Your Company Name", 190, 20, { align: 'right' });
      pdf.setFontSize(10);
      pdf.text("123 Business Street", 190, 28, { align: 'right' });
      pdf.text("City, State 12345", 190, 34, { align: 'right' });
      pdf.text("contact@yourcompany.com", 190, 40, { align: 'right' });
      
      // Divider
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, 45, 190, 45);
      
      // Client and Invoice Details
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Bill To:", 20, 55);
      pdf.setFont("helvetica", "normal");
      pdf.text(selectedInvoice.client, 20, 62);
      pdf.text(selectedInvoice.clientEmail, 20, 68);
      
      // Invoice dates and status
      pdf.setFont("helvetica", "bold");
      pdf.text("Issue Date:", 130, 55);
      pdf.setFont("helvetica", "normal");
      pdf.text(selectedInvoice.issueDate, 190, 55, { align: 'right' });
      
      pdf.setFont("helvetica", "bold");
      pdf.text("Due Date:", 130, 62);
      pdf.setFont("helvetica", "normal");
      pdf.text(selectedInvoice.dueDate, 190, 62, { align: 'right' });
      
      pdf.setFont("helvetica", "bold");
      pdf.text("Status:", 130, 69);
      pdf.setFont("helvetica", "normal");
      const status = selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1);
      pdf.text(status, 190, 69, { align: 'right' });
      
      // Project info
      pdf.setFont("helvetica", "bold");
      pdf.text("Project:", 20, 80);
      pdf.setFont("helvetica", "normal");
      pdf.text(selectedInvoice.project, 20, 87);
      
      // Create table for line items manually
      const startY = 95;
      const colStart = [20, 120, 135, 165];
      
      // Headers
      pdf.setFont("helvetica", "bold");
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, startY, 170, 8, 'F');
      pdf.text("Description", colStart[0], startY + 5);
      pdf.text("Qty", colStart[1] + 5, startY + 5);
      pdf.text("Unit Price", colStart[2] + 15, startY + 5, { align: 'right' });
      pdf.text("Total", colStart[3] + 15, startY + 5, { align: 'right' });
      
      // Draw line items
      let currentY = startY + 8;
      selectedInvoice.items.forEach((item, index) => {
        // Stripe alternating rows for readability
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(20, currentY, 170, 8, 'F');
        }
        
        pdf.setFont("helvetica", "normal");
        pdf.text(item.description, colStart[0], currentY + 5);
        pdf.text(item.quantity.toString(), colStart[1] + 5, currentY + 5, { align: 'center' });
        pdf.text(formatCurrency(item.unitPrice), colStart[2] + 15, currentY + 5, { align: 'right' });
        pdf.text(formatCurrency(item.total), colStart[3] + 15, currentY + 5, { align: 'right' });
        
        currentY += 8;
      });
      
      // Total row
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, currentY, 190, currentY);
      currentY += 5;
      pdf.setFont("helvetica", "bold");
      pdf.text("Total:", 165, currentY + 5);
      pdf.text(formatCurrency(calculateTotal(selectedInvoice.items)), 190, currentY + 5, { align: 'right' });
      
      // Final Y position is after the table
      const finalY = currentY + 15;
      
      // Add notes if they exist
      if (selectedInvoice.notes) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Notes:", 20, finalY);
        pdf.setFont("helvetica", "normal");
        pdf.text(selectedInvoice.notes, 20, finalY + 7);
      }
      
      // Add payment method
      pdf.setFont("helvetica", "bold");
      pdf.text("Payment Method:", 20, finalY + 20);
      pdf.setFont("helvetica", "normal");
      pdf.text(selectedInvoice.paymentMethod, 20, finalY + 27);
      
      // Add footer
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, finalY + 35, 190, finalY + 35);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Thank you for your business!", 105, finalY + 42, { align: 'center' });
      
      // Save the PDF
      pdf.save(`Invoice-${selectedInvoice.id}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Close preview modal
  const closePreviewModal = () => {
    setPreviewModalOpen(false);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-1.5 h-10 px-4"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Status: {filter}
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </Button>
            {filterDropdownOpen && (
              <div className="absolute top-full mt-1 z-10 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                {["All", "Paid", "Pending", "Overdue"].map((status) => (
                  <div
                    key={status}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFilter(status as Status);
                      setFilterDropdownOpen(false);
                    }}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={() => {}} variant="default" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> New Invoice
          </Button>
          <Button onClick={downloadInvoicesCSV} variant="outline" className="flex items-center gap-1.5">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#DDDDDD] p-4">
          <p className="text-sm text-[#707070] mb-1">Total Invoiced</p>
          <p className="text-2xl font-semibold text-[#333333]">{totalInvoiced}</p>
        </div>
        <div className="bg-white rounded-lg border border-[#DDDDDD] p-4">
          <p className="text-sm text-[#707070] mb-1">Total Paid</p>
          <p className="text-2xl font-semibold text-[#333333]">{totalPaid}</p>
        </div>
        <div className="bg-white rounded-lg border border-[#DDDDDD] p-4">
          <p className="text-sm text-[#707070] mb-1">Total Pending</p>
          <p className="text-2xl font-semibold text-[#333333]">{totalPending}</p>
        </div>
        <div className="bg-white rounded-lg border border-[#DDDDDD] p-4">
          <p className="text-sm text-[#707070] mb-1">Total Overdue</p>
          <p className="text-2xl font-semibold text-[#333333]">{totalOverdue}</p>
        </div>
      </div>

      <div className="bg-white border border-[#DDDDDD] rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-[#F9F9F9]">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">
                Invoice ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">
                Project
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">
                Issue Date
                <ChevronDownIcon className="h-4 w-4 inline-block ml-1" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localInvoicesData
              .filter(invoice => filter === "All" || invoice.status === filter.toLowerCase())
              .map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleOpenInvoiceDetail(invoice)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <Avatar 
                          name={invoice.clientName}
                          variant="beam"
                          colors={invoice.avatarColors}
                          size={40}
          />
        </div>
                      <div>
                        <div className="text-sm font-medium text-[#333333]">{invoice.client}</div>
                        <div className="text-xs text-[#707070]">{invoice.clientEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                    {invoice.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">
                    {invoice.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#707070]">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <span className="text-xl leading-none">⋯</span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Details Slide Panel */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-[550px] h-full bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          invoiceDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedInvoice && (
          <div className="h-full flex flex-col">
            {/* Fixed Header */}
            <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100">
              {/* Close button */}
              <button 
                onClick={() => setInvoiceDetailPanelOpen(false)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">Invoice {selectedInvoice.id}</h3>
                  <StatusBadge status={selectedInvoice.status} />
                </div>
                
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    <Avatar 
                      className="h-9 w-9 mr-2 border border-gray-200 bg-white"
                      name={selectedInvoice.clientName}
                      variant="beam"
                      colors={selectedInvoice.avatarColors}
                      size={36}
                    />
                    <span className="text-sm font-medium text-gray-700">{selectedInvoice.client}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Project: {selectedInvoice.project}</span>
                  <span className="text-lg font-semibold">{selectedInvoice.amount}</span>
                </div>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-24">
              <div className="p-6 space-y-4">
                {/* Invoice info */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Invoice Information</h4>
                  
                  <div className="divide-y divide-gray-100">
                    <div className="py-2 flex">
                      <div className="w-1/3 text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Issue Date
                      </div>
                      <div className="w-2/3 text-sm font-medium text-gray-700">
                        {selectedInvoice.issueDate}
                      </div>
                    </div>
                    
                    <div className="py-2 flex">
                      <div className="w-1/3 text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Due Date
                      </div>
                      <div className="w-2/3 text-sm font-medium text-gray-700">
                        {selectedInvoice.dueDate}
                      </div>
                    </div>
                    
                    <div className="py-2 flex">
                      <div className="w-1/3 text-sm text-gray-500 flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Client
                      </div>
                      <div className="w-2/3 text-sm font-medium text-gray-700">
                        {selectedInvoice.client}
        </div>
      </div>

                    <div className="py-2 flex">
                      <div className="w-1/3 text-sm text-gray-500 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Method
                      </div>
                      <div className="w-2/3 text-sm font-medium text-gray-700">
                        {selectedInvoice.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice notes */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">
                    {selectedInvoice.notes || "No notes provided."}
                  </p>
                </div>
                
                {/* Status information */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
                  
                  <div className="flex items-center">
                    {selectedInvoice.status === "paid" ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-5 w-5 mr-2" />
                        <span className="font-medium">Payment received</span>
                      </div>
                    ) : selectedInvoice.status === "pending" ? (
                      <div className="flex items-center text-yellow-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="font-medium">Payment pending</span>
                        </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Payment overdue</span>
                            </div>
                          )}
                        </div>
                </div>

                {/* Line items */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <h4 className="text-sm font-medium text-gray-700 p-4 border-b border-gray-200">Line Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                            Qty
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedInvoice.items.map((item: InvoiceItem) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 text-center">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 text-right whitespace-nowrap">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Total
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right whitespace-nowrap">
                            {formatCurrency(calculateTotal(selectedInvoice.items))}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fixed Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 flex gap-3">
              {selectedInvoice.status === "paid" ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={previewInvoice}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                            </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={downloadInvoicePDF}
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <span className="inline-block animate-spin mr-2">⏳</span>
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {isGeneratingPDF ? "Generating..." : "Download PDF"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={previewInvoice}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Paid
                    </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal */}
      {previewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[800px] max-w-[90vw] max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-bold">Invoice Preview</h3>
              <button onClick={closePreviewModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {/* PDF Preview Content */}
              <div ref={pdfPreviewRef} className="bg-white border border-gray-200 shadow-sm rounded-md p-8 mx-auto max-w-[650px]">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                    <p className="text-gray-600 mt-1">{selectedInvoice.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold mb-1">Your Company Name</div>
                    <div className="text-sm text-gray-600">
                      <p>123 Business Street</p>
                      <p>City, State 12345</p>
                      <p>contact@yourcompany.com</p>
                    </div>
                  </div>
                </div>

                {/* Info Rows */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Bill To:</h3>
                    <p className="text-sm">{selectedInvoice.client}</p>
                    <p className="text-sm">{selectedInvoice.clientEmail}</p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-700">Issue Date: </span>
                      <span className="text-sm">{selectedInvoice.issueDate}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-700">Due Date: </span>
                      <span className="text-sm">{selectedInvoice.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Status: </span>
                      <span className="text-sm">
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Project:</h3>
                  <p className="text-sm">{selectedInvoice.project}</p>
                </div>

                {/* Line Items Table */}
                <table className="w-full mb-8 text-sm">
                  <thead className="border-t border-b border-gray-200">
                    <tr>
                      <th className="py-3 text-left font-semibold text-gray-700">Description</th>
                      <th className="py-3 text-center font-semibold text-gray-700">Qty</th>
                      <th className="py-3 text-right font-semibold text-gray-700">Unit Price</th>
                      <th className="py-3 text-right font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3">{item.description}</td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-right">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-gray-200 font-semibold">
                    <tr>
                      <td colSpan={3} className="py-3 text-right">Total</td>
                      <td className="py-3 text-right">{formatCurrency(calculateTotal(selectedInvoice.items))}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h3>
                    <p className="text-sm text-gray-600">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Method:</h3>
                  <p className="text-sm">{selectedInvoice.paymentMethod}</p>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
                  <p>Thank you for your business!</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={closePreviewModal}>
                Close
              </Button>
              <Button 
                onClick={downloadInvoicePDF} 
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <span className="inline-block animate-spin mr-2">⏳</span>
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for slide panel */}
      {invoiceDetailPanelOpen && !previewModalOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => setInvoiceDetailPanelOpen(false)}
        />
      )}
    </div>
  );
} 