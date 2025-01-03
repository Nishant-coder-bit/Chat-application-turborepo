import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // For production, replace * with the allowed origin, e.g., "https://your-domain.com"
      methods: ["GET", "POST"],
    },
  });

  // Socket.io connection logic
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    // Listen for "send_message" event from the client
    socket.on("send_message", (message) => {
      console.log(`Message received from ${socket.id}:`, message);
      console.log("message",message.message);
      // Emit the message to all clients except the sender
      socket.broadcast.emit("recieve_message", {
        message: message.message,
        type: "otherMessage", 
      });


    });

    // Handle client disconnection
    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });

  // Start the server
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
