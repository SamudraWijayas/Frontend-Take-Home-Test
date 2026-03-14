import { getCustomer, getInvoices } from "@/service/invoice.service";
import { Customer, InvoiceItem } from "@/types/invoice";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const useCustomerDetail = () => {
  const params = useParams();
  const customerId = params.id as string;

  const queries = useQueries({
    queries: [
      {
        queryKey: ["customer", customerId],
        queryFn: () => getCustomer(customerId),
      },
      {
        queryKey: ["customerInvoices", customerId],
        queryFn: () => getInvoices({ customerId, page: 1, pageSize: 50 }),
      },
    ],
  });

  const [customerQuery, invoicesQuery] = queries;
  const customer = customerQuery.data as Customer | null;
  const invoicesData = invoicesQuery.data || { items: [], total: 0 };
  const isLoading = customerQuery.isLoading || invoicesQuery.isLoading;
  const error = customerQuery.error || invoicesQuery.error;

  const totalSpent = useMemo(() => {
    return invoicesData.items
      .filter((inv: InvoiceItem) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);
  }, [invoicesData.items]);

  const statusCounts = useMemo(() => {
    return invoicesData.items.reduce(
      (acc: Record<string, number>, inv: InvoiceItem) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      },
      {},
    );
  }, [invoicesData.items]);

  return {
    customer,
    isLoading,
    error,
    totalSpent,
    statusCounts,
    invoicesData,
  };
};

export default useCustomerDetail;
