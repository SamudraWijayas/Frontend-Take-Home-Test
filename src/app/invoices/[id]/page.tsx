import DashboardLayout from "@/components/layout/DashboardLayout/DashboardLayout";
import InvoiceDetailes from "@/components/views/InvoiceDetail/InvoiceDetail";
import React from "react";

const InvoiceDetail = () => {
  return (
    <DashboardLayout title="Invoice Detail">
      <InvoiceDetailes />
    </DashboardLayout>
  );
};

export default InvoiceDetail;
