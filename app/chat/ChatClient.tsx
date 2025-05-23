"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import SidebarTimer from "@/components/session/SidebarTimer";

// Type definitions
type Message = {
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export default function ChatClient({ userId }: { userId: string }) {
  // State for chat functionality
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations for the user
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations");
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      const data = await response.json();
      const convos = data.conversations || [];
      setConversations(convos);
      
      // Set active conversation to the most recent one if available
      if (convos.length > 0 && !activeConversationId) {
        const mostRecent = convos.sort((a: Conversation, b: Conversation) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        setActiveConversationId(mostRecent.id);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [activeConversationId, setActiveConversationId, setConversations]);

  // Load conversations on initial render
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Update messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      const conversation = conversations.find(c => c.id === activeConversationId);
      if (conversation) {
        setMessages(conversation.messages || []);
      }
    } else {
      setMessages([]);
    }
  }, [activeConversationId, conversations]);

  // Scroll to bottom of messages on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Create a new conversation
  const createNewConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Conversation",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const data = await response.json();
      setConversations(prev => [data.conversation, ...prev]);
      setActiveConversationId(data.conversation.id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  // Handle form submission for sending messages
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    // Create a conversation if one doesn't exist
    if (!activeConversationId) {
      await createNewConversation();
    }

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    // Optimistically update UI
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`/api/conversations/${activeConversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.response]);
      
      // Update conversations list with latest message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, userMessage, data.response],
                updatedAt: new Date(),
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle chat export functionality
  const handleExportChat = () => {
    if (!activeConversationId || !conversations.length) return;

    const conversation = conversations.find(c => c.id === activeConversationId);
    if (!conversation) return;

    const jsonlContent = conversation.messages
      .map(msg => JSON.stringify(msg))
      .join("\n");
    
    const blob = new Blob([jsonlContent], { type: "application/jsonl" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${conversation.id}.jsonl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  return (
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

          {/* Use our centralized SidebarTimer component here instead of custom timer */}
          <SidebarTimer />

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
                <p className="text-sm font-medium truncate">{userId || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
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

        {/* Chat Messages */}
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
                      {message.role === "user" ? 'U' : 'AI'}
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

        {/* Input Form */}
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
  );
}
