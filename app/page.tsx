'use client';
import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div className="p-6">
      {isSignedIn ? (
        <div className="flex items-center gap-4">
        <p>Welcome {user?.firstName ?? "User"}</p>
        <UserButton />
        <Link href="/chat">Chatbot</Link>
        </div>
      ) : (
        <Link href="/sign-in">Sign-In</Link>
      )}
      <h1 className="text-3xl font-bold underline mb-4">
        24HourGPT Features Checklist
      </h1>
      <ul className="list-none space-y-2">
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="auth" />
          <label htmlFor="auth">Clerk Authentication</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="prisma" />
          <label htmlFor="prisma">Prisma ORM</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="sqlite" />
          <label htmlFor="sqlite">SQLite Database</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="multitenancy" />
          <label htmlFor="multitenancy">Multi-tenancy</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="square" />
          <label htmlFor="square">Square API Payments</label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="timer" />
          <label htmlFor="timer">
            24-hour Timer Countdown after $1 USD Payment
          </label>
        </li>
        <li className="flex items-center">
          <input type="checkbox" className="mr-2" id="pinecone" />
          <label htmlFor="pinecone">Pinecone Integration</label>
        </li>
      </ul>
    </div>
  );
}