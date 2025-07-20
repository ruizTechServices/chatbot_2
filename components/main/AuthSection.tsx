'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";

export default function AuthSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div className="flex items-center gap-4">
      {/* I also have to implement payment processing */}
      {isSignedIn ? (
        <>
          <p className="hidden md:block">Welcome {user?.firstName ?? "User"} {user?.lastName ?? "Lastname"}</p>
          <UserButton />
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                // First check if an active session exists
                const validateRes = await fetch("/api/sessions/validate");
                if (validateRes.ok) {
                  const validateData = await validateRes.json();
                  if (validateData.valid) {
                    router.push("/chatbot_basic");
                    return;
                  }
                }
                // Otherwise create a payment link
                const paymentRes = await fetch("/api/square/create-payment-link", { method: "POST" });
                const data = await paymentRes.json();
                if (data.redirect) {
                  router.push(data.redirect);
                } else if (data.checkoutUrl) {
                  window.location.href = data.checkoutUrl;
                } else {
                  alert("Unexpected response from payment API");
                }
              } catch (err) {
                console.error(err);
                alert("Payment initiation failed");
              } finally {
                setLoading(false);
              }
            }}
            className="px-6 py-2 text-sm tracking-wider uppercase bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 transition-all shadow-lg disabled:opacity-60"
          >
            {loading ? "Loading..." : "Chatbot"}
          </button>
        </>
      ) : ( 
        <Link className="px-6 py-2 text-sm tracking-wider uppercase border border-gray-700 hover:border-white transition-all" href="/sign-in">Sign-In</Link>
      )}
      <p></p>
    </div>
  );
}

// When the user is signed in, the backend checks if there is a session going on
// If there is, it returns the user to the chatbot
// If there is no session, it returns a payment link to process the payment
// If the payment is successful, it creates a new session and returns the user to the chatbot
// If the payment fails, it returns an error message
// If the user is not signed in, it returns a sign-in link