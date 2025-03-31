"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import SessionProvider from '@/components/session/SessionProvider';

// Type definitions
type Message = {
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
};

export default function ChatPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscription tracking
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Session modals
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations when component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchConversations();

      // Mock timer for demo purposes
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
          } else if (prev.hours > 0) {
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          } else {
            clearInterval(interval);
            setShowSessionModal(true);
            return { hours: 0, minutes: 0, seconds: 0 };
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isSignedIn]);

  // Load conversation messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchConversationMessages(activeConversationId);
    }
  }, [activeConversationId]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchConversationMessages = async (conversationId: string) => {
    try {
      console.log(`Fetching messages for conversation: ${conversationId}`);

      // Clear messages before loading new ones
      setMessages([]);

      const res = await fetch(`/api/conversations/${conversationId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!res.ok) throw new Error("Failed to fetch conversation messages");
      const data = await res.json();

      console.log("Conversation data received:", data);

      // Transform database message format to UI message format
      if (data.messages && Array.isArray(data.messages)) {
        console.log(`Found ${data.messages.length} messages`);

        const formattedMessages = data.messages.map((msg: any) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        }));

        console.log("Formatted messages:", formattedMessages);
        // Set messages with the formatted data
        setMessages(formattedMessages);
      } else {
        console.log("No messages found or invalid format");
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      setMessages([]);
    }
  };

  const createNewConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      const data = await res.json();
      setConversations(prev => [data, ...prev]);
      setActiveConversationId(data.id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    // If no active conversation, create one
    if (!activeConversationId) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: input.slice(0, 30) }),
        });
        if (!res.ok) throw new Error("Failed to create conversation");
        const data = await res.json();
        setConversations(prev => [data, ...prev]);
        setActiveConversationId(data.id);

        // Add user message to chat after conversation is created
        const userMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        // Send message to API with the new conversation ID
        await sendMessageToApi(data.id, userMessage);
        return;
      } catch (error) {
        console.error("Error creating conversation:", error);
        return;
      }
    }

    // Add user message to chat when a conversation already exists
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Send message to API
    await sendMessageToApi(activeConversationId, userMessage);
  }

  // Helper function to send messages to the API
  async function sendMessageToApi(conversationId: string, userMessage: Message) {
    try {
      // Send message to API
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          model: "gpt-4o"
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();

      // Add assistant response to chat
      if (data.assistantMessage) {
        setMessages(prev => [...prev, data.assistantMessage]);

        // Update conversation in sidebar
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, title: data.title || conv.title, updatedAt: new Date().toISOString() }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error in conversation:", error);
    } finally {
      setLoading(false);
    }
  }

  // Format the remaining time for display
  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  // Handle export of chat history
  const handleExportChat = () => {
    if (!activeConversationId) return;
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const jsonData = messages.map(msg => JSON.stringify({
      conversation_id: activeConversation?.id,
      conversation_title: activeConversation?.title || "New Conversation",
      timestamp: new Date().toISOString(),
      role: msg.role,
      content: msg.content
    })).join('\n');

    // Create download link
    const blob = new Blob([jsonData], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `24hour-gpt-history-${new Date().toISOString()}.jsonl`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setShowExportModal(false);
  };

  // Extend session (would connect to payment processing)
  const extendSession = () => {
    // Reset timer to 24 hours
    setTimeRemaining({
      hours: 23,
      minutes: 59,
      seconds: 59
    });
    setShowSessionModal(false);

    // In a real implementation, this would process a payment
    console.log("Processing $1 payment for 24-hour extension");
  };

  // Upgrade to monthly (would connect to payment processing)
  const upgradeToMonthly = () => {
    // In a real implementation, this would process a monthly subscription
    console.log("Processing $50 monthly subscription");
    setShowSessionModal(false);
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-md w-full p-8 bg-black/30 backdrop-blur-md border border-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extralight mb-2"><Link href="/">24HouR</Link><span className="font-semibold">GPT</span></h2>
            <p className="text-gray-400">Premium AI conversations without the premium price</p>
          </div>

          <div className="space-y-6">
            <div className="bg-black/20 p-6 border border-gray-800">
              <h3 className="text-xl font-light mb-4">Access Premium AI</h3>
              <p className="text-gray-400 mb-6">Sign in to continue with your premium AI assistant. Just $1 for 24 hours of unlimited access.</p>

              <Link href="/sign-in" className="block w-full py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-center font-light tracking-wider hover:from-amber-600 hover:to-amber-400 transition-all">
                SIGN IN
              </Link>
            </div>

            <div className="bg-black/20 p-6 border border-gray-800">
              <h3 className="text-xl font-light mb-4">New to 24HRGPT?</h3>
              <p className="text-gray-400 mb-6">Create an account to get started with state-of-the-art AI conversations.</p>

              <Link href="/sign-up" className="block w-full py-3 border border-gray-700 text-center font-light tracking-wider hover:bg-gray-900 transition-all">
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white">
        {/* Sidebar */}
        <div
          className={`bg-black border-r border-gray-800 overflow-y-auto transition-all duration-300 ${sidebarOpen ? "w-72" : "w-0"
            }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extralight"><Link href="/">24HouR</Link><span className="font-semibold">GPT</span></h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <button
              onClick={createNewConversation}
              className="w-full border border-gray-800 rounded-sm p-3 text-left hover:bg-gray-900 transition mb-6 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              New Conversation
            </button>

            {/* Time remaining display */}
            <div className="p-4 border border-gray-800 bg-black/50 backdrop-blur-sm mb-6">
              <h3 className="text-sm uppercase text-gray-400 font-medium tracking-wider mb-2">Time Remaining</h3>
              <div className="flex items-center justify-between text-xl font-light">
                <div className="flex items-center">
                  <span>{formatTime(timeRemaining.hours)}</span>
                  <span className="mx-1">:</span>
                  <span>{formatTime(timeRemaining.minutes)}</span>
                  <span className="mx-1">:</span>
                  <span>{formatTime(timeRemaining.seconds)}</span>
                </div>
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="text-xs text-amber-500 hover:text-amber-400 uppercase tracking-wider"
                >
                  Extend
                </button>
              </div>
            </div>

            <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-4">Conversations</h3>
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-gray-500 text-sm">No conversations yet</p>
              ) : (
                conversations.map(conversation => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversationId(conversation.id)}
                    className={`w-full text-left truncate p-3 rounded-sm hover:bg-gray-900 transition flex items-center ${activeConversationId === conversation.id ? "bg-gray-900 border-l-2 border-amber-500" : ""
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {conversation.title || "New Conversation"}
                  </button>
                ))
              )}
            </div>

            {/* User profile at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-black">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm mr-3">
                <UserButton />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress || ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        {/* Chat Container with Fixed Structure */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black border-b border-gray-800 p-4 flex justify-between items-center">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-full hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <h1 className="text-xl font-light mx-auto">
              {activeConversationId
                ? conversations.find(c => c.id === activeConversationId)?.title || "Chat"
                : "New Conversation"
              }
            </h1>

            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 rounded-full hover:bg-gray-800"
              title="Export chat history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>

          {/* Chat Messages - Add flex-1 to allow proper spacing */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#0c0c0c] to-[#0a0a0a]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-4 w-16 h-16 rounded-full bg-amber-900/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-2">Premium AI Conversation</h3>
                <p className="text-gray-400 max-w-md">
                  Send a message to start a conversation with state-of-the-art AI.
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] p-4 rounded-lg ${message.role === "user"
                        ? "bg-gradient-to-r from-amber-800 to-amber-700 text-white"
                        : "bg-black border border-gray-800 backdrop-blur-sm"
                      }`}
                  >
                    <div className="flex items-center mb-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 ${message.role === "user"
                          ? "bg-amber-600 text-white"
                          : "bg-gray-800 text-amber-500"
                        }`}>
                        {message.role === "user" ? (user?.firstName?.charAt(0) || 'U') : 'AI'}
                      </div>
                      <span className="text-xs text-gray-400">
                        {message.role === "user" ? "You" : "24HRGPT"}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-black border border-gray-800 backdrop-blur-sm p-4 rounded-lg">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-amber-500 mr-2">
                      AI
                    </div>
                    <span className="text-xs text-gray-400">24HRGPT</span>
                  </div>
                  <div className="flex space-x-2 items-center h-6">
                    <div className="w-2 h-2 rounded-full bg-amber-700 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-700 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-700 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form - Now with fixed positioning and high z-index */}
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="bg-black border-t border-gray-800 p-4">
              <div className="flex space-x-2 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 bg-[#111111] border border-gray-800 rounded-sm focus:outline-none focus:border-amber-700 text-white placeholder-gray-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-3 bg-gradient-to-r from-amber-700 to-amber-500 rounded-sm hover:from-amber-600 hover:to-amber-400 transition-all disabled:opacity-50 disabled:from-gray-700 disabled:to-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Session Expiry Modal */}
        {showSessionModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 max-w-md w-full">
              <h3 className="text-2xl font-light mb-4">Your Session Is Expiring</h3>
              <p className="text-gray-400 mb-6">
                Your 24-hour access period is ending. Would you like to continue with one of the following options?
              </p>
              <div className="space-y-4">
                <button
                  onClick={extendSession}
                  className="block w-full py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-center font-light tracking-wider hover:from-amber-600 hover:to-amber-400 transition-all"
                >
                  EXTEND FOR $1 (24 HOURS)
                </button>
                <button
                  onClick={upgradeToMonthly}
                  className="block w-full py-3 border border-gray-700 text-center font-light tracking-wider hover:bg-gray-900 transition-all"
                >
                  UPGRADE TO MONTHLY ($50/MONTH)
                </button>
                <button
                  onClick={handleExportChat}
                  className="block w-full py-3 bg-transparent text-center font-light tracking-wider hover:text-amber-500 transition-all"
                >
                  DOWNLOAD CHAT HISTORY (JSONL)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-gray-800 p-8 max-w-md w-full">
              <h3 className="text-2xl font-light mb-4">Export Chat History</h3>
              <p className="text-gray-400 mb-6">
                You can download your chat history as a JSONL file for your records. This file can be imported later or used with other AI tools.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleExportChat}
                  className="block w-full py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-center font-light tracking-wider hover:from-amber-600 hover:to-amber-400 transition-all"
                >
                  DOWNLOAD JSONL FILE
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="block w-full py-3 border border-gray-700 text-center font-light tracking-wider hover:bg-gray-900 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SessionProvider>
  );
}