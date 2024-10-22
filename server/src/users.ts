// src/users.ts

// Define the User interface
interface User {
  id: string;
  name: string;
  room: string;
}

// Create an array to store users
const users: User[] = [];

// Add a user to the users array
export const addUser = ({
  id,
  name,
  room,
}: {
  id: string;
  name: string;
  room: string;
}): { error?: string; user?: User } => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Check if the user already exists
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  // Create a new user
  const user: User = { id, name, room };

  // Add the new user to the users array
  users.push(user);

  return { user };
};

// Remove a user from the users array
export const removeUser = (id: string): User | undefined => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    // Remove the user from the array and return the removed user
    return users.splice(index, 1)[0];
  }

  return undefined;
};

// Get a user by their id
export const getUser = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

// Get all users in a specific room
export const getUsersInRoom = (room: string): User[] => {
  return users.filter((user) => user.room === room);
};
