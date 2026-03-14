import { getInvoices } from "@/service/invoice.service";
import { useQuery } from "@tanstack/react-query";

const useDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-invoices"],
    queryFn: () => getInvoices({ page: 1, pageSize: 100 }),
    refetchInterval: 60000,
  });
  return {
    data,
    isLoading,
    error,
  };
};

export default useDashboard;
