import type {
  InvoiceItem,
  InvoicesResponse,
  InvoiceDetail,
  Customer,
  CreateInvoicePayload,
} from "@/types/invoice";
import { invoices, customers } from "@/mocks/data";

export async function getInvoices(
  params: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    sortBy?: "due_date" | "amount";
    sortDir?: "asc" | "desc";
    customerId?: string;
  } = {},
) {
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const status = params.status || "";
  const search = params.search || "";
  const sortBy = params.sortBy || "due_date";
  const sortDir = params.sortDir || "desc";

  await new Promise((r) => setTimeout(r, 400));

  let result = [...invoices];

  // Filter by status
  if (status) {
    result = result.filter((inv) => inv.status === status);
  }

  // Filter by customer
  if (params.customerId) {
    result = result.filter((inv) => inv.customer_id === params.customerId);
  }

  // Filter by search (ID or customer name)
  if (search) {
    const lowerSearch = search.toLowerCase();
    result = result.filter(
      (inv) =>
        inv.id.toLowerCase().includes(lowerSearch) ||
        customers
          .find((c) => c.id === inv.customer_id)
          ?.name?.toLowerCase()
          .includes(lowerSearch),
    );
  }

  // Sort
  result.sort((a, b) => {
    let aVal, bVal;
    if (sortBy === "due_date") {
      aVal = new Date(a.due_date || 0).getTime();
      bVal = new Date(b.due_date || 0).getTime();
    } else {
      aVal = a.amount;
      bVal = b.amount;
    }
    return sortDir === "asc" ? aVal - bVal : bVal - aVal;
  });

  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  const items = result.slice(start, end).map((inv) => ({
    ...inv,
    customer_name: customers.find((c) => c.id === inv.customer_id)?.name,
    customer_email: customers.find((c) => c.id === inv.customer_id)?.email,
  })) as InvoiceItem[];

  return {
    items,
    total: result.length,
  } as InvoicesResponse;
}

export async function getInvoiceById(
  id: string,
): Promise<InvoiceDetail | null> {
  await new Promise((r) => setTimeout(r, 400));

  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) return null;

  const customer = customers.find((c) => c.id === invoice.customer_id);

  return {
    ...invoice,
    customer_name: customer?.name,
    customer_email: customer?.email,
  } as InvoiceDetail;
}

export async function updateInvoiceStatus(id: string) {
  await new Promise((r) => setTimeout(r, 400));

  const invoice = invoices.find((i) => i.id === id);

  if (invoice && invoice.status !== "paid") {
    invoice.status = "paid";
  }

  return invoice;
}

export async function addInvoiceNote(id: string, note: string) {
  await new Promise((r) => setTimeout(r, 400));

  const invoice = invoices.find((i) => i.id === id) as any;

  if (invoice) {
    const timestamp = new Date().toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const newNote = `[${timestamp}] ${note}`;

    if (!invoice.notes) {
      invoice.notes = [];
    }
    invoice.notes.push(newNote);
  }

  return invoice;
}

// Migrate existing notes from old note field (one-time)
invoices.forEach((invoice: any) => {
  if (invoice.note && !invoice.notes) {
    invoice.notes = [`[Migrated] ${invoice.note}`];
    delete invoice.note;
  }
});

export async function getCustomer(
  customerId: string,
): Promise<Customer | null> {
  await new Promise((r) => setTimeout(r, 200));
  return customers.find((c) => c.id === customerId) || null;
}

export async function getCustomers(): Promise<Customer[]> {
  await new Promise((r) => setTimeout(r, 200));
  return customers;
}

export async function createInvoice(
  payload: CreateInvoicePayload,
): Promise<InvoiceDetail> {
  await new Promise((r) => setTimeout(r, 800));

  // Generate sequential ID: INV-YYYY-NNN
  const year = new Date().getFullYear();
  const existingIds = invoices
    .filter((inv) => inv.id.startsWith(`INV-${year}`))
    .map((inv) => parseInt(inv.id.split("-")[2] || "0"));
  const nextNum = Math.max(...existingIds, 0) + 1;
  const id = `INV-${year}-${nextNum.toString().padStart(3, "0")}`;

  // Compute total amount
  const amount = payload.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  // Create invoice
  const newInvoice: any = {
    id,
    ...payload,
    date: new Date().toISOString().split("T")[0],
    amount,
    items: payload.items,
    notes: [],
  };

  // Add to global invoices
  invoices.push(newInvoice);

  // Enrich with customer data
  const customer = customers.find((c) => c.id === payload.customer_id);
  const detail: InvoiceDetail = {
    ...newInvoice,
    customer_name: customer?.name,
    customer_email: customer?.email,
  };

  return detail;
}
