"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/service/invoice.service";

import type { InvoiceItem } from "@/types/invoice";

export default function RevenueChart({ data }: { data: InvoiceItem[] }) {
  const { data: allData = [] } = useQuery({
    queryKey: ["invoice-statuses"],
    queryFn: async () => {
      const res = await getInvoices({ pageSize: 100 });
      return res.items;
    },
  });

  const statusCount = {
    paid: allData.filter((i) => i.status === "paid").length,
    unpaid: allData.filter((i) => i.status === "unpaid").length,
    overdue: allData.filter((i) => i.status === "overdue").length,
    draft: allData.filter((i) => i.status === "draft").length,
  };

  const chartData = [
    { name: "Paid", value: statusCount.paid },
    { name: "Unpaid", value: statusCount.unpaid },
    { name: "Overdue", value: statusCount.overdue },
    { name: "Draft", value: statusCount.draft },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444", "#6b7280"];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
      <h2 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">
        Invoice Status Distribution
      </h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
