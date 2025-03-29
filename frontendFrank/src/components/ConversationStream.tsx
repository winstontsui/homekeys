"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, Cross, User, X } from "lucide-react";

// shadcn/ui components (make sure they're installed and configured in your project)
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Message {
  role: "assistant" | "user";
  text: string;
}

// Mock incoming messages
const mockStreamedMessages: Message[] = [
  {
    role: "assistant",
    text: "Hello! I'm your AI property finder. How can I help you today?",
  },
  {
    role: "user",
    text: "I'm looking for a 2-bedroom apartment in downtown Los Angeles.",
  },
  {
    role: "assistant",
    text: "Let me check for available listings... (searching)",
  },
  {
    role: "assistant",
    text: "I've found 37 matches! Any budget range you're considering?",
  },
  {
    role: "user",
    text: "My budget is around $2,500 per month.",
  },
  {
    role: "assistant",
    text: "Great, filtering those out... (searching)",
  },
  {
    role: "assistant",
    text: "Here are 12 matches that might fit your criteria!",
  },
];

// A single chat message row
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 p-4 border-b border-gray-200 last:border-none ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Icon on the left or right */}
      {!isUser && (
        <div className="text-blue-700">
          <Bot />
        </div>
      )}
      <div
        className={`rounded-lg p-3 ${
          isUser
            ? "bg-blue-100 text-blue-900 max-w-xs"
            : "bg-gray-100 text-gray-800 max-w-xs"
        }`}
      >
        {message.text}
      </div>
      {isUser && (
        <div className="text-blue-700">
          <User />
        </div>
      )}
    </div>
  );
};

export function ConversationStream({ setOpen }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageIndex = useRef(0);
  const [complete, setComplete] = useState(false);

  // Auto-scroll to bottom
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      // If we still have mock messages to push, add the next one
      if (messageIndex.current < mockStreamedMessages.length) {
        setMessages((prev) => [
          ...prev,
          mockStreamedMessages[messageIndex.current],
        ]);
        messageIndex.current += 1;
      } else {
        setComplete(true);
        clearInterval(interval);
      }
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="flex flex-col w-[28rem]">
      <div
        className={`flex justify-between border-b border-gray-200 p-4 items-center`}
      >
        <div className="text-xl font-semibold">Live Phone Conversation</div>
        <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
          <X className={`!w-[24px] !h-[24px]`} />
        </Button>
      </div>
      <ScrollArea ref={scrollRef} className="flex-1 overflow-auto">
        {messages.map((m, idx) => (
          <ChatMessage key={idx} message={m} />
        ))}
      </ScrollArea>
      {complete && (
        <div
          className={`p-4 border-t border-gray-200 flex flex-col items-center`}
        >
          <Button
            size="lg"
            className={`text-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200`}
          >
            <User />
            Login to Save Conversation
          </Button>
        </div>
      )}
    </Card>
  );
}
