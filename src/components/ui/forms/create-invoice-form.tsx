import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import type { Customer, CreateInvoicePayload } from "@/types/invoice";
type FormSchema = z.input<ReturnType<typeof formSchema>>;

const formSchema = (customers: Customer[]) =>
  z
    .object({
      customer_id: z.enum(customers.map((c) => c.id) as [string, ...string[]], {
        message: "Please select a customer",
      }),
      items: z
        .array(
          z.object({
            name: z.string().min(1, "Service name required"),
            qty: z.coerce.number().min(1, "Quantity must be positive number"),
            unit: z.string().min(1, "Unit required"),
            price: z.coerce.number().min(1, "Price must be positive number"),
          }),
        )
        .min(1, "At least one item required"),
      due_date: z.string().min(1, "Due date required"),
      status: z.enum(["draft", "unpaid"], {
        message: "Please select status",
      }),
    })
    .transform((data) => ({
      ...data,
      items: data.items.map((item) => ({
        ...item,
        qty: Number(item.qty),
        price: Number(item.price),
      })),
    }));

interface CreateInvoiceFormProps {
  customers: Customer[];
  onSubmit: (data: CreateInvoicePayload) => void;
  isPending: boolean;
  className?: string;
}

export function CreateInvoiceForm({
  customers,
  onSubmit,
  isPending,
  className,
}: CreateInvoiceFormProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema(customers)),
    defaultValues: {
      customer_id: "",
      items: [{ name: "", qty: 1, unit: "", price: 0 }],
      due_date: "",
      status: "draft",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems =
    useWatch({
      control: form.control,
      name: "items",
    }) || [];

  const total = watchedItems.reduce((sum, item) => {
    return sum + Number(item.qty || 0) * Number(item.price || 0);
  }, 0);

  useEffect(() => {
    if (customers.length > 0 && !form.getValues("customer_id")) {
      form.setValue("customer_id", customers[0].id);
    }
  }, [customers, form]);

  function onFormSubmit(data: z.infer<typeof formSchema>) {
    onSubmit(data as CreateInvoicePayload);
  }

  return (
    <div
      className={`w-full bg-white max-w-2xl mx-auto border border-gray-200 rounded-lg p-6 ${className}`}
    >
      <h2 className="text-2xl font-bold mb-2">Create New Invoice</h2>
      <p className="text-gray-500 mb-6">
        Fill in the details to create a new invoice.
      </p>

      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        {/* CUSTOMER */}
        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select
            {...form.register("customer_id")}
            className="border border-gray-200 rounded px-3 py-2 w-full"
          >
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.email}
              </option>
            ))}
          </select>
          {form.formState.errors.customer_id && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.customer_id.message}
            </p>
          )}
        </div>

        {/* ITEMS */}
        <div>
          <label className="block mb-2 font-medium">Items</label>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-2 items-end border border-gray-200 p-3 rounded"
              >
                <input
                  {...form.register(`items.${index}.name`)}
                  placeholder="Service name"
                  className="border border-gray-200 px-2 py-1 flex-1"
                />

                <input
                  type="number"
                  {...form.register(`items.${index}.qty`)}
                  className="border border-gray-200 px-2 py-1 w-20"
                />

                <input
                  {...form.register(`items.${index}.unit`)}
                  placeholder="unit"
                  className="border border-gray-200 px-2 py-1 w-20"
                />

                <input
                  type="number"
                  {...form.register(`items.${index}.price`)}
                  className="border border-gray-200 px-2 py-1 w-28"
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ name: "", qty: 1, unit: "", price: 0 })}
            className="mt-3 border border-gray-200 px-3 py-1 rounded"
          >
            Add Item
          </button>

          {total > 0 && (
            <div className="pt-4 border border-gray-200-t text-xl font-bold text-right mt-4">
              Total: Rp {total.toLocaleString("id-ID")}
            </div>
          )}
        </div>

        {/* DATE + STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Due Date</label>
            <input
              type="date"
              {...form.register("due_date")}
              className="border border-gray-200 px-3 py-2 rounded w-full"
            />
            {form.formState.errors.due_date && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.due_date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              {...form.register("status")}
              className="border border-gray-200 px-3 py-2 rounded w-full"
            >
              <option value="draft">Draft</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded"
        >
          {isPending ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
}
