import React, { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

import "./Input.css";

interface InputProps {
  setMessage: (message: string) => void;
  sendMessage: (
    event: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>
  ) => void;
  message: string;
}

const Input: React.FC<InputProps> = ({ setMessage, sendMessage, message }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        onKeyPress={(event: KeyboardEvent<HTMLInputElement>) =>
          event.key === "Enter" ? sendMessage(event) : null
        }
      />
      <button
        className="sendButton"
        onClick={(e: MouseEvent<HTMLButtonElement>) => sendMessage(e)}
      >
        Send
      </button>
    </form>
  );
};

export default Input;
