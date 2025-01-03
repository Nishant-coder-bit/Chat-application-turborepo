"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    reconnection: true,
    reconnectionAttempts: 5, // Max number of attempts
    reconnectionDelay: 1000, // Time between retries in ms
    reconnectionDelayMax: 5000 // Max delay between retries
  });
  

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { message: string; type: string }[]
  >([]);
  const [input, setInput] = useState("");

  useEffect(() => {
  
    socket.on("recieve_message", (message: { message: string; type: string }) => {
        console.log("Received message:", message); // Log to verify the structure
        if (typeof message.message === "string" && typeof message.type === "string") {
          setMessages((prev) => [...prev, message]);
        } else {
          console.error("Invalid message format:", message);
        }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("send_message", { message: input, type: "yourMessage" });
      setMessages((prev) => [
        ...prev,
        { message: input, type: "yourMessage" },
      ]);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-col bg-slate-700 text-white w-1/4 p-4">
        <h2 className="text-lg font-bold mb-4">Sidebar</h2>
        <p>Some content here...</p>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col w-3/4 bg-gray-100">
        {/* Chat Header */}
        <div className="p-4 flex flex-row justify-between bg-gray-200 border-b border-gray-300">
         
             <div>
                {/* {socket.id} */}
             </div>
              <div>
                 audio/video call icon
              </div>
            
           
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-4">
            {messages.map((messageObj, index) => (
              <li
                key={index}
                className={`flex ${
                  messageObj.type === "otherMessage" ? "justify-end" : "justify-start"

                }`}
              >
                <div
                  className={`p-3 rounded-lg shadow-md ${
                    messageObj.type === "otherMessage"
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {messageObj.message}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Input Section */}
        <div className="flex p-4 bg-gray-200 border-t border-gray-300">
          <input
            className="flex-grow p-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
