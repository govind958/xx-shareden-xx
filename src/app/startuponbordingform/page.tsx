'use client'

import { useState } from 'react'
import { insertForm } from './actions'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function StartupOnboardingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await insertForm(formData)
      toast.success('🚀 Form submitted successfully!')
      router.push('/private')
    } catch (err: any) {
      toast.error(err.message || '❌ Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 p-6">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-extrabold mb-6 text-center text-teal-700">
          ShareDen Idea Blast
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🤔 Who are you & what are you building? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Govind – ShareDen"
              className="border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 p-3 w-full rounded-lg transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Share one challenge ⚡ and one success 🌟 from your startup.
            </label>
            <textarea
              name="description"
              placeholder="e.g., Struggling with hiring ⚡ but nailed our first launch 🌟"
              rows={3}
              className="border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 p-3 w-full rounded-lg transition resize-none"
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              One extra thing in your startup you can share with other founders 🤝✨
            </label>
            <input
              type="text"
              name="label"
              placeholder="Type something you can share with other founders"
              className="border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 p-3 w-full rounded-lg transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition"
          >
            {loading ? 'Submitting...' : '🚀 Save Form'}
          </button>
        </form>
      </div>
    </div>
  )
}
