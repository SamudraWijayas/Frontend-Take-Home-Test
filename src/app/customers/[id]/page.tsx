import DashboardLayout from "@/components/layout/DashboardLayout/DashboardLayout";
import CustomerProfilePage from "@/components/views/CustomerDetail/CustomerDetail";
import React from "react";

const CustomerDetailPage = () => {
  return (
    <DashboardLayout title="Customer Detail">
      <CustomerProfilePage />
    </DashboardLayout>
  );
};

export default CustomerDetailPage;
