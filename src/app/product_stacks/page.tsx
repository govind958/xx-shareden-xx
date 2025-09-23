"use client"

import React, { useEffect, useState } from "react"
import { getStacks, Stack } from "./actions"
import { Database } from "lucide-react"

export default function StacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStacks = async () => {
      setIsLoading(true)
      const data = await getStacks()
      setStacks(data)
      setIsLoading(false)
    }

    fetchStacks()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading stacks...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Startup Stacks</h2>

      {stacks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {stacks.map((stack) => (
            <div
              key={stack.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-teal-700">{stack.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{stack.description}</p>
              <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                <span>Type: {stack.type || "General"}</span>
                <span className="flex items-center gap-1">
                  <Database size={16} /> {stack.base_price} credits
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg font-medium">No stacks available right now.</p>
          <p className="mt-2 text-sm">Check back soon for new startup stacks!</p>
        </div>
      )}
    </div>
  )
}
