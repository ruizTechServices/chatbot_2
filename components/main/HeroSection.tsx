"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

/**
 * Landing page hero banner with background & CTA buttons.
 */
export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-extralight leading-tight mb-6 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Premium AI <span className="font-semibold">Without the Premium Price</span>
          </h1>
          <p
            className={`text-xl md:text-2xl font-extralight mb-10 text-gray-300 transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            State-of-the-art conversational AI for just $1 per day.
            <span className="block mt-2">No subscriptions. No commitments.</span>
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-6 transition-all duration-1000 delay-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Link
              href={user ? "/chat" : "/sign-in"}
              className="px-8 py-4 bg-white text-black hover:bg-gray-200 text-lg font-light tracking-wider transition-all text-center"
            >
              START NOW
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border border-gray-700 hover:border-white text-lg font-light tracking-wider transition-all text-center group"
            >
              LEARN MORE
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
