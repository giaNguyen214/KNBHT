// lib/socket.ts
import { io } from "socket.io-client";

const socket_url = process.env.NEXT_PUBLIC_SOCKET_SERVER
const socket = io(socket_url, {
  transports: ["websocket"], // bắt buộc dùng websocket thuần
});

export default socket;
