"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";

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

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations when component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchConversations();
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
      } catch (error) {
        console.error("Error creating conversation:", error);
        return;
      }
    }

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send message to API
      const res = await fetch(`/api/conversations/${activeConversationId}/messages`, {
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
            conv.id === activeConversationId 
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

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4">Please sign in to use the chat</p>
        <Link href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`bg-gray-800 text-white overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="p-4">
          <button
            onClick={createNewConversation}
            className="w-full border border-white/20 rounded p-3 text-left hover:bg-gray-700 transition mb-4"
          >
            <span className="mr-2">+</span> New Chat
          </button>
          
          <div className="space-y-2">
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                onClick={() => setActiveConversationId(conversation.id)}
                className={`w-full text-left truncate p-3 rounded hover:bg-gray-700 transition ${
                  activeConversationId === conversation.id ? "bg-gray-700" : ""
                }`}
              >
                {conversation.title || "New Conversation"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-200"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold">
            {activeConversationId 
              ? conversations.find(c => c.id === activeConversationId)?.title || "Chat" 
              : "New Chat"
            }
          </h1>
          <div className="w-8"></div> {/* Placeholder for symmetry */}
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 my-8">
              Start a conversation by sending a message below
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user" 
                      ? "bg-blue-500 text-white rounded-br-none" 
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-black p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white border-t p-4 flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}