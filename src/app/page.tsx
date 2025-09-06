
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-light">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 bg-light shadow-md">
        <h1 className="text-2xl font-bold text-primary">Shareden</h1>
        <nav className="space-x-6">
          <a href="#" className="text-secondary transition">
            Features
          </a>
          <a href="#" className="text-secondary transition">
            Pricing
          </a>
          <a href="#" className="text-secondary transition">
            About
          </a>
        </nav>
       <Link href="/login">
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold shadow-md">
            Login
          </button>
        </Link>

      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-24 px-6">
        <h2 className="text-5xl font-extrabold text-primary mb-6">
          Organize Founders. Save Time. 🚀
        </h2>
        <p className="text-lg text-secondary max-w-2xl mb-8">
          Shareden helps you collect, organize, and track founder information
          with ease. Built for communities that grow together.
        </p>
        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-accent text-light rounded-xl shadow-md font-semibold">
            Get Started
          </button>
          <button className="px-6 py-3 bg-light border border-secondary rounded-xl shadow font-semibold">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="mt-32 px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-light p-6 rounded-2xl shadow text-center">
          <h3 className="text-xl font-semibold text-primary">Founder Forms</h3>
          <p className="mt-3 text-secondary">
            Collect founder details quickly with a beautiful, simple form.
          </p>
        </div>
        <div className="bg-light p-6 rounded-2xl shadow text-center">
          <h3 className="text-xl font-semibold text-primary">Smart Dashboard</h3>
          <p className="mt-3 text-secondary">
            View, sort, and manage all submissions in one place.
          </p>
        </div>
        <div className="bg-light p-6 rounded-2xl shadow text-center">
          <h3 className="text-xl font-semibold text-primary">Community Insights</h3>
          <p className="mt-3 text-secondary">
            Understand friction points and trends across founders.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-8 bg-light border-t text-center text-secondary">
        © {new Date().getFullYear()} Shareden. All rights reserved.
      </footer>
    </main>
  );
}
