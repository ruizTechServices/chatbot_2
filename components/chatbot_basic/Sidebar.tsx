"use client";

import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import SidebarTimer from "@/components/session/SidebarTimer";
import { Conversation } from "./types";

export interface SidebarProps {
  sidebarOpen: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  onCloseSidebar: () => void;
  onCreateConversation: () => void;
  onSelectConversation: (id: string) => void;
  userId: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  conversations,
  activeConversationId,
  onCloseSidebar,
  onCreateConversation,
  onSelectConversation,
  userId,
}) => {
  return (
    <div
      className={`bg-black border-r border-gray-800 overflow-y-auto transition-all duration-300 ${
        sidebarOpen ? "w-72" : "w-0"
      }`}
    >
      <div className="p-6 h-full relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-extralight">
            <Link href="/">
              24HouR<span className="font-semibold">GPT</span>
            </Link>
          </h2>
          <button
            onClick={onCloseSidebar}
            className="p-1.5 rounded-full hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* New conversation button */}
        <button
          onClick={onCreateConversation}
          className="w-full border border-gray-800 rounded-sm p-3 text-left hover:bg-gray-900 transition mb-6 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Conversation
        </button>

        {/* Timer */}
        <SidebarTimer />

        {/* Conversation list */}
        <h3 className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-4">
          Conversations
        </h3>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-sm">No conversations yet</p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full text-left truncate p-3 rounded-sm hover:bg-gray-900 transition flex items-center ${
                  activeConversationId === conversation.id
                    ? "bg-gray-900 border-l-2 border-amber-500"
                    : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {conversation.title || "New Conversation"}
              </button>
            ))
          )}
        </div>

        {/* User profile */}
        <div className="pt-4 border-t border-gray-800 bg-black mt-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm mr-3">
              <UserButton />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userId || "User"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
