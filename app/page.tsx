//app/page.tsx
'use client';
import AuthSection from '@/components/main/AuthSection';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
// import Timer from '@/components/main/CountDown';
// import { createClient } from '@/utils/square/client';


export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // Initialize Square client
  // useEffect(() => {
  //   const squareClient = createClient();
  //   // You can now use squareClient for payment processing
  //   // For example, you can create Link payment request here
  //   console.log('Square client initialized:', squareClient);
  //   console.log("APP ID:", process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID);
  //   console.log("LOCATION ID:", process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID);
  // }, []);

  // Animation on load
  useEffect(() => {
    setIsLoaded(true);
  }, []);



  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-light">
      {/* Navigation */}
      <nav className={`fixed w-full py-6 px-6 transition-all duration-700 ${isLoaded ? 'top-0 opacity-100' : '-top-20 opacity-0'} bg-black/80 backdrop-blur-md z-10 border-b border-[#333333]`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extralight tracking-wider">
              24HR<span className="font-semibold">GPT</span>
            </span>
          </div>
          <div className="hidden md:flex space-x-12">
            <Link
              href="https://app.termly.io/policy-viewer/policy.html?policyUUID=26d1bfd9-c152-4fd2-9cee-b6c2fd65a535"
              onClick={() => setActiveTab('private-policy')}
              className={`hover:text-gray-300 transition-colors text-sm tracking-widest uppercase ${activeTab === 'home' ? 'text-white border-b border-amber-500' : 'text-gray-400'}`}
            >
              Private Policy
            </Link>
            <Link
              href="#features"
              onClick={() => setActiveTab('features')}
              className={`hover:text-gray-300 transition-colors text-sm tracking-widest uppercase ${activeTab === 'features' ? 'text-white border-b border-amber-500' : 'text-gray-400'}`}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              onClick={() => setActiveTab('pricing')}
              className={`hover:text-gray-300 transition-colors text-sm tracking-widest uppercase ${activeTab === 'pricing' ? 'text-white border-b border-amber-500' : 'text-gray-400'}`}
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setActiveTab('faq')}
              className={`hover:text-gray-300 transition-colors text-sm tracking-widest uppercase ${activeTab === 'faq' ? 'text-white border-b border-amber-500' : 'text-gray-400'}`}
            >
              FAQ
            </Link>
          </div>
          <div className="flex space-x-4">
            <AuthSection />
          </div>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center">
        {/* Background with luxury NYC skyline effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/60 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extralight leading-tight mb-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Premium AI <span className="font-semibold">Without the Premium Price</span>
            </h1>
            <p className={`text-xl md:text-2xl font-extralight mb-10 text-gray-300 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              State-of-the-art conversational AI for just $1 per day.
              <span className="block mt-2">No subscriptions. No commitments.</span>
            </p>
            <div className={`flex flex-col sm:flex-row gap-6 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link
                href={user ? '/chat' : '/sign-in'}
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
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-12 md:mb-0">
            <h2 className="text-3xl font-extralight mb-4">
              Pay As You Go<span className="block font-semibold">Intelligent Assistant</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mb-6"></div>
            <p className="text-gray-400 mb-8">
              Access our advanced AI assistant with Link simple pricing model that respects your privacy and budget.
            </p>
            {/* <Timer/> */}
          </div>
          <div className="md:w-2/3 md:pl-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-gray-800 bg-black/30 hover:bg-black/50 transition-all duration-300">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-900/50 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3">Pay For What You Use</h3>
                <p className="text-gray-400">
                  Just $1 for 24 hours of unlimited AI assistance, with no hidden fees or subscription surprises.
                </p>
              </div>
              <div className="p-8 border border-gray-800 bg-black/30 hover:bg-black/50 transition-all duration-300">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-900/50 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3">Privacy Focused</h3>
                <p className="text-gray-400">
                  No chat history retention unless you opt in. Your conversations disappear when your session ends.
                </p>
              </div>
              <div className="p-8 border border-gray-800 bg-black/30 hover:bg-black/50 transition-all duration-300">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-900/50 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3">Export Your Data</h3>
                <p className="text-gray-400">
                  Download your chat history as Link JSONL file at any time to save your valuable conversations.
                </p>
              </div>
              <div className="p-8 border border-gray-800 bg-black/30 hover:bg-black/50 transition-all duration-300">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-900/50 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3">State-of-the-Art AI</h3>
                <p className="text-gray-400">
                  Access the latest large language models with superior reasoning and knowledge retrieval capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#0c0c0c] py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extralight mb-4">
              What Our <span className="font-semibold">Users Say</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-800 bg-black/20">
              <div className="flex items-center mb-6">
                <div className="mr-4 w-10 h-10 rounded-full bg-amber-900 flex items-center justify-center text-amber-500 font-semibold">
                  JD
                </div>
                <div>
                  <h4 className="font-medium">Jonathan Drake</h4>
                  <p className="text-gray-500 text-sm">Marketing Specialist</p>
                </div>
              </div>
              <p className="text-gray-300">
                &ldquo;The pay-as-you-go model is perfect for me. I only need AI assistance occasionally, and $1 for 24 hours is an incredible value.&rdquo;
              </p>
            </div>

            <div className="p-8 border border-gray-800 bg-black/20">
              <div className="flex items-center mb-6">
                <div className="mr-4 w-10 h-10 rounded-full bg-amber-900 flex items-center justify-center text-amber-500 font-semibold">
                  SL
                </div>
                <div>
                  <h4 className="font-medium">Sophia Liu</h4>
                  <p className="text-gray-500 text-sm">Product Designer</p>
                </div>
              </div>
              <p className="text-gray-300">
                &ldquo;I love the focus on privacy. Being able to download my chat history as Link JSONL file gives me peace of mind that I won&rsquo;t lose important information.&rdquo;
              </p>
            </div>

            <div className="p-8 border border-gray-800 bg-black/20">
              <div className="flex items-center mb-6">
                <div className="mr-4 w-10 h-10 rounded-full bg-amber-900 flex items-center justify-center text-amber-500 font-semibold">
                  MC
                </div>
                <div>
                  <h4 className="font-medium">Michael Chen</h4>
                  <p className="text-gray-500 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-300">
                &ldquo;The monthly plan is worth every penny. Having my chat history retained saves me countless hours of repeating information. The advanced features are just Link bonus.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extralight mb-4">
            Simple <span className="font-semibold">Transparent Pricing</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-400">
            Choose between pay-as-you-go or our premium monthly plan with full data retention and advanced features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Unlimited messages for 24 hours</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">State-of-the-art AI models</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">JSONL chat history export</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">No chat history retention</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">No advanced features</span>
              </li>
            </ul>

            {isSignedIn ? (
              <>
                <Link
                  href="/chat"
                  className="block w-full py-3 border border-amber-700 text-center font-light tracking-wider hover:bg-amber-900/20 transition-all"
                >
                  START NOW
                </Link>
              </>
            ) : (
              <Link className="px-6 py-2 text-sm tracking-wider uppercase border border-gray-700 hover:border-white transition-all" href="/sign-in">Start Now</Link>
            )}
          </div>

          <div className="border border-gray-800 bg-gradient-to-br from-black to-[#0a0a0a] p-10 transition-all hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10">
            <h3 className="text-2xl font-light mb-1">Premium</h3>
            <p className="text-gray-500 mb-6">For power users</p>
            <div className="mb-6">
              <span className="text-4xl font-light">$50</span>
              <span className="text-gray-500 ml-2">/ month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Unlimited messages</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Full chat history retention</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Advanced data analytics</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Priority support</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Custom chat organization</span>
              </li>
            </ul>
            <Link
              href="#"
              className="block w-full py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-center font-light tracking-wider hover:from-amber-600 hover:to-amber-400 transition-all"
            >
              UPGRADE NOW
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="bg-[#0f0f0f] py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extralight mb-4">
              Frequently <span className="font-semibold">Asked Questions</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-700 to-amber-500 mx-auto mb-6"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="mb-8 border-b border-gray-800 pb-8">
              <h3 className="text-xl font-light mb-4">Can I access my old conversations?</h3>
              <p className="text-gray-400">
                With the pay-as-you-go plan, conversations are not retained after your session ends unless you download them. With the monthly plan, all your conversations are securely stored and accessible anytime.
              </p>
            </div>

            <div className="mb-8 border-b border-gray-800 pb-8">
              <h3 className="text-xl font-light mb-4">What&rsquo;s included in the monthly plan?</h3>
              <p className="text-gray-400">
                The $50/month premium plan includes unlimited AI usage, permanent chat history retention, advanced data analytics, priority support, and custom conversation organization tools.
              </p>
            </div>

            <div className="mb-8 border-b border-gray-800 pb-8">
              <h3 className="text-xl font-light mb-4">Can I use the exported JSONL file?</h3>
              <p className="text-gray-400">
                Yes, the JSONL file contains your complete conversation in Link standard format. You can re-upload it in Link future session, use it with other compatible AI tools, or maintain your own archive.
              </p>
            </div>

            <div className="mb-8 border-b border-gray-800 pb-8">
              <h3 className="text-xl font-light mb-4">Is there Link limit to how many messages I can send?</h3>
              <p className="text-gray-400">
                No, both the daily and monthly plans offer unlimited messages. The only difference is in data retention and additional premium features.
              </p>
            </div>

            <div className="mb-8 border-b border-gray-800 pb-8">
              <h3 className="text-xl font-light mb-4">What happens when my 24-hour period ends?</h3>
              <p className="text-gray-400">
                When your session expires, you&rsquo;ll be presented with options to extend for another 24 hours ($1), upgrade to Link monthly plan ($50), or download your chat history as Link JSONL file before it&rsquo;s deleted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {/* {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-8 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
            <p className="mb-4">
              Your session has ended. Please extend your session or upgrade to our premium plan.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-amber-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}