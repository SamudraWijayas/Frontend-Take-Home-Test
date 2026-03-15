"use client";

import InvoiceTable from "@/components/views/Invoices/invoice-table";
import SummaryCard from "@/components/ui/Card/summary-card";
import useCustomerDetail from "./useCustomerDetail";

export default function CustomerProfilePage() {
  const { customer, isLoading, error, totalSpent, statusCounts, invoicesData } =
    useCustomerDetail();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !customer) {
    return <div className="p-6 text-red-500">Customer not found</div>;
  }

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-2">
          {customer.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-200 mb-4">{customer.email}</p>
        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
          Plan: {customer.plan}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Spent"
          value={`Rp ${totalSpent.toLocaleString()}`}
        />
        {Object.entries(statusCounts).map(([status, count]) => (
          <SummaryCard
            key={status}
            title={`${status.toUpperCase()} Invoices`}
            value={count}
          />
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold dark:text-gray-200">
            Invoice History ({invoicesData.total})
          </h2>
        </div>
        <InvoiceTable data={invoicesData.items} />
      </div>
    </div>
  );
}
