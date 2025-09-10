"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/card";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`You searched for: ${search}`);
  };

  return (
    <main className="min-h-screen bg-light">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            
            <span className="font-semibold text-gray-700">Shareden</span>
          </div>

          {/* Middle: Search bar */}
          <form onSubmit={handleSubmit} className="flex-1 px-6">
            <input
              type="text"
              placeholder="Search for help on specific topics"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </form>

          {/* Right: Links */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Features
            </Button>
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

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
          <Button variant="default" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section using Card */}
      <section className="mt-32 px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <Card>
          <CardContent className="text-center">
            <CardTitle>Founder Forms</CardTitle>
            <CardDescription>
              Collect founder details quickly with a beautiful, simple form.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <CardTitle>Smart Dashboard</CardTitle>
            <CardDescription>
              View, sort, and manage all submissions in one place.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <CardTitle>Community Insights</CardTitle>
            <CardDescription>
              Understand friction points and trends across founders.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-8 bg-light border-t text-center text-secondary">
        © {new Date().getFullYear()} Shareden. All rights reserved.
      </footer>
    </main>
  );
}
