"use client";

import { useRouter } from "next/navigation";

import type { InvoiceDetail, ItemDetail } from "@/types/invoice";
import { ChevronLeft } from "lucide-react";
import useInvoiceDetail from "./useInvoiceDetail";

export default function InvoiceDetail() {
  const router = useRouter();

  const {
    isLoadingDetailInvoice,
    error,
    dataInvoice,
    statusMutation,
    noteMutation,
    handleStatusUpdate,
    handleAddNote,
    newNote,
    setNewNote,
  } = useInvoiceDetail();

  if (isLoadingDetailInvoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !dataInvoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Invoice Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The invoice you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/invoices")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ← Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const itemSubtotal = (item: ItemDetail) => item.qty * item.price;
  const totalItemsAmount = dataInvoice.items.reduce(
    (sum, item) => sum + itemSubtotal(item),
    0,
  );

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft /> Back
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Invoice {dataInvoice.id}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>
                  Status:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dataInvoice.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : dataInvoice.status === "unpaid"
                          ? "bg-yellow-100 text-yellow-800"
                          : dataInvoice.status === "overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {dataInvoice.status.toUpperCase()}
                  </span>
                </span>
                <span>Due Date: {dataInvoice.due_date}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                Rp {dataInvoice.amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customer & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Information
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Company:</span>{" "}
                  {dataInvoice.customer_name}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {dataInvoice.customer_email}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h2>
              {dataInvoice.status !== "paid" && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={statusMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3"
                >
                  {statusMutation.isPending
                    ? "Processing..."
                    : "✅ Tandai Lunas"}
                </button>
              )}
              <button
                onClick={() =>
                  console.log(`Download PDF for ${dataInvoice.id}`)
                }
                className="w-full border border-gray-300 hover:border-gray-400 bg-white font-medium py-3 px-4 rounded-lg transition-colors text-gray-700"
              >
                📄 Download PDF
              </button>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Catatan
                <span className="text-sm text-gray-500 ml-1">
                  ({dataInvoice.notes?.length || 0})
                </span>
              </h2>

              {dataInvoice.notes && dataInvoice.notes.length > 0 ? (
                <div className="max-h-48 overflow-y-auto mb-4 space-y-2 pr-1">
                  {dataInvoice.notes.map((note, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400"
                    >
                      <p className="text-sm whitespace-pre-wrap">{note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4 italic">
                  Belum ada catatan.
                </p>
              )}

              {/* Input + Button */}
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Tambah catatan baru..."
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  disabled={noteMutation.isPending}
                />

                <button
                  onClick={handleAddNote}
                  disabled={noteMutation.isPending || !newNote.trim()}
                  className="shrink-0 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors"
                >
                  {noteMutation.isPending ? "..." : "Tambah"}
                </button>
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Billing Items
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.qty} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          Rp {item.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          Rp {itemSubtotal(item).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-right font-bold text-lg"
                      >
                        TOTAL
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-2xl text-blue-600">
                        Rp {totalItemsAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
