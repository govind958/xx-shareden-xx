'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Rocket, Sparkles } from "lucide-react"
import Link from "next/link"

// --- helper ---
const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

// --- types ---
interface Stack {
  id: string
  name: string
  type?: string
  description?: string
  base_price?: number
  active?: boolean
  created_at?: string
}

// --- shimmer card ---
const StackShimmerCard = ({
  glassmorphism,
  innerGlass,
}: {
  glassmorphism: string
  innerGlass: string
}) => {
  const shimmer = "animate-pulse bg-neutral-800/50 rounded-lg"
  return (
    <div className={cn("p-6", glassmorphism)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${innerGlass}`}>
            <div className={cn("w-6 h-6", shimmer)} />
          </div>
          <div>
            <div className={cn("w-48 h-5 mb-1", shimmer)} />
            <div className={cn("w-72 h-3", shimmer)} />
          </div>
        </div>
        <div className={cn("w-16 h-5", shimmer)} />
      </div>
      <div className="mt-4 space-y-2">
        <div className={cn("w-full h-4", shimmer)} />
        <div className={cn("w-2/3 h-4", shimmer)} />
        <div className={cn("w-24 h-5 mt-3", shimmer)} />
      </div>
    </div>
  )
}

// --- main page ---
export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [loading, setLoading] = useState(true)

  const glassmorphism =
    "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
  const innerGlass =
    "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"

  useEffect(() => {
    const fetchStacks = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("stacks")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setStacks(data as Stack[])
      }
      setLoading(false)
    }

    fetchStacks()
  }, [])

  const getIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "hr":
        return <Rocket size={22} className="text-cyan-400" />
      default:
        return <Sparkles size={22} className="text-teal-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">
          Explore Startup Stacks 🚀
        </h1>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <>
            <StackShimmerCard
              glassmorphism={glassmorphism}
              innerGlass={innerGlass}
            />
            <StackShimmerCard
              glassmorphism={glassmorphism}
              innerGlass={innerGlass}
            />
          </>
        ) : stacks.length === 0 ? (
          <div className="col-span-full text-center text-neutral-400 py-20">
            <Rocket size={48} className="mx-auto text-cyan-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Active Stacks Found</h2>
            <p className="text-neutral-500">
              Please check back later — new stacks launching soon!
            </p>
          </div>
        ) : (
          stacks.map((stack) => (
            <div
              key={stack.id}
              className={cn(
                "p-6 hover:scale-[1.02] transition-transform duration-300",
                glassmorphism
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${innerGlass}`}>
                    {getIcon(stack.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{stack.name}</h2>
                    <p className="text-neutral-400 text-sm">
                      {stack.type || "General Stack"}
                    </p>
                  </div>
                </div>
                {stack.base_price !== undefined && (
                  <span className="text-lg font-semibold text-teal-400">
                    ₹{stack.base_price.toFixed(2)}
                  </span>
                )}
              </div>

              {stack.description && (
                <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                  {stack.description}
                </p>
              )}

              <Link
                href={`/cart?stackId=${stack.id}`}
                className="inline-block px-5 py-2.5 rounded-full font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Activate Stack
              </Link>
            </div>
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto text-center py-10 text-neutral-500 text-sm border-t border-white/10 mt-10">
        Empowering 120+ founders with AI-driven startup stacks ⚡
      </footer>
    </div>
  )
}
