export const dynamic = "force-dynamic";

import DashboardLayout from "@/components/layout/DashboardLayout/DashboardLayout";
import InvoiceList from "@/components/views/Invoices/InvoiceList";
import React from "react";

const InvoiceListPage = () => {
  return (
    <DashboardLayout title="Invoice List">
      <InvoiceList />
    </DashboardLayout>
  );
};

export default InvoiceListPage;
