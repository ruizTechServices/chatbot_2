// Shared type definitions for chatbot components
// This file is colocated under components/chatbot_basic to avoid deep import paths

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};
