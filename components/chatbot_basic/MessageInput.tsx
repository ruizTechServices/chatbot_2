"use client";

import React from "react";

import { Dispatch, SetStateAction } from "react";

interface MessageInputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ input, setInput, handleSubmit, loading }) => {
  return (
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
