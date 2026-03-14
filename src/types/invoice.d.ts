export interface ItemDetail {
  name: string;
  qty: number;
  unit: string;
  price: number;
  subtotal: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: string;
}

export interface InvoiceDetail {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  status: string;
  amount: number;
  due_date?: string;
  date?: string;
  items: ItemDetail[];
  notes?: string[];
}

export interface InvoiceItem {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  status: string;
  amount: number;
  due_date?: string;
  date?: string;
  notes?: string[];
}

export interface InvoicesResponse {
  items: InvoiceItem[];
  total: number;
}

export interface CreateInvoiceItem {
  name: string;
  qty: number;
  unit: string;
  price: number;
}

export interface CreateInvoicePayload {
  customer_id: string;
  items: CreateInvoiceItem[];
  due_date: string;
  status: "draft" | "unpaid";
}

export interface StatusCount {
  status: string;
  count: number;
  amount: number;
}

export interface DashboardSummary {
  currentMonthInvoices: number;
  unpaidAmount: number;
  overdueAmount: number;
  totalRevenue: number;
  statusDistribution: StatusCount[];
  latestInvoices: InvoiceItem[];
}

export interface CustomerSummary {
  totalSpent: number;
  statusCounts: Record<string, number>;
}
