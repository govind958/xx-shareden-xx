import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { logout } from "@/src/app/logout/actions"

export default async function PrivatePanel() {
  const supabase = await createClient()

  // 1️⃣ Get logged-in user
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    redirect("/login")
  }
  const user = authData.user
  const userEmail = user.email || ""

  // 2️⃣ Fetch all forms
  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("*")
    .order("created_at", { ascending: false })

  if (formsError) {
    console.error("❌ Error fetching forms:", formsError.message)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (fixed) */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-teal-500 via-teal-600 to-teal-700 text-white flex flex-col justify-between shadow-lg">
        <div className="p-6">
          {/* User info */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 font-bold text-lg">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium truncate">{userEmail}</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4">
            <Link
              href="/private"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/private/settings"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Settings
            </Link>
            <Link
              href="/startuponbordingform"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Form
            </Link>
            <Link
              href="/private/billing"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Billing
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <form action={logout} className="p-6 border-t border-white/20">
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white font-medium transition"
          >
            Log out
          </button>
        </form>
      </aside>

      {/* Main Content (scrollable) */}
      <main className="ml-64 flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Welcome, <span className="text-teal-600">{userEmail}</span> 🎉
        </h1>
        <p className="text-gray-500 mb-10">
          This is your SaaS panel. Add modules here like analytics, reports,
          settings, or billing features.
        </p>

        {/* Module buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {["Tools", "System", "Reports", "Billing"].map((item) => (
            <button
              key={item}
              className="px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-600 shadow-sm hover:shadow-md hover:border-teal-300 transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* All Forms */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          All Submitted Forms
        </h2>
        <div className="space-y-6">
          {forms && forms.length > 0 ? (
            forms.map((form) => (
              <div
                key={form.form_id}
                className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-teal-700">
                  Who & What: {form.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  Challenge & Success: {form.description}
                </p>
                {form.image_url && (
                  <div className="mt-3 relative w-full h-48">
                    <Image
                      src={form.image_url}
                      alt={form.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  Shareable Resource: {form.label}
                </p>
                <p className="text-sm text-gray-400">
                  Submitted by: {form.user_id || "Unknown"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No forms have been submitted yet.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
