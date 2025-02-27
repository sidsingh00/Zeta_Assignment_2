import React from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import { useChatStore } from './store/useChatStore';

function App() {
  const { selectedPlatform, setPlatform } = useChatStore();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        selectedPlatform={selectedPlatform} 
        onSelectPlatform={setPlatform} 
      />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;