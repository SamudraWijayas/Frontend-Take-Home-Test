"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

import type { InvoiceItem } from "@/types/invoice";

interface Props {
  data: InvoiceItem[];
  onMarkPaid?: (id: string) => void;
}

export default function InvoiceTable({ data, onMarkPaid }: Props) {
  const columns = useMemo<ColumnDef<InvoiceItem>[]>(
    () => [
      {
        header: "Invoice ID",
        accessorKey: "id",
        cell: (info) => (
          <Link
            href={`/invoices/${info.getValue<string>()}`}
            className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            {info.getValue<string>()}
          </Link>
        ),
      },
      {
        header: "Customer",
        accessorKey: "customer_name",
        cell: (info) => info.getValue() ?? "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.getValue() as string;

          const colors = {
            paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            unpaid:
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            overdue:
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            draft:
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
          };

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                colors[status as keyof typeof colors] ?? ""
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => `Rp ${Number(info.getValue()).toLocaleString()}`,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const invoice = row.original;

          if (invoice.status === "paid") {
            return (
              <span className="text-green-500 dark:text-green-400 text-xs font-medium">
                ✓
              </span>
            );
          }

          return (
            <button
              onClick={() => onMarkPaid?.(invoice.id)}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              Mark Paid
            </button>
          );
        },
      },
    ],
    [onMarkPaid],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-175 w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-gray-700 dark:text-gray-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
