import { createClient } from "@/utils/supabase/server"
import { verifyAdminSession } from "../actions"
import { redirect } from "next/navigation"

export default async function AdminStacksPage() {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    redirect("/admin/login")
  }

  const supabase = await createClient()

  // Get stacks and total count
  const { data: stacks, error } = await supabase
    .from("stacks")
    .select("id, name, type, description, base_price, active, created_at")
    .order("created_at", { ascending: false })

  const totalStacks = stacks?.length ?? 0

  const glassmorphismClass =
    "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-50">Stacks</h1>
        <p className="text-neutral-400">
          Manage and view all available stacks ({totalStacks} total)
        </p>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className={`${glassmorphismClass} p-6`}>
          <h3 className="mb-2 text-sm font-medium text-neutral-400">
            Total Stacks
          </h3>
          <p className="text-3xl font-bold text-teal-400">{totalStacks}</p>
        </div>
      </div>

      {/* Stacks table */}
      <div className={`${glassmorphismClass} overflow-hidden`}>
        {error ? (
          <div className="p-6 text-sm text-red-300">
            Error loading stacks: {error.message}
          </div>
        ) : stacks && stacks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-teal-200/20">
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    Base Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {stacks.map((stack, index) => (
                  <tr
                    key={stack.id}
                    className={`border-b border-teal-200/10 hover:bg-teal-500/5 transition ${
                      index % 2 === 0 ? "bg-teal-500/5" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-neutral-50">
                      {stack.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-300">
                      {stack.type || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-teal-300">
                      {stack.base_price != null ? `${stack.base_price}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          stack.active
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-neutral-700/40 text-neutral-300"
                        }`}
                      >
                        {stack.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400">
                      {stack.created_at
                        ? new Date(
                            stack.created_at as unknown as string
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-400">
            No stacks found
          </div>
        )}
      </div>
    </div>
  )
}


