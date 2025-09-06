import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { logout } from "@/src/app/logout/actions"

export default async function PrivatePanel() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const userEmail = data.user.email || ""

  // Example list of companies selling spare tools
  const companies = [
    {
      name: "Acme Industries",
      description: "High-quality drilling tools available.",
      contact: "sales@acme.com",
    },
    {
      name: "Bolt & Nut Co.",
      description: "Spare nuts, bolts, and fastening tools.",
      contact: "contact@boltandnut.com",
    },
    {
      name: "MegaTools Ltd.",
      description: "Large spare tool sets for factories.",
      contact: "info@megatools.com",
    },
  ]

  return (
    <div className="min-h-screen flex bg-[#FFEAEA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col justify-between border-r border-gray-200 p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 font-bold text-lg">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-600 truncate">{userEmail}</span>
          </div>

          <nav className="flex flex-col gap-4">
            <Link href="/private" className="text-gray-600 hover:text-pink-500 transition">
              Dashboard
            </Link>
            <Link href="/private/settings" className="text-gray-600 hover:text-pink-500 transition">
              Settings
            </Link>
            <Link href="/private/billing" className="text-gray-600 hover:text-pink-500 transition">
              Billing
            </Link>
          </nav>
        </div>

       <form action={logout} className="mt-8">
  <button
    type="submit"
    className="w-full px-4 py-2 rounded-md bg-pink-400 text-white font-medium shadow hover:bg-pink-300 transition"
  >
    Log out
  </button>
</form>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-700 mb-3">
          Welcome, <span className="text-pink-500">{userEmail}</span> 🎉
        </h1>
        <p className="text-gray-500 mb-8">
          This is your SaaS panel. You can add modules here like analytics, reports,
          settings, or billing features.
        </p>

        {/* Module buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          <button className="px-6 py-3 rounded-lg bg-white text-gray-600 shadow-sm hover:bg-pink-50 transition">
            Tools
          </button>
          <button className="px-6 py-3 rounded-lg bg-white text-gray-600 shadow-sm hover:bg-pink-50 transition">
            System
          </button>
          <button className="px-6 py-3 rounded-lg bg-white text-gray-600 shadow-sm hover:bg-pink-50 transition">
            Reports
          </button>
          <button className="px-6 py-3 rounded-lg bg-white text-gray-600 shadow-sm hover:bg-pink-50 transition">
            Billing
          </button>
        </div>

        {/* Companies list */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Available Tools from Companies</h2>
        <div className="space-y-4">
          {companies.map((company, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-pink-500">{company.name}</h3>
              <p className="text-gray-600">{company.description}</p>
              <p className="text-sm text-gray-400 mt-1">📧 {company.contact}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

