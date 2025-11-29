"use client"

// --- React & Next.js Imports ---
import React, { useEffect, useState, useRef, } from "react"
import Image from "next/image"
import toast, { Toaster } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

// --- Supabase & Actions ---
import { createClient } from "@/utils/supabase/client"
import { logout } from "@/src/app/logout/actions"
import { insertForm } from '@/src/app/startuponbordingform/actions'

// --- UI Components & Icons ---
import { Home, Settings, FileText, Menu, X, User, Wallet, PlusCircle, Code, Paintbrush, Megaphone, Users, Coins, ChevronRight, Clock, Database, Layout, Mail, MessageSquare ,CreditCardIcon, TrendingUp, Activity, Zap, LucideShoppingCart,CircuitBoardIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/src/lib/utils"
import StacksPage from "../product_stacks/page"
import StacksCartPage from "../Stacks_Cart/page"
import StackboardPage from "../Stackboard/page"

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

interface TimelineItem {
  icon: React.ElementType;
  label: string;
}

interface ProductCardProps {
  title: string
  subtitle: string
  imageUrl?: string
  features: { label: string; value: string }[]
  price: string
  lastBought?: string
  timeline: TimelineItem[];
}

// A helper class string for glassmorphism style
const glassmorphismClass = "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20";
const innerGlassmorphismClass = "bg-teal-500/5 backdrop-blur-md rounded-xl shadow-lg border border-teal-200/10";
const buttonGradientClass = "bg-gradient-to-r from-teal-400 to-teal-600 text-neutral-950 font-bold hover:from-teal-500 hover:to-teal-700 transition-colors rounded-full shadow-lg shadow-teal-500/50";


/**
 * ## ProductCard Component
 * A reusable component to display a product card with features and premium details,
 * now including a horizontal timeline of core stacks, restyled with glassmorphism.
 */
function ProductCard({ title, subtitle, imageUrl, features, price, lastBought, timeline }: ProductCardProps) {
  return (
    // The main glassmorphic container
    <div className={`p-8 ${glassmorphismClass} transition-all duration-300`}>
      {/* Header and Credits */}
      <div className="relative flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className={`w-16 h-16 p-2 ${innerGlassmorphismClass} flex items-center justify-center`}>
              <Image src={imageUrl} alt={title} width={48} height={48} className="rounded-xl" />
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-neutral-50">{title}</h3>
            <span className="text-sm text-neutral-400">{subtitle}</span>
          </div>
        </div>
        {/* Placeholder for Credits/Tier badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/30">
          <Coins size={16} />
          <span>Premium Stack</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-y-5 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col">
            <p className="text-neutral-400 text-sm">{feature.label}</p>
            <div className="flex items-center gap-1">
                 <Zap size={14} className="text-teal-400"/>
                 <p className="text-neutral-50 font-semibold">{feature.value}</p>
            </div>
          </div>
        ))}
        <div className="col-span-2 mt-2">
          <a href="#" className="flex items-center text-teal-400 hover:text-teal-300 transition-colors font-medium text-sm">
            View all features <ChevronRight size={16} />
          </a>
        </div>
      </div>

      {/* Onboarding Timeline */}
      <div className="border-t border-teal-200/20 pt-6 mt-4 mb-6">
        <h4 className="font-semibold text-neutral-50 mb-4">Core Stacks</h4>
        <div className="flex items-center justify-between overflow-x-auto gap-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-shrink-0 w-16 sm:w-20">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full text-teal-400 ${innerGlassmorphismClass} border-teal-400/30`}>
                <item.icon size={20} />
              </div>
              <span className="text-center text-xs font-medium text-neutral-300 mt-2">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Bought Info */}
      {lastBought && (
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4 border-t border-teal-200/20 pt-4">
          <Clock size={16} className="text-teal-400" />
          <span>{lastBought}</span>
        </div>
      )}

      {/* Footer with Price and Button */}
      <div className="flex justify-between items-center pt-4 mt-auto">
        <div>
          <p className="text-sm text-neutral-400">Stack Price</p>
          <p className="text-3xl font-bold text-teal-400">{price}</p>
        </div>
        <Button className={buttonGradientClass}>
          View Stack
        </Button>
      </div>
    </div>
  );
}

/**
 * ## DashboardContent
 * This component displays the user's dashboard with a welcome message,
 * now styled with the dark, glassmorphic theme.
 */
function DashboardContent({ userEmail, onNavigate }: DashboardContentProps) {
  const userName = userEmail ? userEmail.split("@")[0] : "User";

  const productData = {
    title: "Full Stack Onboarding",
    subtitle: "End-to-end user onboarding for your startup.",
    features: [
      { label: "Onboarding Funnel", value: "Lead-Gen & Discovery" },
      { label: "Actionable Insights", value: "Reporting & Analytics" },
      { label: "Support & Maintenance", value: "Dedicated Fractional Team" },
    ],
    price: "100 Credits",
    lastBought: "Last purchased 3 days ago",
    timeline: [
      { icon: Users, label: "Identity" },
      { icon: Layout, label: "UI/UX" },
      { icon: Database, label: "Data" },
      { icon: Mail, label: "Engage" },
      { icon: MessageSquare, label: "Support" },
    ],
  };
  
  // New: Placeholder for user's key metrics
  const keyMetrics = [
      { label: "Submissions", value: "45", trend: "+12%", icon: FileText, color: "text-teal-400" },
      { label: "Conversion Rate", value: "18.5%", trend: "-0.5%", icon: TrendingUp, color: "text-amber-400" },
      { label: "Monthly Credits", value: "98", trend: "2 Used", icon: Wallet, color: "text-purple-400" },
  ];

  // New: Placeholder for recent activity
  const recentActivity = [
      { id: 1, type: "Form", title: "New Submission on 'Beta Waitlist'", time: "10 minutes ago" },
      { id: 2, type: "Action", title: "Form 'Contact Us' published", time: "2 hours ago" },
      { id: 3, type: "System", title: "Monthly credits auto-refilled", time: "Yesterday" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      
      {/* HEADER SECTION - More prominent welcome and primary CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-50 mb-2">
            Welcome back, <span className="text-teal-400">{userName}</span>
          </h1>
          <p className="text-neutral-400 max-w-3xl">
  Here&apos;s a snapshot of your forms, stacks, and recent activity. Let&apos;s grow your startup!
</p>

        </div>
        <Button
            className={`mt-4 md:mt-0 px-6 py-3 text-lg whitespace-nowrap ${buttonGradientClass}`}
            onClick={() => onNavigate('form')}
        >
            <PlusCircle size={20} className="mr-2" />
            Create New Form
        </Button>
      </div>

      {/* KEY METRICS SECTION - Essential for SaaS dashboard professionalism */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-50 mb-4">Performance Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyMetrics.map((metric) => (
                <div key={metric.label} className={`p-6 ${glassmorphismClass} border-l-4 border-teal-500/50`}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-neutral-400">{metric.label}</p>
                        <metric.icon size={20} className={metric.color} />
                    </div>
                    <p className="text-3xl font-extrabold text-neutral-50 mt-1 mb-2">{metric.value}</p>
                    <span className={`text-xs font-semibold ${metric.trend.includes('+') ? 'text-green-400' : 'text-neutral-400'}`}>
                        {metric.trend}
                    </span>
                    <span className="text-xs text-neutral-500 ml-1">last 7 days</span>
                </div>
            ))}
        </div>
      </div>

      {/* MAIN CONTENT GRID - Product Card, Quick Actions, and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Recommended Product Card (Col 1/2 span on large screens) */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4">Recommended for You</h2>
            <ProductCard {...productData} />
        </div>

        {/* Recent Activity (Col 3 on large screens) */}
        <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4">Recent Activity</h2>
            <div className={`p-6 ${glassmorphismClass} h-full`}>
                <ul className="space-y-4">
                    {recentActivity.map((activity) => (
                        <li key={activity.id} className="flex items-start border-b border-neutral-700/50 pb-4 last:border-b-0 last:pb-0">
                            <Activity size={16} className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-neutral-50 font-medium text-sm">
                                    <span className="text-teal-400 font-semibold mr-1">[{activity.type}]</span>
                                    {activity.title}
                                </p>
                                <p className="text-xs text-neutral-500 mt-0.5">{activity.time}</p>
                            </div>
                        </li>
                    ))}
                    <li className="text-sm text-center pt-2 text-teal-400 hover:text-teal-300 cursor-pointer font-medium"
                        onClick={() => onNavigate('analytics')}
                    >
                        View Full Activity Log
                    </li>
                </ul>
            </div>
        </div>

      </div>

      {/* Explore section - Renamed to 'Stack Ecosystem' and made more visually appealing */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-neutral-50 mb-4">
          Explore the Stack Ecosystem
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Using innerGlassmorphismClass for hover effect on the explore tiles */}
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl border border-teal-200/20 hover:border-teal-400 transition-all duration-200 cursor-pointer ${innerGlassmorphismClass}`}>
            <Code size={36} className="mb-2 text-teal-400" />
            <span className="text-sm font-semibold text-neutral-300 text-center">Development & IT</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl border border-teal-200/20 hover:border-teal-400 transition-all duration-200 cursor-pointer ${innerGlassmorphismClass}`}>
            <Paintbrush size={36} className="mb-2 text-teal-400" />
            <span className="text-sm font-semibold text-neutral-300 text-center">Design & Creative</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl border border-teal-200/20 hover:border-teal-400 transition-all duration-200 cursor-pointer ${innerGlassmorphismClass}`}>
            <Megaphone size={36} className="mb-2 text-teal-400" />
            <span className="text-sm font-semibold text-neutral-300 text-center">Sales & Marketing</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl border border-teal-200/20 hover:border-teal-400 transition-all duration-200 cursor-pointer ${innerGlassmorphismClass}`}>
            <Users size={36} className="mb-2 text-teal-400" />
            <span className="text-sm font-semibold text-neutral-300 text-center">HR & Training</span>
          </div>
           <div className={`flex flex-col items-center justify-center p-4 rounded-xl border border-teal-200/20 hover:border-teal-400 transition-all duration-200 cursor-pointer ${innerGlassmorphismClass}`}>
            <Coins size={36} className="mb-2 text-teal-400" />
            <span className="text-sm font-semibold text-neutral-300 text-center">Finance & Legal</span>
          </div>
        </div>
      </div>

    </div>
  )
}

/**
 * ## Subscription
 * A placeholder component for the user's Subscription.
 */
function SubscriptionContent() {
  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl md:text-4xl font-bold text-teal-400 mb-6">
        Subscription & Billing
      </h2>
      <p className="text-neutral-400 text-lg max-w-xl">
        Review your current plan, upgrade your tier, and update payment details.
      </p>
      <div className={`p-8 rounded-2xl ${glassmorphismClass} mt-8 text-center border-l-4 border-purple-500`}>
        <CreditCardIcon size={32} className="mx-auto mb-3 text-purple-500" />
        <p className="text-neutral-200 text-lg font-semibold">
          Manage Your Plan
        </p>
        <p className="text-neutral-400 text-sm mt-1">
            Find the perfect plan for your growing startup needs.
        </p>
      </div>
    </div>
  );
}

/**
 * ## SettingsContent
 * A placeholder component for the user's settings.
 */
function SettingsContent() {
  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl md:text-4xl font-bold text-teal-400 mb-6">
        Account Settings
      </h2>
      <p className="text-neutral-400 text-lg max-w-xl">
        Update your profile, security settings, and global preferences.
      </p>
      <div className={`p-8 rounded-2xl ${glassmorphismClass} mt-8 text-center border-l-4 border-neutral-500`}>
        <Settings size={32} className="mx-auto mb-3 text-neutral-500" />
        <p className="text-neutral-200 text-lg font-semibold">
          Configuration Center
        </p>
        <p className="text-neutral-400 text-sm mt-1">
            Full control over your SaaS experience.
        </p>
      </div>
    </div>
  );
}


/**
 * ## FormContent
 * This component contains the form for creating a new submission and also
 * displays a list of previously submitted forms, now styled for a dark theme.
 */
function FormContent({ forms, isLoading, handleFormSubmit, isFormLoading, toggleFormView, showFormCreation }: FormContentProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-bold text-neutral-50">Form Management</h2>
        <Button
          onClick={toggleFormView}
          className={`bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full px-5 py-2 transition-colors`}
        >
          {showFormCreation ? (
            'View Forms'
          ) : (
            <div className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>New Form</span>
            </div>
          )}
        </Button>
      </div>

      {showFormCreation ? (
        // Form Creation UI
        <div className={`p-6 md:p-10 ${glassmorphismClass} border-l-4 border-teal-500/50`}>
          <h3 className="text-2xl font-bold text-teal-400 mb-2">Create a New Form</h3>
          <p className="text-neutral-400 mb-8 max-w-xl">Start creating a new form to collect information and share your startup journey.</p>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-400 mb-1">
                🤔 Who are you & what are you building? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Onboarding Form for New Users"
                className="bg-neutral-800 border border-neutral-700 focus:border-teal-500 focus:ring focus:ring-teal-200/50 text-neutral-50 p-3 w-full rounded-lg transition"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-400 mb-1">
                Share one challenge ⚡ and one success 🌟 from your startup.
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="e.g., Struggling with hiring ⚡ but nailed our first launch 🌟"
                rows={3}
                className="bg-neutral-800 border border-neutral-700 focus:border-teal-500 focus:ring focus:ring-teal-200/50 text-neutral-50 p-3 w-full rounded-lg transition resize-none"
              />
            </div>
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-neutral-400 mb-1">
                One extra thing in your startup you can share with other founders 🤝✨
              </label>
              <input
                type="text"
                id="label"
                name="label"
                placeholder="Type something you can share with other founders"
                className="bg-neutral-800 border border-neutral-700 focus:border-teal-500 focus:ring focus:ring-teal-200/50 text-neutral-50 p-3 w-full rounded-lg transition"
              />
            </div>
            <Button
              type="submit"
              disabled={isFormLoading}
              className={`w-full text-lg ${buttonGradientClass}`}
            >
              {isFormLoading ? 'Submitting...' : '🚀 Save & Publish Form'}
            </Button>
          </form>
        </div>
      ) : (
        // Submitted Forms List UI
        <div className={`p-6 md:p-8 ${glassmorphismClass}`}>
          <h3 className="text-2xl font-bold text-neutral-50 mb-6">Your Submitted Forms</h3>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-neutral-500">Loading your forms...</p>
            </div>
          ) : forms.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {forms.map((form) => (
                <div
                  key={form.form_id}
                  className={`rounded-xl border border-teal-200/10 overflow-hidden hover:shadow-xl transform transition-all duration-300 ${innerGlassmorphismClass}`}
                >
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-teal-400 mb-2">{form.title}</h3>
                    <p className="text-neutral-400 text-sm italic border-l-2 border-teal-600 pl-3">{form.description}</p>
                    <div className="mt-4 flex flex-col gap-1 text-xs text-neutral-500 border-t border-neutral-700 pt-3">
                      <div className="flex items-center justify-between">
                         <span className='font-medium text-neutral-300'>Shared Resource:</span>
                         <span className="text-teal-400 font-semibold">{form.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className='font-medium text-neutral-300'>Author ID:</span>
                         <span className="flex items-center gap-1 text-neutral-500">
                           <User size={14} />
                           {form.user_id ? `${form.user_id.substring(0, 8)}...` : "Unknown"}
                         </span>
                      </div>
                    </div>
                    <Button variant="link" className="text-teal-400 p-0 h-auto mt-3">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-neutral-500">
              <FileText size={48} className="mx-auto text-neutral-700 mb-4" />
              <p className="text-lg font-medium">No forms have been submitted yet.</p>
              <p className="mt-2 text-sm">Submit your first form to join the founder ecosystem.</p>
              <Button onClick={toggleFormView} className={`mt-4 ${buttonGradientClass}`}>
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
 * This is the main component for the user's private dashboard,
 * now with a dark glassmorphic design.
 */
export default function PrivatePanel() {
  // --- State Hooks ---
  const searchParams = useSearchParams()
  const [userEmail, setUserEmail] = useState<string>("")
  const [forms, setForms] = useState<Form[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [isMainContentLoaded, setIsMainContentLoaded] = useState<boolean>(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [showFormCreation, setShowFormCreation] = useState(true);
  const [cartRefreshKey, setCartRefreshKey] = useState(0)
  const touchStartX = useRef<number | null>(null)

  // --- useEffect Hooks ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  // Handle URL parameter for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
      // Refresh cart when switching to cart tab via URL
      if (tabParam === 'stacks_cart') {
        setCartRefreshKey(prev => prev + 1)
      }
    }
  }, [searchParams])

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
      window.removeEventListener("touchstart", handleTouchEnd)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isSidebarOpen, isMobile])

  // --- Data and Logic ---
  const sidebarLinks = [
    { id: "dashboard", icon: Home, label: "Dashboard", message: "Your main dashboard" },
    { id: "stacks", icon: Code, label: "Stacks", message: "Explore startup tools and resources" },
    { id: "form", icon: FileText, label: "Forms", message: "Create and manage your forms" },
    { id: "stacks_cart", icon: LucideShoppingCart, label: "Stacks Cart", message: "Create and manage your forms" }, // ✅ Corrected to match the case
    { id: "stackboard", icon: CircuitBoardIcon, label: "Stack board", message: "Create and manage your orders" }, // ✅ Corrected to match the case
    { id: "subscription", icon: CreditCardIcon, label: "Subscription", message: "Manage your plans" },
    { id: "settings", icon: Settings, label: "Settings", message: "Manage account and preferences" },
  ]

  const userInitial: string = userEmail ? userEmail.charAt(0).toUpperCase() : "U"

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsFormLoading(true)
    const formData = new FormData(e.currentTarget)
    const formElement = e.currentTarget;
    try {
      await insertForm(formData);
      toast.success('🚀 Form submitted successfully!')
      // Fetch latest forms to update the list
      const supabase = createClient()
      const { data: formsData, error: formsError } = await supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false })

      if (!formsError) {
        setForms(formsData as Form[] || [])
      }
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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent userEmail={userEmail} onNavigate={setActiveTab} />
      case "stacks":
        // Assuming StacksPage is robust and handles its own layout/data
        return <StacksPage onAddToCart={() => {
          setActiveTab('stacks_cart')
          setCartRefreshKey(prev => prev + 1) // Trigger cart refresh
        }} /> 
         // Assuming StacksPage is robust and handles its own layout/data
         case "stacks_cart":
        return <StacksCartPage key={`cart-${cartRefreshKey}`} /> 
        // Assuming StacksPage is robust and handles its own layout/data
         case "stackboard":
        return <StackboardPage /> 
         case "subscription":
        return <SubscriptionContent />
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
    <div className="min-h-screen w-full font-sans text-neutral-50 transition-all duration-300 relative overflow-hidden">
      {/* Background gradient effect - Subtle, dark SaaS feel */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-300 rounded-full mix-blend-screen opacity-5 blur-3xl"></div>
        <div className="absolute -bottom-1/4 right-0 w-1/2 h-1/2 bg-teal-500 rounded-full mix-blend-screen opacity-5 blur-3xl animation-delay-2000"></div>
      </div>
      
      <div className="flex min-h-screen z-10 relative bg-neutral-950">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col bg-neutral-950/20 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out z-40 border-r border-teal-500/10",
            "md:flex md:w-64 md:translate-x-0 md:static",
            "fixed inset-y-0 left-0 w-64 overflow-y-auto",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Sidebar Header (App Logo/Name) */}
          <div className="border-b border-teal-500/10">
            <div className="flex items-center justify-between p-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
                ShareDen
              </span>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-teal-500/20 text-neutral-50"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 pb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white text-sm font-bold">
                 {userInitial}
              </div>
              <div className="truncate text-sm font-medium text-neutral-50">
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
                    ? "bg-teal-500/15 text-teal-400 font-semibold shadow-inner shadow-teal-500/10 border border-teal-500/30"
                    : "text-neutral-400 hover:bg-teal-500/10 hover:text-teal-400"
                )}
              >
                <link.icon size={18} />
                <span className="text-sm">{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-teal-500/10">
            <form action={logout}>
            <Button
              type="submit"
              variant="outline"
              className="w-full text-white bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 transition font-semibold"
            >
              Log out
            </Button>
            </form>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content wrapper */}
        <div
          className={cn(
            "flex-1 min-h-screen flex flex-col bg-neutral-950",
            isMainContentLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Mobile Header (Sticky and Minimal) */}
          <header className="sticky top-0 z-20 bg-neutral-950/50 backdrop-blur-lg shadow-sm md:hidden border-b border-teal-500/10">
            <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
              {/* Left: Hamburger */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Toggle sidebar"
                className="p-2 rounded-md hover:bg-teal-500/20 text-neutral-400"
              >
                <Menu size={20} />
              </button>

              {/* Center: App Logo */}
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                    ShareDen
              </span>

              {/* Right: User Avatar */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white text-sm font-bold">
                    {userInitial}
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