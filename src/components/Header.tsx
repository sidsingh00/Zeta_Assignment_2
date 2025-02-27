import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { Platform } from '../types';

interface HeaderProps {
  selectedPlatform: Platform | null;
  onSelectPlatform: (platform: Platform | null) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedPlatform, onSelectPlatform }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageSquareText className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-800">CDP Support Agent</h1>
        </div>
        
        <div className="flex space-x-2">
          <PlatformButton 
            name="Segment" 
            isSelected={selectedPlatform === 'segment'} 
            onClick={() => onSelectPlatform(selectedPlatform === 'segment' ? null : 'segment')} 
          />
          <PlatformButton 
            name="mParticle" 
            isSelected={selectedPlatform === 'mparticle'} 
            onClick={() => onSelectPlatform(selectedPlatform === 'mparticle' ? null : 'mparticle')} 
          />
          <PlatformButton 
            name="Lytics" 
            isSelected={selectedPlatform === 'lytics'} 
            onClick={() => onSelectPlatform(selectedPlatform === 'lytics' ? null : 'lytics')} 
          />
          <PlatformButton 
            name="Zeotap" 
            isSelected={selectedPlatform === 'zeotap'} 
            onClick={() => onSelectPlatform(selectedPlatform === 'zeotap' ? null : 'zeotap')} 
          />
          {selectedPlatform && (
            <button
              onClick={() => onSelectPlatform(null)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              All Platforms
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

interface PlatformButtonProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

const PlatformButton: React.FC<PlatformButtonProps> = ({ name, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm transition-colors ${
        isSelected 
          ? 'bg-indigo-100 text-indigo-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {name}
    </button>
  );
};

export default Header;