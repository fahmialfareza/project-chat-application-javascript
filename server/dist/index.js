"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const users_1 = require("./users");
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.default.Server(server);
app.use((0, cors_1.default)());
app.use(router_1.default);
io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = (0, users_1.addUser)({ id: socket.id, name, room });
        if (error)
            return callback(error);
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
                users: (0, users_1.getUsersInRoom)(user.room),
            });
        }
        callback();
    });
    socket.on("sendMessage", (message, callback) => {
        const user = (0, users_1.getUser)(socket.id);
        if (user) {
            io.to(user.room).emit("message", { user: user.name, text: message });
        }
        callback();
    });
    socket.on("disconnect", () => {
        const user = (0, users_1.removeUser)(socket.id);
        if (user) {
            io.to(user.room).emit("message", {
                user: "admin",
                text: `${user.name} has left.`,
            });
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: (0, users_1.getUsersInRoom)(user.room),
            });
        }
    });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}.`));
