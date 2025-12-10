import { verifyAdminSession } from "./actions"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protect admin area.
  await verifyAdminSession()

  return (
    <div className="min-h-screen w-full bg-neutral-950 font-sans text-neutral-50">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}


