import React, { useRef } from 'react'

export const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {

  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    // Update chat history with user message
    setChatHistory(history => [...history, { role: "user", text: userMessage }]);

    //delay 600 ms before showing the thinking message and response
    setTimeout(() => {
      // Update chat history with "Thinking..." message
      setChatHistory(history => [...history, { role: "system", text: "Thinking..." }]);

      // Call function to generate bot response
      generateBotResponse([...chatHistory, { role: "system", text: `Using the details provided above, please address this query: ${userMessage}` }]);
    }, 600);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm