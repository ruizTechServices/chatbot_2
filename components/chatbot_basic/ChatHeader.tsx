"use client";

import React from "react";

interface ChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  title: string;
  onExport: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  title,
  onExport,
}) => {
  return (
    <div className="bg-black border-b border-gray-800 p-4 flex justify-between items-center">
      {!sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-gray-800"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      <h1 className="text-xl font-light mx-auto truncate max-w-xs">{title}</h1>

      <button
        onClick={onExport}
        className="p-2 rounded-full hover:bg-gray-800"
        title="Export chat history"
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatHeader;
