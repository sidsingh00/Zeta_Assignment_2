import React, { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import ChatMessage from './ChatMessage';
import { searchDocumentation } from '../services/searchService';
import { generateResponse } from '../services/responseGenerator';

const ChatInterface: React.FC = () => {
  const { messages, addMessage, isLoading, setLoading, selectedPlatform } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    });
    
    setInput('');
    setLoading(true);
    
    try {
      // Search for relevant documentation
      const searchResults = await searchDocumentation(input, selectedPlatform);
      
      // Generate response based on search results
      const response = await generateResponse(input, searchResults, selectedPlatform);
      
      // Add bot message
      addMessage({
        id: Date.now().toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      addMessage({
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <MessageSquareIcon className="h-16 w-16 mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">CDP Support Agent</h2>
            <p className="max-w-md">
              Ask me how-to questions about Segment, mParticle, Lytics, or Zeotap. 
              I'll help you find the information you need from their documentation.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
              <SampleQuestion question="How do I set up a new source in Segment?" />
              <SampleQuestion question="How can I create a user profile in mParticle?" />
              <SampleQuestion question="How do I build an audience segment in Lytics?" />
              <SampleQuestion question="How can I integrate my data with Zeotap?" />
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a how-to question about CDP platforms..."
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '150px' }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

const MessageSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01" />
    <path d="M12 10h.01" />
    <path d="M16 10h.01" />
  </svg>
);

interface SampleQuestionProps {
  question: string;
}

const SampleQuestion: React.FC<SampleQuestionProps> = ({ question }) => {
  const { addMessage, setLoading } = useChatStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      content: question,
      sender: 'user',
      timestamp: new Date()
    });
    
    setLoading(true);
    
    try {
      // Search for relevant documentation
      const searchResults = await searchDocumentation(question, null);
      
      // Generate response based on search results
      const response = await generateResponse(question, searchResults, null);
      
      // Add bot message
      addMessage({
        id: Date.now().toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      addMessage({
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
    >
      {question}
    </button>
  );
};

export default ChatInterface;