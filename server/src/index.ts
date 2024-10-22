import http from "http";
import express from "express";
import socketio, { Socket } from "socket.io";
import cors from "cors";

import { addUser, removeUser, getUser, getUsersInRoom } from "./users";
import router from "./router";

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(cors());
app.use(router);

io.on("connection", (socket: Socket) => {
  socket.on(
    "join",
    (
      { name, room }: { name: string; room: string },
      callback: (error?: string) => void
    ) => {
      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) return callback(error);

      if (user) {
        socket.join(user.room);

        socket.emit("message", {
          user: "admin",
          text: `${user.name}, welcome to room ${user.room}.`,
        });
        socket.broadcast
          .to(user.room)
          .emit("message", { user: "admin", text: `${user.name} has joined!` });

        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }

      callback();
    }
  );

  socket.on("sendMessage", (message: string, callback: () => void) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", { user: user.name, text: message });
    }

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}.`));
