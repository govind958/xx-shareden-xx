"use client"

// --- React & Next.js Imports ---
import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

// --- Supabase & Actions ---
import { createClient } from "@/utils/supabase/client"
import { logout } from "@/src/app/logout/actions"
import { insertForm } from '@/src/app/startuponbordingform/actions'

// --- UI Components & Icons ---
import { Home, Settings, FileText, Menu, X, User, BarChart, Wallet, PlusCircle } from "lucide-react"
import { Code, Paintbrush, Megaphone, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/src/lib/utils"

// --- Interfaces for data and props ---
interface Form {
  form_id: string
  title: string
  description: string
  image_url?: string
  label?: string
  user_id?: string
}

interface DashboardContentProps {
  userEmail: string
  onNavigate: (tabId: string) => void
}

interface FormContentProps {
  forms: Form[]
  isLoading: boolean
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  isFormLoading: boolean
  toggleFormView: () => void
  showFormCreation: boolean
}

// --- Components for each tab's content ---

/**
 * ## DashboardContent
 * This component displays the user's dashboard with a welcome message.
 * It now includes an `onNavigate` prop to handle tab changes.
 */
function DashboardContent({ userEmail, onNavigate }: DashboardContentProps) {
  const userName = userEmail ? userEmail.split("@")[0] : "User"

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
        Welcome, <span className="text-teal-600">{userName}</span> 🎉
      </h1>
      <p className="text-gray-500 mb-8 max-w-2xl">
        This is your main dashboard. Use the navigation to manage your forms, view analytics, and update your settings.
      </p>

      {/* Explore section - inspired by the image */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
          Explore Startup Stacks
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all duration-200 cursor-pointer">
            <Code size={36} className="text-teal-600 mb-2" />
            <span className="text-sm font-semibold text-gray-700 text-center">Development & IT</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border border-teal-500 rounded-xl shadow-md cursor-pointer">
            <Paintbrush size={36} className="text-teal-600 mb-2" />
            <span className="text-sm font-semibold text-gray-700 text-center">Design & Creative</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all duration-200 cursor-pointer">
            <Megaphone size={36} className="text-teal-600 mb-2" />
            <span className="text-sm font-semibold text-gray-700 text-center">Sales & Marketing</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all duration-200 cursor-pointer">
            <Users size={36} className="text-teal-600 mb-2" />
            <span className="text-sm font-semibold text-gray-700 text-center">HR & Training</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Changed this div to a button with an onClick handler */}
          <button 
            className="bg-teal-50 rounded-xl p-5 border border-teal-100 flex items-start gap-4 text-left cursor-pointer hover:bg-teal-100 transition-colors"
            onClick={() => onNavigate('form')}
          >
            <div className="p-3 bg-teal-100 rounded-full text-teal-600">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-teal-800">Create a New Form</h3>
              <p className="text-sm text-teal-600">Start collecting information now.</p>
            </div>
          </button>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full text-gray-600">
              <BarChart size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">View Analytics</h3>
              <p className="text-sm text-gray-600">See how your forms are performing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * ## AnalyticsContent
 * A placeholder component for the analytics dashboard.
 */
function AnalyticsContent() {
  return (
    <div className="p-6 md:p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
      <p className="text-gray-600">This is where your analytics will be displayed.</p>
      <div className="bg-white p-6 rounded-2xl shadow-xl mt-6">
        <p className="text-gray-400">Analytics dashboard content will go here.</p>
      </div>
    </div>
  )
}

/**
 * ## WalletContent
 * A placeholder component for the user's wallet.
 */
function WalletContent() {
  return (
    <div className="p-6 md:p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet</h2>
      <p className="text-gray-600">Manage your credits and payment methods here.</p>
      <div className="bg-white p-6 rounded-2xl shadow-xl mt-6">
        <p className="text-gray-400">Wallet content will go here.</p>
      </div>
    </div>
  )
}

/**
 * ## SettingsContent
 * A placeholder component for the user's settings.
 */
function SettingsContent() {
  return (
    <div className="p-6 md:p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
      <p className="text-gray-600">Update your account settings and preferences.</p>
      <div className="bg-white p-6 rounded-2xl shadow-xl mt-6">
        <p className="text-gray-400">Settings page content will go here.</p>
      </div>
    </div>
  )
}

/**
 * ## FormContent
 * This component contains the form for creating a new submission and also
 * displays a list of previously submitted forms.
 */
function FormContent({ forms, isLoading, handleFormSubmit, isFormLoading, toggleFormView, showFormCreation }: FormContentProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Forms</h2>
        <Button
          onClick={toggleFormView}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
        >
          {showFormCreation ? (
            'View Submitted Forms'
          ) : (
            <div className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>Create New Form</span>
            </div>
          )}
        </Button>
      </div>

      {showFormCreation ? (
        // Form Creation UI
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Create a New Form</h3>
          <p className="text-gray-500 mb-6">Start creating a new form to collect information from your users.</p>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                🤔 Who are you & what are you building? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Onboarding Form for New Users"
                className="border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 p-3 w-full rounded-lg transition"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Share one challenge ⚡ and one success 🌟 from your startup.
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="e.g., Struggling with hiring ⚡ but nailed our first launch 🌟"
                rows={3}
                className="border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 p-3 w-full rounded-lg transition resize-none"
              />
            </div>
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                One extra thing in your startup you can share with other founders 🤝✨
              </label>
              <input
                type="text"
                id="label"
                name="label"
                placeholder="Type something you can share with other founders"
                className="border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 p-3 w-full rounded-lg transition"
              />
            </div>
            <Button
              type="submit"
              disabled={isFormLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
            >
              {isFormLoading ? 'Submitting...' : '🚀 Save Form'}
            </Button>
          </form>
        </div>
      ) : (
        // Submitted Forms List UI
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Submitted Forms</h3>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your forms...</p>
            </div>
          ) : forms.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {forms.map((form) => (
                <div
                  key={form.form_id}
                  className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transform transition-all duration-300"
                >
                  {form.image_url && (
                    <div className="relative w-full h-40">
                      <Image src={form.image_url} alt={form.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-teal-700">{form.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{form.description}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                      <span>Resource: {form.label}</span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {form.user_id || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">No forms have been submitted yet.</p>
              <p className="mt-2 text-sm">Submit a form to see it appear here.</p>
              <Button onClick={toggleFormView} className="mt-4 bg-teal-600 hover:bg-teal-700">
                Create a Form
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// --- Main PrivatePanel component ---

/**
 * ## PrivatePanel
 * This is the main component for the user's private dashboard. It handles
 * authentication, data fetching, state management for tabs and sidebar,
 * and renders the appropriate content based on the active tab.
 */
export default function PrivatePanel() {
  // --- State Hooks ---
  const [userEmail, setUserEmail] = useState<string>("")
  const [forms, setForms] = useState<Form[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [isMainContentLoaded, setIsMainContentLoaded] = useState<boolean>(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [showFormCreation, setShowFormCreation] = useState(true); // New state for toggling form view
  const router = useRouter()
  const touchStartX = useRef<number | null>(null)

  // --- useEffect Hooks ---

  // Handle window resizing to determine mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close sidebar on desktop resize
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  // Fetch user data and forms on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        window.location.href = "/login"
        return
      }
      setUserEmail(authData.user.email || "")

      const { data: formsData, error: formsError } = await supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false })

      if (!formsError) {
        setForms(formsData as Form[] || [])
      }
      setIsLoading(false)
      setIsMainContentLoaded(true)
    }

    fetchData()
  }, [])

  // Handle swipe gestures for mobile sidebar
  useEffect(() => {
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return
      const deltaX = e.changedTouches[0].clientX - touchStartX.current

      if (touchStartX.current < 40 && deltaX > 50) {
        setIsSidebarOpen(true)
      }
      if (isSidebarOpen && deltaX < -50) {
        setIsSidebarOpen(false)
      }
      touchStartX.current = null
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isSidebarOpen, isMobile])

  // --- Data and Logic ---

  const sidebarLinks = [
    { id: "dashboard", icon: Home, label: "Dashboard", message: "Your main dashboard" },
    { id: "analytics", icon: BarChart, label: "Analytics", message: "View your form funnels and data" },
    { id: "wallet", icon: Wallet, label: "Wallet", message: "Manage your credits and payments" },
    { id: "form", icon: FileText, label: "Form", message: "Create and manage your forms" },
    { id: "settings", icon: Settings, label: "Settings", message: "Manage account and preferences" },
  ]

  const userInitial: string = userEmail ? userEmail.charAt(0).toUpperCase() : "U"


  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsFormLoading(true)
    const formData = new FormData(e.currentTarget)

    const formElement = e.currentTarget;

    try {
      const result = await insertForm(formData);

      toast.success('🚀 Form submitted successfully!')

      formElement.reset();
      setShowFormCreation(false);

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('❌ Something went wrong')
      }
    } finally {
      setIsFormLoading(false)
    }
  }

  // A function to render the appropriate content component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent userEmail={userEmail} onNavigate={setActiveTab} />
      case "analytics":
        return <AnalyticsContent />
      case "wallet":
        return <WalletContent />
      case "form":
        return <FormContent
          forms={forms}
          isLoading={isLoading}
          handleFormSubmit={handleFormSubmit}
          isFormLoading={isFormLoading}
          toggleFormView={() => setShowFormCreation(!showFormCreation)}
          showFormCreation={showFormCreation}
        />
      case "settings":
        return <SettingsContent />
      default:
        return <DashboardContent userEmail={userEmail} onNavigate={setActiveTab} />
    }
  }

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-gray-800 transition-all duration-300">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col bg-white h-screen shadow-lg transition-transform duration-300 ease-in-out z-40",
            "md:flex md:w-64 md:translate-x-0 md:static",
            "fixed inset-y-0 left-0 w-64",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* User info and close button */}
          {/* Sidebar Header (Google Maps style) */}
          <div className="border-b border-gray-100">
            {/* Row 1: Title + Close button */}
            <div className="flex items-center justify-between p-4">
              <span className="text-lg font-bold bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
                ShareDen
              </span>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Row 2: Avatar + Email */}
            <div className="flex items-center gap-3 px-4 pb-4">
              <div className="truncate text-sm font-medium text-gray-800">
                {userEmail}
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id)
                  if (isMobile) setIsSidebarOpen(false)
                }}
                className={cn(
                  "flex items-center gap-4 w-full px-3 py-2 rounded-lg transition-colors duration-200 group relative",
                  activeTab === link.id
                    ? "bg-teal-50 text-teal-600 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                )}
              >
                <link.icon size={18} />
                <span className="text-sm">{link.label}</span>
                {/* Tooltip */}
                <span className="absolute left-full ml-4 w-auto p-2 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                  <span className="absolute left-[-5px] top-1/2 -mt-1 w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-solid border-t-transparent border-b-transparent border-r-gray-800"></span>
                  {link.message}
                </span>
              </button>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-100">
            <form action={logout}>
              <Button type="submit" variant="outline" className="w-full text-gray-700 hover:bg-gray-50 border-gray-300">
                Log out
              </Button>
            </form>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content wrapper */}
        <div
          className={cn(
            "flex-1 min-h-screen flex flex-col",
            isMainContentLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Mobile Header */}
          <header className="sticky top-0 z-20 bg-white shadow-sm md:hidden">
            <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
              {/* Left: Hamburger */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Toggle sidebar"
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              >
                <Menu size={20} />
              </button>

              {/* Center: ShareDen gradient text */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
                    Share
                  </span>
                  <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 bg-clip-text text-transparent">
                    Den
                  </span>
                </span>
              </div>

              {/* Right: User Avatar or Join */}
              <div className="flex items-center gap-2">
                {userEmail ? (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-500 text-white text-sm">
                    {userInitial}
                  </div>
                ) : (
                  <button className="text-sm font-semibold text-gray-700 hover:text-teal-600">
                    Join
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}