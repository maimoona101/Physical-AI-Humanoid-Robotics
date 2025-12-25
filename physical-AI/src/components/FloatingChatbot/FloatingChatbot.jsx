import React, { useState } from "react";
import "./FloatingChatbot.css";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call backend POST /api/v1/queries endpoint (using the same API as QueryInterface)
      const response = await fetch("http://localhost:8000/api/v1/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage.text, top_k: 3 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        text:
          data.answers && data.answers.length > 0
            ? data.answers.map((a) => a.content).join("\n\n")
            : "Sorry, I could not process your request.",

        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Sorry, I could not connect to the server. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="floating-chatbot">
      {isOpen ? (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>RAG Assistant</span>
            <button className="chatbot-close" onClick={toggleChat}>
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="chatbot-welcome">
                Ask me anything about the content!
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`chatbot-message ${message.sender}-message`}
                >
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="chatbot-message bot-message">
                <div className="message-text">
                  <span className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="chatbot-input-area">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="chatbot-input"
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className="chatbot-send-button"
              disabled={isLoading || !inputValue.trim()}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button className="chatbot-button" onClick={toggleChat}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 15.01 3.02 16.35L2 22L7.65 20.98C8.99 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
              fill="white"
            />
            <path
              d="M9.5 14.5L6.5 16L8 12.5L11.5 11L9.5 14.5Z"
              fill="#4285F4"
            />
            <circle cx="15.5" cy="8.5" r="1.5" fill="#EA4335" />
            <circle cx="9.5" cy="8.5" r="1.5" fill="#FBBC05" />
            <circle cx="12.5" cy="11.5" r="1.5" fill="#34A853" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FloatingChatbot;
