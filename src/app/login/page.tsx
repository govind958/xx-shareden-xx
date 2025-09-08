import { login, signup } from "./actions"
import { Button } from "@/src/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light to-accent p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-accent/60">
        <h1 className="text-3xl font-bold text-center text-primary">Welcome Back 👋</h1>
        <p className="text-center text-primary/70">Login or create a new account</p>

        <form className="space-y-4">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-lg border-secondary/40 shadow-sm focus:border-primary focus:ring-primary px-4 py-2"
            />
          </div>

          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-lg border-secondary/40 shadow-sm focus:border-primary focus:ring-primary px-4 py-2"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button formAction={login} className="w-1/2 bg-primary text-white hover:bg-secondary">
              Log in
            </Button>
            <Button formAction={signup} className="w-1/2 bg-secondary text-white hover:bg-accent">
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
