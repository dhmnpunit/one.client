export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled';

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  projectId?: string;
  taskId?: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  createdBy: string; // ID of the freelancer, agency member, or agency owner
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  total: number;
  currency: string;
  notes?: string;
  termsAndConditions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
} 