import { getInvoices } from "@/service/invoice.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const useInvoiceList = () => {
  const params = useSearchParams();
  const router = useRouter();

  const page = Number(params.get("page") || 1);
  const status = params.get("status") || "";
  const search = params.get("search") || "";
  const sortBy = (params.get("sortBy") as "due_date" | "amount") || "due_date";
  const sortDir = (params.get("sortDir") as "asc" | "desc") || "desc";

  const [tempSearch, setTempSearch] = useState(search);

  const { data: dataInvoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ["invoices", page, status, search, sortBy, sortDir],
    queryFn: () => getInvoices({ page, status, search, sortBy, sortDir }),
  });

  const totalPages = dataInvoice ? Math.ceil(dataInvoice.total / 10) : 0;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const updateParams = (newParams: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams(params.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value);
      }
    });

    router.push(`/invoices?${urlParams.toString()}`);
  };

  const handleSearch = () => {
    updateParams({ page: "1", search: tempSearch });
  };

  const handleSortChange = (newSortBy: "due_date" | "amount") => {
    const newSortDir =
      sortBy === newSortBy && sortDir === "asc" ? "desc" : "asc";

    updateParams({ page: "1", sortBy: newSortBy, sortDir: newSortDir });
  };

  return {
    dataInvoice,
    isLoadingInvoice,
    hasNext,
    hasPrev,
    sortBy,
    sortDir,
    page,
    totalPages,
    tempSearch,
    setTempSearch,
    handleSearch,
    handleSortChange,
    updateParams,
  };
};

export default useInvoiceList;
