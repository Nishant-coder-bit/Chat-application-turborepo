import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hii there"]);
  const [input, setInput] = useState(""); // State for input
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // Updated WebSocket protocol

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]); // Functional state update
    };

    // Assign WebSocket to ref
    //@ts-ignore
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "Join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col justify-between">
      <div className="bg-blue-300 h-[80%] overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col m-4">
            {message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="w-full p-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={() => {
            //@ts-ignore
            wsRef.current.send(
              JSON.stringify({
                type: "Chat",
                payload: {
                  message: input,
                },
              })
            );
            setInput(""); // Clear input field after sending
          }}
          className="bg-purple-600 text-white px-4"
        >
          Send message
        </button>
      </div>
    </div>
  );
}

export default App;
