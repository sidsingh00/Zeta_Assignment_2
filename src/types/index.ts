export type Platform = 'segment' | 'mparticle' | 'lytics' | 'zeotap';

export type Sender = 'user' | 'bot';

export interface Message {
  id: string;
  content: string;
  sender: Sender;
  timestamp: Date;
}

export interface DocumentationItem {
  id: string;
  title: string;
  content: string;
  url: string;
  platform: Platform;
  score?: number;
}

export interface SearchResult {
  items: DocumentationItem[];
  query: string;
}