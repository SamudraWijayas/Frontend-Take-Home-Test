import { createInvoice, getCustomers } from "@/service/invoice.service";
import { CreateInvoicePayload } from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useAddInvoice = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const mutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      router.push(`/invoices/${data.id}`);
    },
    onError: (error) => {
      console.error("Failed to create invoice:", error);
      alert("Failed to create invoice. Please try again.");
    },
  });

  function handleSubmit(data: CreateInvoicePayload) {
    mutation.mutate(data);
  }
  return {
    customers,
    handleSubmit,
    mutation,
  };
};

export default useAddInvoice;
