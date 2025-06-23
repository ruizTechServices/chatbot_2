"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "@/components/chatbot_basic/Sidebar";
import ChatHeader from "@/components/chatbot_basic/ChatHeader";
import MessageList from "@/components/chatbot_basic/MessageList";
import MessageInput from "@/components/chatbot_basic/MessageInput";
import { Conversation, Message } from "@/components/chatbot_basic/types";



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
      <Sidebar
        sidebarOpen={sidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onCloseSidebar={() => setSidebarOpen(false)}
        onCreateConversation={createNewConversation}
        onSelectConversation={setActiveConversationId}
        userId={userId}
      />

      {/* Main chat panel */}
      <div className="flex-1 overflow-hidden">
        <ChatHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onExport={handleExportChat}
          title={activeConversationId ? (conversations.find(c => c.id === activeConversationId)?.title || "Chat") : "New Conversation"}
        />
        <MessageList messages={messages} loading={loading} messagesEndRef={messagesEndRef} />
        <MessageInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
