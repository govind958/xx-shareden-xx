"use client"

// --- React Imports ---
import React, { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

// Simple class merger utility (simulated for Tailwind CSS class merging)
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

// --- Configuration Data ---
const LEGAL_LINKS = [
    "Privacy Policy",
    "Terms and Conditions",
    "Cancellation and Refund",
    "Shipping and Delivery",
    "Contact Us",
];
import {SidebarLinkProps} from '@/src/types/privacy'

/**
 * Reusable component for the sidebar navigation links.
 */
function SidebarLink({ label, isActive = false, hasSubMenu, onClick }: SidebarLinkProps) {
  const isOpen = isActive && hasSubMenu; 

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className={cn(
          "flex justify-between items-center w-full px-5 py-3 text-sm font-medium transition-colors",
          isActive ? "bg-teal-50 text-teal-700" : "text-gray-700 hover:bg-gray-50"
        )}
      >
        <span>{label}</span>
        {/* Only show chevron if it has a sub-menu and is currently active/open */}
        {hasSubMenu && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} className="text-gray-400" />)}
      </button>
      
      {/* Sub-navigation links (only visible for the active tab) */}
      {isOpen && (
        <div className="py-2 pl-8 pr-5 text-sm text-gray-500 bg-white">
          <ul className="space-y-1">
            <li className="py-1 hover:text-teal-600 cursor-pointer">Section A: Data Collection</li>
            <li className="py-1 hover:text-teal-600 cursor-pointer">Section B: Data Use</li>
            <li className="py-1 hover:text-teal-600 cursor-pointer">Section C: Your Rights</li>
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * ## PrivacyContent - The main text body
 * Displays the actual policy summary and content. 
 */
function PrivacyContent() {
  const lastUpdated = "5th June 2023";

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-10">
      
      {/* Policy Summary Section */}
      <div className="mb-10 pb-10 border-b border-gray-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
          Summary of our Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          It covers every ShareDen service and all of the products and services contained on those websites. The <a href="#" className="text-teal-600 hover:text-teal-800 font-medium border-b border-teal-600/50">detailed policy</a> follows the same structure as this summary and constitutes the actual legal document.
        </p>
        <p className="text-lg text-gray-600 font-semibold mt-6">
          {/* FIX APPLIED: Replaced 'people's' with 'people&apos;s' */}
          Our privacy commitment: **ShareDen has never sold your information** to someone else for advertising, or made money by showing you other people ads, and we never will. This tells you what information we collect from you, what we do with it, who can access it, and what you can do about it.
        </p>
      </div>

      {/* Last Updated */}
      <div className="text-right text-sm text-gray-500 mb-12">
        Last updated on: <span className="font-semibold">{lastUpdated}</span>
      </div>

      {/* Part I: Information Collection and Control */}
      <div className="space-y-10">
        <div id="part-i-collection">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
            Part I — Information ShareDen collects and controls
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We only collect the information that we actually need. Some of that is information that you actively give us when you sign up for an account, register for an event, ask for customer support, or submit a form.
          </p>
        </div>

        {/* Part II: How we use Information */}
        <div id="part-ii-use">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
            Part II — How we use the Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {/* FIX APPLIED: Replaced 'you've' with 'you&apos;ve' */}
            We use your information only for legitimate business purposes like providing the services you have requested, improving our platform, and communicating with you. We do not share your information with third-party advertisers.
          </p>
        </div>
      </div>
    </div>
  );
}


/**
 * ## Main Privacy Policy Page Component
 */
export default function LegalPage() {
  // State to control which tab is currently active
  const [activeTab, setActiveTab] = useState("Privacy Policy");

  return (
    <div className="min-h-screen w-full font-sans text-gray-800 bg-white">
      <div className="flex min-h-screen">
        
        {/* Left Sidebar for Navigation (Fixed width and position) */}
        <aside className="hidden md:block w-64 border-r border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="sticky top-0 pt-16">
            {LEGAL_LINKS.map((link) => (
                <SidebarLink 
                    key={link}
                    label={link} 
                    isActive={activeTab === link}
                    // Only show sub-menu for the Privacy Policy tab for demonstration
                    hasSubMenu={link === "Privacy Policy"} 
                    onClick={() => setActiveTab(link)}
                />
            ))}
          </div>
        </aside>

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto">
          {/* Conditional Content Rendering */}
          {(() => {
              switch (activeTab) {
                  case "Privacy Policy":
                      return <PrivacyContent />;
                  case "Terms and Conditions":
                      return <div className="p-10 text-gray-600 text-lg">Terms and Conditions Content goes here.</div>;
                  case "Cancellation and Refund":
                      return <div className="p-10 text-gray-600 text-lg">Cancellation and Refund Policy Content goes here.</div>;
                  case "Shipping and Delivery":
                      return <div className="p-10 text-gray-600 text-lg">Shipping and Delivery Policy Content goes here.</div>;
                  case "Contact Us":
                      return <div className="p-10 text-gray-600 text-lg">Contact Form or Information goes here.</div>;
                  default:
                      return <PrivacyContent />;
              }
          })()}
        </main>
      </div>
    </div>
  )
}
