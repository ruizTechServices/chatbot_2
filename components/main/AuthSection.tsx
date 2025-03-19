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
          <p>Welcome {user?.firstName ?? "User"}</p>
          <UserButton />
          <Link href="/chat">Chatbot</Link>
        </>
      ) : (
        <Link href="/sign-in">Sign-In</Link>
      )}
      <p>{user?.lastName ?? "User"}</p>
    </div>
  );
}