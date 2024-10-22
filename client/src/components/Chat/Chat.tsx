import React, { useState, useEffect, SyntheticEvent } from "react";
import queryString from "query-string";
import { io, Socket } from "socket.io-client";

import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

import "./Chat.css";

const ENDPOINT = "https://project-chat-application.herokuapp.com/";

let socket: Socket;

interface Location {
  search: string;
}

interface Message {
  user: string;
  text: string;
}

interface RoomData {
  users: string[];
}

interface ChatProps {
  location: Location;
}

const Chat: React.FC<ChatProps> = ({ location }) => {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search) as {
      name: string;
      room: string;
    };

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error: string) => {
      if (error) {
        alert(error);
      }
    });
  }, [location.search]);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }: RoomData) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event: SyntheticEvent) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
