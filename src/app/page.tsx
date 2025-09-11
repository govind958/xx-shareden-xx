"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import Image from "next/image";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`You searched for: ${search}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 text-foreground">
      {/* Hero */}
      <section className="relative flex flex-col items-center text-center pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-12">
        {/* Brand Title */}
        <div className="mb-4 sm:mb-6">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
            ShareDen
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-6xl font-extrabold mb-4 sm:mb-6 text-gray-900">
          Your{" "}
          <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
            Startup
          </span>{" "}
          Growth Stack.
        </h1>

        <p className="text-sm sm:text-lg text-gray-600 max-w-xl sm:max-w-2xl mb-6 sm:mb-8">
          ShareDen is the ecosystem where tools, people, and systems don’t just
          coexist — they click. We make sure every moving part of your startup’s
          growth stack works together seamlessly, so you can scale faster,
          smarter, and with less friction.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
          <Link href="/login" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700">
              Log In
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Expert Match Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-12 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 items-center">
          {/* Text side */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stuck at vibe coding?
            </h2>
            <p className="mb-6 text-base sm:text-lg opacity-90">
              Get matched with the right expert to turn your prototype into a
              real, working product.
            </p>
            <Link href="/experts">
              <Button className="w-full sm:w-auto bg-white text-teal-600 font-semibold hover:bg-gray-100">
                Find an Expert
              </Button>
            </Link>
          </div>

          {/* Image side */}
          <div className="flex justify-center">
            <Image
              src="/alert.png"
              alt="Stuck coding illustration"
              width={500}
              height={350}
              className="rounded-2xl shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-12 text-center bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to save time?
        </h2>
        <p className="mb-6 text-sm sm:text-base opacity-90">
          Join founders already using ShareDen today.
        </p>
        <Link href="/login">
          <Button className="w-full sm:w-auto bg-white text-teal-600 font-semibold hover:bg-gray-100">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm sm:text-base">
        © 2025 ShareDen. All rights reserved.
      </footer>
    </main>
  );
}
