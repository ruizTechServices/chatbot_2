"use client";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

/** Pricing plans with conditional button */
export default function PricingSection() {
  const { isSignedIn } = useAuth();

  return (
    <section id="pricing" className="container mx-auto px-6 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-extralight mb-4">
          Simple <span className="font-semibold">Transparent Pricing</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mx-auto mb-6" />
        <p className="text-gray-400">
          Choose between pay-as-you-go or our premium monthly plan with full data
          retention and advanced features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* PAYG CARD */}
        <div className="border border-gray-800 bg-black/30 p-10 transition-all hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-light">Pay As You Go</h3>
              <p className="text-gray-500 mt-1">For occasional users</p>
            </div>
            <div className="bg-amber-900/20 py-1 px-3 text-amber-500 text-xs">POPULAR</div>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-light">$1</span>
            <span className="text-gray-500 ml-2">/ 24 hours</span>
          </div>
          <ul className="space-y-4 mb-8">
            {paygFeatures.map((f) => (
              <li key={f} className="flex items-start">
                <CheckIcon />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
          </ul>

          {isSignedIn ? (
            <Link
              href="/chatbot_basic"
              className="block w-full py-3 border border-amber-700 text-center font-light tracking-wider hover:bg-amber-900/20 transition-all"
            >
              START NOW
            </Link>
          ) : (
            <Link
              className="px-6 py-2 text-sm tracking-wider uppercase border border-gray-700 hover:border-white transition-all block text-center"
              href="/sign-in"
            >
              Start Now
            </Link>
          )}
        </div>

        {/* PREMIUM CARD */}
        <div className="border border-gray-800 bg-gradient-to-br from-black to-[#0a0a0a] p-10 transition-all hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10">
          <h3 className="text-2xl font-light mb-1">Premium</h3>
          <p className="text-gray-500 mb-6">For power users</p>
          <div className="mb-6">
            <span className="text-4xl font-light">$50</span>
            <span className="text-gray-500 ml-2">/ month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex items-start">
                <CheckIcon />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="#"
            className="block w-full py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-center font-light tracking-wider hover:from-amber-600 hover:to-amber-400 transition-all"
          >
            UPGRADE NOW
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
const paygFeatures = [
  "Unlimited messages for 24 hours",
  "State-of-the-art AI models",
  "JSONL chat history export",
];

const premiumFeatures = [
  "Unlimited messages",
  "Full chat history retention",
  "Advanced data analytics",
  "Priority support",
  "Custom chat organization",
];

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-amber-500 mr-3 mt-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
