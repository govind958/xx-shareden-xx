import { login, signup } from "./actions"
import { Button } from "@/src/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 p-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-teal-200">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
          Welcome Back 👋
        </h1>
        <p className="text-center text-teal-700/80">
          Login or create a new account
        </p>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-xl border border-teal-300/50 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 px-4 py-3 transition"
            />
          </div>

          {/* Password */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-xl border border-teal-300/50 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 px-4 py-3 transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              formAction={login}
              className="w-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition"
            >
              Log in
            </Button>
            <Button
              formAction={signup}
              className="w-1/2 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-teal-500 hover:to-teal-600 transition"
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
