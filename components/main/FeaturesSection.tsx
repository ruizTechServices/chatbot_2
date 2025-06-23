"use client";

import { JSX } from "react";

/**
 * Features grid describing product advantages.
 */
export default function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-12 md:mb-0">
          <h2 className="text-3xl font-extralight mb-4">
            Pay As You Go
            <span className="block font-semibold">Intelligent Assistant</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mb-6" />
          <p className="text-gray-400 mb-8">
            Access our advanced AI assistant with simple pricing model that respects
            your privacy and budget.
          </p>
        </div>
        <div className="md:w-2/3 md:pl-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featureData.map(({ title, description, Icon }, idx) => (
              <div
                key={idx}
                className="p-8 border border-gray-800 bg-black/30 hover:bg-black/50 transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-amber-900/50 mb-6">
                  <Icon className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-light mb-3">{title}</h3>
                <p className="text-gray-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
interface Feature {
  title: string;
  description: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const featureData: Feature[] = [
  {
    title: "Pay For What You Use",
    description:
      "Just $1 for 24 hours of unlimited AI assistance, with no hidden fees or subscription surprises.",
    Icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Privacy Focused",
    description:
      "No chat history retention unless you opt in. Your conversations disappear when your session ends.",
    Icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
  {
    title: "Export Your Data",
    description:
      "Download your chat history as a JSONL file at any time to save your valuable conversations.",
    Icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "State-of-the-Art AI",
    description:
      "Access the latest large language models with superior reasoning and knowledge retrieval capabilities.",
    Icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];
