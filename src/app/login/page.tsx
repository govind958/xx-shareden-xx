import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF2EF] to-[#FFDBB6] p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-[#FFDBB6]/60">
        <h1 className="text-3xl font-bold text-center text-[#5D688A]">Welcome Back 👋</h1>
        <p className="text-center text-[#5D688A]/70">Login or create a new account</p>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#5D688A]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border-[#F7A5A5]/40 shadow-sm focus:border-[#5D688A] focus:ring-[#5D688A] px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#5D688A]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border-[#F7A5A5]/40 shadow-sm focus:border-[#5D688A] focus:ring-[#5D688A] px-4 py-2"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              formAction={login}
              className="w-1/2 bg-[#5D688A] text-white py-2 rounded-lg shadow hover:bg-[#F7A5A5] transition"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="w-1/2 bg-[#F7A5A5] text-white py-2 rounded-lg shadow hover:bg-[#FFDBB6] transition"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

