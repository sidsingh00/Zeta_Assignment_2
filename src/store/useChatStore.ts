import { create } from 'zustand';
import { Message, Platform } from '../types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedPlatform: Platform | null;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setPlatform: (platform: Platform | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  selectedPlatform: null,
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setLoading: (loading) => set(() => ({
    isLoading: loading
  })),
  
  setPlatform: (platform) => set(() => ({
    selectedPlatform: platform
  })),
  
  clearMessages: () => set(() => ({
    messages: []
  }))
}));