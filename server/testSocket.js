import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL); // change port if needed

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  // Test room join
  socket.emit("joinRoom", "test-room");
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});