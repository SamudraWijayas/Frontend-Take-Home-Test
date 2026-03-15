"use client";

import Link from "next/link";
import { Customer } from "@/types/invoice";
import useCustomer from "./useCustomer";

export default function CustomersPage() {
  const { customers, isLoading } = useCustomer();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Customers
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-150 w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">
                  Profile
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {customers?.map((customer: Customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
                    {customer.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {customer.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-xs font-medium">
                      {customer.plan}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
