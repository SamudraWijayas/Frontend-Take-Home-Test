import {
  addInvoiceNote,
  getInvoiceById,
  updateInvoiceStatus,
} from "@/service/invoice.service";
import { InvoiceDetail } from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

const useInvoiceDetail = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [optimisticInvoice, setOptimisticInvoice] =
    useState<InvoiceDetail | null>(null);
  const [newNote, setNewNote] = useState("");

  const id = params.id as string;

  const {
    data: dataInvoice,
    isLoading: isLoadingDetailInvoice,
    error,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
  });

  const statusMutation = useMutation({
    mutationFn: updateInvoiceStatus,
    onMutate: async (invoiceId) => {
      await queryClient.cancelQueries({ queryKey: ["invoice", invoiceId] });

      const previousInvoice = queryClient.getQueryData(["invoice", invoiceId]);

      if (dataInvoice) {
        const optimisticData: InvoiceDetail = {
          ...dataInvoice,
          status: "paid",
        };
        setOptimisticInvoice(optimisticData);
        queryClient.setQueryData(["invoice", invoiceId], optimisticData);
      }

      return { previousInvoice };
    },
    onError: (err, invoiceId, context) => {
      if (context?.previousInvoice) {
        queryClient.setQueryData(
          ["invoice", invoiceId],
          context.previousInvoice,
        );
      }
      setOptimisticInvoice(null);
    },
    onSettled: (invoiceId) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-invoices"] });
      setOptimisticInvoice(null);
    },
  });

  const noteMutation = useMutation({
    mutationFn: ({ note }: { note: string }) => addInvoiceNote(id, note),
    onMutate: async ({ note }) => {
      await queryClient.cancelQueries({ queryKey: ["invoice", id] });
      const previousInvoice = queryClient.getQueryData(["invoice", id]);

      if (dataInvoice) {
        const optimisticNotes = [
          ...(dataInvoice.notes || []),
          `[${new Date().toLocaleString("id-ID")}] ${note}`,
        ];
        const optimisticData: InvoiceDetail = {
          ...dataInvoice,
          notes: optimisticNotes,
        };
        queryClient.setQueryData(["invoice", id], optimisticData);
      }

      return { previousInvoice };
    },
    onError: (err, vars, context) => {
      if (context?.previousInvoice) {
        queryClient.setQueryData(["invoice", id], context.previousInvoice);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const handleStatusUpdate = () => {
    statusMutation.mutate(id);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      noteMutation.mutate({ note: newNote.trim() });
      setNewNote("");
    }
  };

  return {
    isLoadingDetailInvoice,
    error,
    dataInvoice,
    statusMutation,
    noteMutation,
    handleStatusUpdate,
    handleAddNote,
    newNote,
    setNewNote,
  };
};

export default useInvoiceDetail;
