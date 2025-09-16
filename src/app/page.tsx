"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import mixpanel from "mixpanel-browser";

// Initialize Mixpanel
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "";

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, { autocapture: true });
} else {
  console.warn("Mixpanel token is missing! Check your .env file.");
}

export default function HomePage() {
  useEffect(() => {
    // Track page view when user lands here
    mixpanel.track("Home Page Viewed");
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 text-foreground">
      {/* Hero */}
      <section className="relative flex flex-col items-center text-center pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-12">
        {/* Brand Title */}
        <div className="mb-4 sm:mb-6">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
            ShareDen Connect
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
          <Link
            href="/login"
            className="w-full sm:w-auto"
            onClick={() => mixpanel.track("Login CTA Clicked")}
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700">
              Log In
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-teal-500 text-teal-600 hover:bg-teal-50"
            onClick={() => mixpanel.track("Learn More Clicked")}
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Expert Match Section */}
      <section className="relative py-20 sm:py-28 px-6 sm:px-12 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Stuck at{" "}
              <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-teal-600 bg-clip-text text-transparent">
                vibe coding?
              </span>
            </h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-lg mx-auto md:mx-0">
              Get matched with the right expert to transform your prototype into
              a real, working product — faster than you think.
            </p>
            <Link
              href="/experts"
              className="block mt-8"
              onClick={() => mixpanel.track("Find Expert Clicked")}
            >
              <Button className="w-full sm:w-auto bg-white text-teal-600 font-semibold">
                Find an Expert
              </Button>
            </Link>
          </div>

          {/* Image side */}
          <div className="flex justify-center relative">
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>

            <Image
              src="/image 2.png"
              alt="Stuck coding illustration"
              width={300}
              height={350}
              className="max-w-full h-auto z-10"
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
        <Link
          href="/login"
          onClick={() => mixpanel.track("Get Started CTA Clicked")}
        >
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
