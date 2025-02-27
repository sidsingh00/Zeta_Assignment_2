import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  // Format the message content as markdown
  const formattedContent = isBot 
    ? DOMPurify.sanitize(marked.parse(message.content) as string)
    : message.content;
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
          <div className={`rounded-full p-2 ${isBot ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
            {isBot ? <Bot size={20} /> : <User size={20} />}
          </div>
        </div>
        
        <div className={`rounded-lg px-4 py-3 ${isBot ? 'bg-white border border-gray-200' : 'bg-indigo-600 text-white'}`}>
          {isBot ? (
            <div 
              className="chat-message-content"
              dangerouslySetInnerHTML={{ __html: formattedContent }} 
            />
          ) : (
            <p>{message.content}</p>
          )}
          <div className={`text-xs mt-1 ${isBot ? 'text-gray-400' : 'text-indigo-200'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default ChatMessage;