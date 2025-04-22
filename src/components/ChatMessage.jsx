import React from 'react'
import ChatbotIcon from './ChatbotIcon'

const ChatMessage = ({chat}) => {
  return (
    !chat.hideInChat && (
          <div className={`message ${chat.role === "assistant"? 'bot' : 'user' }-message ${chat.isError ? "error" : ""}`}>
            {chat.role === "assistant" && <ChatbotIcon />}
            <p className="message-text">{chat.text}
            </p>  
          </div>
    )
  )
}

export default ChatMessage