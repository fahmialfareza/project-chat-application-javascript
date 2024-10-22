"use strict";
// src/users.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
// Create an array to store users
const users = [];
// Add a user to the users array
const addUser = ({ id, name, room, }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Check if the user already exists
    const existingUser = users.find((user) => user.room === room && user.name === name);
    if (!name || !room)
        return { error: "Username and room are required." };
    if (existingUser)
        return { error: "Username is taken." };
    // Create a new user
    const user = { id, name, room };
    // Add the new user to the users array
    users.push(user);
    return { user };
};
exports.addUser = addUser;
// Remove a user from the users array
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        // Remove the user from the array and return the removed user
        return users.splice(index, 1)[0];
    }
    return undefined;
};
exports.removeUser = removeUser;
// Get a user by their id
const getUser = (id) => {
    return users.find((user) => user.id === id);
};
exports.getUser = getUser;
// Get all users in a specific room
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};
exports.getUsersInRoom = getUsersInRoom;
