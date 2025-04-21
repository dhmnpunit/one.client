export interface Client {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  website?: string;
  assignedToId: string; // ID of the freelancer or agency member
  assignedToType: 'agency-member' | 'freelancer';
  agencyId?: string; // Only present if assigned to agency member
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientWithProjects extends Client {
  projects: Array<{
    id: string;
    name: string;
    status: string;
    dueDate?: Date;
    progress: number;
  }>;
  invoices: Array<{
    id: string;
    number: string;
    status: string;
    amount: number;
    dueDate: Date;
  }>;
}

export interface ClientStats {
  id: string;
  totalProjects: number;
  activeProjects: number;
  totalInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  outstandingAmount: number;
} 