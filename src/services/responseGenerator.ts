import { DocumentationItem, Platform, SearchResult } from '../types';
import { isRelevantToCDP } from './searchService';

// Function to generate a response based on search results
export const generateResponse = async (
  query: string,
  searchResults: SearchResult,
  platform: Platform | null
): Promise<string> => {
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if the query is relevant to CDPs
  if (!isRelevantToCDP(query) && !isQueryAboutCDPs(query)) {
    return generateIrrelevantResponse(query);
  }
  
  // If no results found
  if (searchResults.items.length === 0) {
    return generateNoResultsResponse(query, platform);
  }
  
  // Generate response based on search results
  return generateResponseFromResults(query, searchResults, platform);
};

// Function to check if a query is about CDPs
const isQueryAboutCDPs = (query: string): boolean => {
  const cdpPlatforms = ['segment', 'mparticle', 'lytics', 'zeotap'];
  const lowerQuery = query.toLowerCase();
  
  return cdpPlatforms.some(platform => lowerQuery.includes(platform.toLowerCase()));
};

// Function to generate a response for irrelevant queries
const generateIrrelevantResponse = (query: string): string => {
  return `
I'm a specialized support agent for Customer Data Platforms (CDPs) including Segment, mParticle, Lytics, and Zeotap. 

Your question about "${query}" appears to be outside my area of expertise. I can help you with questions like:

- How to set up sources or destinations in these CDPs
- How to track events or create user profiles
- How to build audience segments
- How to integrate data with these platforms

Please feel free to ask any CDP-related questions, and I'll be happy to assist you!
  `;
};

// Function to generate a response when no results are found
const generateNoResultsResponse = (query: string, platform: Platform | null): string => {
  const platformText = platform 
    ? `for ${getPlatformDisplayName(platform)}` 
    : 'for any of our supported CDPs';
  
  return `
I couldn't find specific information ${platformText} about "${query}".

Here are some suggestions:
1. Try rephrasing your question with more specific CDP terminology
2. Check if you're using the correct feature name for the platform
3. Ask about a related feature that might accomplish what you're looking for

I can help with questions about:
- Setting up sources and destinations
- Tracking events and user data
- Creating segments and audiences
- Managing user profiles and identity

Would you like information about any of these topics instead?
  `;
};

// Function to generate a response from search results
const generateResponseFromResults = (
  query: string, 
  searchResults: SearchResult,
  platform: Platform | null
): string => {
  const { items } = searchResults;
  
  // If it's a comparison question
  if (isComparisonQuestion(query) && items.some(item => item.id.startsWith('comparison'))) {
    return generateComparisonResponse(items.filter(item => item.id.startsWith('comparison')));
  }
  
  // Get the most relevant result
  const topResult = items[0];
  
  // Extract the most relevant section from the content
  const relevantSection = extractRelevantSection(topResult.content, searchResults.query);
  
  // Generate the response
  let response = `## ${topResult.title}\n\n`;
  
  // Add the relevant section
  response += relevantSection;
  
  // Add a source reference
  response += `\n\n**Source:** [${getPlatformDisplayName(topResult.platform)} Documentation](${topResult.url})`;
  
  // If there are additional results, add them as related topics
  if (items.length > 1) {
    response += '\n\n### Related Topics\n\n';
    
    items.slice(1, 4).forEach(item => {
      response += `- [${item.title}](${item.url}) (${getPlatformDisplayName(item.platform)})\n`;
    });
  }
  
  return response;
};

// Function to check if a query is asking for a comparison
const isComparisonQuestion = (query: string): boolean => {
  const comparisonKeywords = [
    'compare', 'comparison', 'versus', 'vs', 'difference', 'differences',
    'better', 'best', 'worst', 'preferred', 'recommend'
  ];
  
  const lowerQuery = query.toLowerCase();
  
  return comparisonKeywords.some(keyword => lowerQuery.includes(keyword));
};

// Function to generate a comparison response
const generateComparisonResponse = (comparisonItems: DocumentationItem[]): string => {
  // Sort by relevance
  comparisonItems.sort((a, b) => (b.score || 0) - (a.score || 0));
  
  // Get the most relevant comparison
  const topComparison = comparisonItems[0];
  
  // Extract the comparison content
  const comparisonContent = topComparison.content;
  
  // Generate the response
  let response = `## ${topComparison.title}\n\n`;
  
  // Add the comparison content
  response += comparisonContent;
  
  // Add a source reference
  response += `\n\n**Source:** [CDP Comparison Documentation](${topComparison.url})`;
  
  return response;
};

// Function to extract the most relevant section from content
const extractRelevantSection = (content: string, query: string): string => {
  // Split the content into sections
  const sections = content.split(/#{2,3}\s+/);
  
  // If there's only one section, return it
  if (sections.length <= 2) {
    return sections.slice(1).join('\n\n## ');
  }
  
  // Score each section based on keyword matches
  const keywords = query.toLowerCase().split(/\s+/);
  
  const sectionScores = sections.map(section => {
    const lowerSection = section.toLowerCase();
    let score = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerSection.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    return { section, score };
  });
  
  // Sort sections by score
  sectionScores.sort((a, b) => b.score - a.score);
  
  // Get the top 2-3 sections
  const topSections = sectionScores
    .slice(0, 3)
    .filter(s => s.score > 0)
    .map(s => s.section);
  
  // If no sections matched, return the first 2 sections
  if (topSections.length === 0) {
    return sections.slice(1, 3).join('\n\n## ');
  }
  
  // Join the top sections
  return topSections.join('\n\n## ');
};

// Helper function to get a display name for a platform
const getPlatformDisplayName = (platform: Platform): string => {
  const displayNames: Record<Platform, string> = {
    segment: 'Segment',
    mparticle: 'mParticle',
    lytics: 'Lytics',
    zeotap: 'Zeotap'
  };
  
  return displayNames[platform] || platform;
};