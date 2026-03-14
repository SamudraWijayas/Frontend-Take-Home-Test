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
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
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
            paid: "bg-green-100 text-green-700",
            unpaid: "bg-yellow-100 text-yellow-700",
            overdue: "bg-red-100 text-red-700",
            draft: "bg-gray-100 text-gray-700",
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
              <span className="text-green-500 text-xs font-medium">✓</span>
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
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left px-4 py-3 font-semibold text-gray-600"
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
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
