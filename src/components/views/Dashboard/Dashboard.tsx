"use client";

import RevenueChart from "@/components/ui/Card/revenue-chart";
import InvoiceTable from "@/components/ui/Card/invoice-table";
import SummaryCard from "@/components/ui/Card/summary-card";
import useDashboard from "./useDashboard";
import { convertIDR } from "@/utils/currency";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>

        <div className="h-80 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="p-6 text-red-500 font-medium">Failed to load dashboard</p>
    );
  }

  if (!data) return null;

  const invoices = data.items;

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((a, b) => a + b.amount, 0);

  const unpaidAmount = invoices
    .filter((i) => i.status === "unpaid")
    .reduce((a, b) => a + b.amount, 0);

  const overdue = invoices.filter((i) => i.status === "overdue").length;

  const currentMonth = new Date().getMonth();
  const totalThisMonth = invoices.filter(
    (i) => i.due_date && new Date(i.due_date).getMonth() === currentMonth,
  ).length;


  return (
    <div className=" space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of your billing performance
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Invoice This Month" value={totalThisMonth} />

        <SummaryCard
          title="Total Unpaid"
          value={convertIDR(unpaidAmount)}
        />

        <SummaryCard title="Overdue Invoices" value={overdue} />

        <SummaryCard
          title="Total Revenue"
          value={convertIDR(totalRevenue)}
        />
      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold mb-4">Revenue Overview</h2>
        <RevenueChart data={invoices} />
      </div>

      {/* RECENT INVOICES */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold mb-4">Recent Invoices</h2>
        <InvoiceTable data={invoices.slice(0, 5)} />
      </div>
    </div>
  );
}
