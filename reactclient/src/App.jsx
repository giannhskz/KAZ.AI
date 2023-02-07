import React, { useState, useRef, useEffect } from "react";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const ChatApp = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e, messageRef) => {
    e.preventDefault();
    setLoading(true);
    if (loading) {
      loader(messageRef);
    }
    setMessages([
      ...messages,
      {
        isAi: false,
        value,
      },
    ]);
    const response = await fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();

      setMessages([
        ...messages,
        {
          isAi: false,
          value,
        },
        {
          isAi: true,
          value: parsedData,
        },
      ]);
    } else {
      const err = await response.text();
      alert(err);
    }

    setLoading(false);
    setValue("");
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const chatStripe = (isAi, value) => (
    <div className={`wrapper ${isAi ? "ai" : ""}`}>
      <div className="chat">
        <div className="profile">
          <img src={isAi ? bot : user} alt={isAi ? "bot" : "user"} />
        </div>
        <div className="message">{value}</div>
      </div>
    </div>
  );


  return (
    <div id="app">
  <div id="chat_container">
    {messages.map((message, index) =>
      chatStripe(message.isAi, message.value)
    )}
  </div>

  <form onSubmit={handleSubmit}>
      <textarea
        name="prompt"
        rows="1"
        cols="1"
        placeholder="Ask KAZ.AI..."
        value={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
    <button type="submit">
      <img src="assets/send.svg" alt="send" />
    </button>
  </form>
</div>

  );
};

export default ChatApp;

