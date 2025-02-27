import lunr from 'lunr';
import { documentationData, getDocumentationByPlatform } from '../data/documentationData';
import { DocumentationItem, Platform, SearchResult } from '../types';

// Create a search index for the documentation
let searchIndex: lunr.Index;

// Initialize the search index
const initializeSearchIndex = () => {
  searchIndex = lunr(function() {
    this.field('title', { boost: 10 });
    this.field('content');
    this.field('platform');
    this.ref('id');
    
    // Add each document to the index
    documentationData.forEach(doc => {
      this.add({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        platform: doc.platform
      });
    });
  });
};

// Initialize the index when the module is loaded
initializeSearchIndex();

// Function to search the documentation
export const searchDocumentation = async (
  query: string, 
  platform: Platform | null
): Promise<SearchResult> => {
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Process the query to extract key terms
  const processedQuery = processQuery(query);
  
  // Search the index
  const searchResults = searchIndex.search(processedQuery);
  
  // Get the full documentation items for the search results
  const items = searchResults.map(result => {
    const doc = documentationData.find(d => d.id === result.ref);
    if (!doc) return null;
    
    // Filter by platform if specified
    if (platform && doc.platform !== platform) return null;
    
    return {
      ...doc,
      score: result.score
    };
  }).filter(Boolean) as DocumentationItem[];
  
  // If platform is specified, filter results
  const filteredItems = platform 
    ? items.filter(item => item.platform === platform)
    : items;
  
  // If no results are found, try a more general search
  if (filteredItems.length === 0) {
    // Get all docs for the platform or all platforms
    const allDocs = platform 
      ? getDocumentationByPlatform(platform)
      : documentationData;
    
    // Do a simple keyword match
    const keywords = processedQuery.split(' ');
    const matchedDocs = allDocs.filter(doc => {
      const content = (doc.title + ' ' + doc.content).toLowerCase();
      return keywords.some(keyword => content.includes(keyword.toLowerCase()));
    });
    
    return {
      items: matchedDocs.slice(0, 3),
      query: processedQuery
    };
  }
  
  return {
    items: filteredItems.slice(0, 5), // Limit to top 5 results
    query: processedQuery
  };
};

// Helper function to process the query
const processQuery = (query: string): string => {
  // Extract key terms from the query
  const howToPattern = /how\s+(?:do|can|to|would|should|could)\s+(?:i|we|you|one)\s+(.*?)(?:\?|$)/i;
  const match = query.match(howToPattern);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // Remove common words and punctuation
  return query
    .replace(/[^\w\s]/g, ' ')
    .replace(/\b(?:how|to|do|can|i|we|you|one|the|a|an|in|on|at|is|are|was|were|be|been|being|will|would|should|could|for|of|with)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Function to check if a query is relevant to CDPs
export const isRelevantToCDP = (query: string): boolean => {
  const cdpKeywords = [
    'segment', 'mparticle', 'lytics', 'zeotap', 'cdp', 'customer data platform',
    'source', 'destination', 'integration', 'audience', 'user profile', 'event',
    'tracking', 'data collection', 'identity', 'segment', 'campaign'
  ];
  
  const lowerQuery = query.toLowerCase();
  
  return cdpKeywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()));
};