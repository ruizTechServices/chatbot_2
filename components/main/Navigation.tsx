"use client";
import AuthSection from "@/components/main/AuthSection";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Top navigation bar that is shared across the landing page.
 */
export default function Navigation() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("features");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isSignedIn: _isSignedIn } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: _user } = useUser();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <nav
      className={`fixed w-full py-6 px-6 transition-all duration-700 ${
        isLoaded ? "top-0 opacity-100" : "-top-20 opacity-0"
      } bg-black/80 backdrop-blur-md z-10 border-b border-[#333333]`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-extralight tracking-wider">
            24HR<span className="font-semibold">GPT</span>
          </span>
        </div>
        <div className="hidden md:flex space-x-12">
          <Link
            href="https://app.termly.io/policy-viewer/policy.html?policyUUID=26d1bfd9-c152-4fd2-9cee-b6c2fd65a535"
            onClick={() => setActiveTab("private-policy")}
            className={`hover:text-gray-300 transition-colors text-sm tracking-widest uppercase ${
              activeTab === "home"
                ? "text-white border-b border-amber-500"
                : "text-gray-400"
            }`}
          >
            Private Policy
          </Link>
          <Link
            href="#features"
            onClick={() => setActiveTab("features")}
            className={`hover:text-gray-300 transition-colors text-sm tracking-widest uppercase ${
              activeTab === "features"
                ? "text-white border-b border-amber-500"
                : "text-gray-400"
            }`}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            onClick={() => setActiveTab("pricing")}
            className={`hover:text-gray-300 transition-colors text-sm tracking-widest uppercase ${
              activeTab === "pricing"
                ? "text-white border-b border-amber-500"
                : "text-gray-400"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            onClick={() => setActiveTab("faq")}
            className={`hover:text-gray-300 transition-colors text-sm tracking-widest uppercase ${
              activeTab === "faq"
                ? "text-white border-b border-amber-500"
                : "text-gray-400"
            }`}
          >
            FAQ
          </Link>
        </div>
        <div className="flex space-x-4">
          <AuthSection />
        </div>
        <button className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
