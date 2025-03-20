'use client';
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";

export default function AuthSection() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <>
          <p className="hidden md:block">Welcome {user?.firstName ?? "User"} {user?.lastName ?? "Lastname"}</p>
          <UserButton />
          <Link className="px-6 py-2 text-sm tracking-wider uppercase bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 transition-all shadow-lg" href="/chat">Chatbot</Link>
        </>
      ) : (
        <Link className="px-6 py-2 text-sm tracking-wider uppercase border border-gray-700 hover:border-white transition-all" href="/sign-in">Sign-In</Link>
      )}
      <p></p>
    </div>
  );
}