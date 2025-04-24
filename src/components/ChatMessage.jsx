import React from 'react'
import ChatbotIcon from './ChatbotIcon'

const ChatMessage = ({chat}) => {
  return (
    !chat.hideInChat && (
          <div className={`message ${chat.role === "system"? 'bot' : 'user' }-message ${chat.isError ? "error" : ""}`}>
            {chat.role === "system" && <ChatbotIcon />}
            <p className="message-text">{chat.text}
            </p>  
          </div>
    )
  )
}

export default ChatMessage