import React, { useEffect, useRef, useState } from 'react'
import ChatbotIcon from './components/ChatbotIcon'
import ChatForm from './components/ChatForm'
import ChatMessage from './components/ChatMessage';
import { companyInfo } from './components/companyInfo';

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      text: "👋 Welcome to the CPABC IT Support Chatbot! This chatbot is designed to assist co-op students with IT-related questions from the External IT Support Manual.\n\nBegin chatting by typing your question, and the chatbot will provide answers based on the manual’s content."
    },
    { hideInChat: true,
      role: "assistant", 
      text: companyInfo }
  ]);

  const [showChatbot, setShowChatBot] = useState([false]);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev =>
        [...prev.filter(msg => msg.text !== "Thinking..."), { role: "assistant", text, isError }]
      );
    };
  
    const messages = history
      .filter(msg => !msg.hideInChat)
      .map(({ role, text }) => ({ role, content: text }));
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_AZURE_OPENAI_ENDPOINT}openai/deployments/${import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${import.meta.env.VITE_AZURE_OPENAI_API_VERSION}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": import.meta.env.VITE_AZURE_OPENAI_KEY
          },
          body: JSON.stringify({
            messages: messages,
            max_completion_tokens: 1500
          })
        }
      );
  
      const data = await response.json();
      console.log("Azure OpenAI response:", data);
      if (!response.ok) throw new Error(data.error?.message || "Something went wrong!");
  
      const reply = data.choices[0].message.content?.trim() || "⚠️ No reply received.";   
         updateHistory(reply);
    } catch (err) {
      updateHistory(err.message, true);
    }
  };
  

  useEffect(() => {
    //autoscroll
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  },[chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatBot(prev => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">chat</span>
      </button>
      
      <div className="chatbot-popup">

        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">
              Chatbot
            </h2>
          </div>
          <button  onClick={() => setShowChatBot(prev => !prev)}  className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            {/*}
          <ChatbotIcon />
            <p className="message-text">
            </p>
                */}
          </div>

          {/* Renders chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat= {chat} />
          ))}

        </div>

        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory ={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  )
}

export default App