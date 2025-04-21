import { Invoice, InvoiceItem } from '@/types';

// Mock Invoice Items
export const mockInvoiceItems: InvoiceItem[] = [
  // Invoice 1 Items
  {
    id: 'item-1',
    invoiceId: 'invoice-1',
    description: 'Website Design - Initial Mockups',
    quantity: 1,
    unitPrice: 2500,
    totalAmount: 2500,
    projectId: 'project-1'
  },
  {
    id: 'item-2',
    invoiceId: 'invoice-1',
    description: 'Website Design - Wireframes',
    quantity: 1,
    unitPrice: 3500,
    totalAmount: 3500,
    projectId: 'project-1'
  },
  
  // Invoice 2 Items
  {
    id: 'item-3',
    invoiceId: 'invoice-2',
    description: 'Mobile App Development - Phase 1',
    quantity: 1,
    unitPrice: 7500,
    totalAmount: 7500,
    projectId: 'project-2'
  },
  {
    id: 'item-4',
    invoiceId: 'invoice-2',
    description: 'Mobile App UI Design',
    quantity: 1,
    unitPrice: 4500,
    totalAmount: 4500,
    projectId: 'project-2'
  },
  
  // Invoice 3 Items
  {
    id: 'item-5',
    invoiceId: 'invoice-3',
    description: 'Website Development',
    quantity: 1,
    unitPrice: 3750,
    totalAmount: 3750,
    projectId: 'project-8'
  },
  
  // Invoice 4 Items
  {
    id: 'item-6',
    invoiceId: 'invoice-4',
    description: 'Logo Design',
    quantity: 1,
    unitPrice: 1500,
    totalAmount: 1500,
    projectId: 'project-9'
  }
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  // Agency Member 1 Invoices
  {
    id: 'invoice-1',
    number: 'INV-2023-001',
    clientId: 'client-1',
    createdBy: 'member-1',
    status: 'paid',
    issueDate: new Date('2023-03-15'),
    dueDate: new Date('2023-03-30'),
    paidDate: new Date('2023-03-28'),
    subtotal: 6000,
    taxRate: 10,
    taxAmount: 600,
    total: 6600,
    currency: 'USD',
    notes: 'Thank you for your business!',
    termsAndConditions: 'Payment due within 15 days.',
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-28')
  },
  {
    id: 'invoice-2',
    number: 'INV-2023-002',
    clientId: 'client-2',
    createdBy: 'member-1',
    status: 'sent',
    issueDate: new Date('2023-04-10'),
    dueDate: new Date('2023-04-25'),
    subtotal: 12000,
    taxRate: 10,
    taxAmount: 1200,
    total: 13200,
    currency: 'USD',
    notes: 'Thank you for your business!',
    termsAndConditions: 'Payment due within 15 days.',
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-10')
  },
  
  // Agency Member 2 Invoices
  {
    id: 'invoice-3',
    number: 'INV-2023-003',
    clientId: 'client-4',
    createdBy: 'member-2',
    status: 'draft',
    issueDate: new Date('2023-04-15'),
    dueDate: new Date('2023-04-30'),
    subtotal: 6000,
    taxRate: 10,
    taxAmount: 600,
    total: 6600,
    currency: 'USD',
    notes: 'First invoice for social media campaign.',
    termsAndConditions: 'Payment due within 15 days.',
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15')
  },
  
  // Freelancer Invoices
  {
    id: 'invoice-4',
    number: 'INV-2023-001-F',
    clientId: 'client-10',
    createdBy: 'freelancer-1',
    status: 'paid',
    issueDate: new Date('2023-04-15'),
    dueDate: new Date('2023-04-30'),
    paidDate: new Date('2023-04-25'),
    subtotal: 1500,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    total: 1500,
    currency: 'USD',
    notes: 'Logo design project completed.',
    termsAndConditions: 'Payment due within 15 days.',
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-25')
  },
  {
    id: 'invoice-5',
    number: 'INV-2023-002-F',
    clientId: 'client-9',
    createdBy: 'freelancer-1',
    status: 'sent',
    issueDate: new Date('2023-04-20'),
    dueDate: new Date('2023-05-05'),
    subtotal: 3750,
    taxRate: 0,
    taxAmount: 0,
    total: 3750,
    currency: 'USD',
    notes: 'First payment for website development.',
    termsAndConditions: 'Payment due within 15 days.',
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-04-20')
  }
];

// Invoices with their items
export const getInvoicesWithItems = () => {
  return mockInvoices.map(invoice => ({
    ...invoice,
    items: mockInvoiceItems.filter(item => item.invoiceId === invoice.id)
  }));
}; 