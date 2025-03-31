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

  // Rest of the existing implementation
  // ...
}
