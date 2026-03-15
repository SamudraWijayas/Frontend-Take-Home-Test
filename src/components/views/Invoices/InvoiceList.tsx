"use client";

import InvoiceTable from "@/components/views/Invoices/invoice-table";
import { Search, RotateCcw } from "lucide-react";
import Link from "next/link";
import useInvoiceList from "./useInvoiceList";

export default function InvoiceList() {
  const {
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
  } = useInvoiceList();

  if (isLoadingInvoice && !dataInvoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dataInvoice) return <p>No invoices found</p>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Invoices
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage billing invoices ({dataInvoice.total})
          </p>
        </div>

        <Link
          href="/invoices/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Tambah
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
        {/* SEARCH */}
        <div className="relative flex-1 min-w-55">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search invoice or customer..."
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Search
        </button>

        {/* STATUS */}
        <select
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm"
          value={status}
          onChange={(e) => updateParams({ page: "1", status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
          <option value="draft">Draft</option>
        </select>

        {/* SORT */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange("due_date")}
            className={`px-3 py-2 text-sm rounded-lg border transition ${
              sortBy === "due_date"
                ? "bg-blue-50 border-blue-400 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Due Date {sortDir === "desc" ? "↓" : "↑"}
          </button>

          <button
            onClick={() => handleSortChange("amount")}
            className={`px-3 py-2 text-sm rounded-lg border transition ${
              sortBy === "amount"
                ? "bg-blue-50 border-blue-400 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Amount {sortDir === "desc" ? "↓" : "↑"}
          </button>
        </div>

        {/* RESET */}
        <button
          onClick={() =>
            updateParams({
              page: "1",
              status: undefined,
              search: undefined,
              sortBy: "due_date",
              sortDir: "desc",
            })
          }
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <InvoiceTable data={dataInvoice.items} />
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          Showing {(page - 1) * 10 + 1} -{" "}
          {Math.min(page * 10, dataInvoice.total)} of {dataInvoice.total}
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={!hasPrev}
            onClick={() => updateParams({ page: (page - 1).toString() })}
            className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Prev
          </button>

          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg">
            {page} / {totalPages}
          </span>

          <button
            disabled={!hasNext}
            onClick={() => updateParams({ page: (page + 1).toString() })}
            className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
