"use client";

import { useRouter } from "next/navigation";
import { CreateInvoiceForm } from "@/components/ui/forms/create-invoice-form";
import { Suspense } from "react";
import useAddInvoice from "./useAddInvoice";

export default function NewInvoicePage() {
  const router = useRouter();
  const { customers, handleSubmit, mutation } = useAddInvoice();

  if (mutation.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="border border-gray-200 rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>Failed to create invoice. Please try again.</p>

          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Suspense fallback={<div>Loading form...</div>}>
        <CreateInvoiceForm
          customers={customers}
          onSubmit={handleSubmit}
          isPending={mutation.isPending}
        />
      </Suspense>
    </div>
  );
}
