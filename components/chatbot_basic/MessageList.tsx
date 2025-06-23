"use client";

import React from "react";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#0c0c0c] to-[#0a0a0a]">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mb-4 w-16 h-16 rounded-full bg-amber-900/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-amber-500"
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
              className={`max-w-[75%] p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-gradient-to-r from-amber-800 to-amber-700 text-white"
                  : "bg-black border border-gray-800 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center mb-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 ${
                    message.role === "user"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-800 text-amber-500"
                  }`}
                >
                  {message.role === "user" ? "U" : "AI"}
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
  );
};

export default MessageList;
