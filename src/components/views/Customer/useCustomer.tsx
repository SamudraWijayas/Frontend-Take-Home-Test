import { getCustomers } from "@/service/invoice.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useCustomer = () => {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return {
    customers,
    isLoading,
  };
};

export default useCustomer;
