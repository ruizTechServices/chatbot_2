'use client';
import Link from "next/link";
import { useState } from "react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { generateEmbeddings } from "@/utils/functions/generateEmbeddings";
import { Response } from "openai/_shims/registry.mjs";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [result, setResult] = useState("");

  console.log("User:", user);
  console.log("isSignedIn:", isSignedIn);
  console.log("User ID:", user?.id);
  console.log("User First Name:", user?.firstName);
  console.log("User Last Name:", user?.lastName);
  console.log("User Email:", user?.emailAddresses[0]?.emailAddress);

  const data = { Response };
  console.log("Data:", data);

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
      <p>{user?.lastName ?? "User"}</p>
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
      {/* <button
        onClick={async () => {
          const res = await generateEmbeddings("Hello world");
          setResult(res); // Update the global result state
          // console.log(res);
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Embeddings
      </button>
      <div className="mt-4 w-[600px]">
        <h2 className="text-2xl font-bold">Generated Embeddings:</h2>
        <div className="overflow-x-auto overflow-y-scroll flex flex-col items-center h-[400px]">
          <div className="w-[600px] bg-gray-100 p-4 rounded h-[400px]">
            {JSON.stringify(
              {
                // user: user,
                // isSignedIn: isSignedIn,
                content: result
              },
              null,
              2
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

