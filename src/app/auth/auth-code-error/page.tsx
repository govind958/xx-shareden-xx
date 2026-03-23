"use client"

import Link from "next/link"
import { Button } from "@/src/components/ui/button"

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-neutral-950">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
        <p className="text-neutral-400 max-w-md">
          There was a problem signing you in. This can happen if the login link
          expired or was already used.
        </p>
        <Button asChild className="bg-teal-500 hover:bg-teal-600">
          <Link href="/login">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}
