# CDP Support Agent Chatbot

A chatbot that answers "how-to" questions related to four Customer Data Platforms (CDPs): Segment, mParticle, Lytics, and Zeotap.

## Features

- Answer "how-to" questions about CDP platforms
- Extract information from documentation
- Handle variations in questions
- Cross-CDP comparisons
- Advanced "how-to" questions

## Tech Stack

### Frontend
- **React**: For building the user interface
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Vite**: For fast development and building
- **Lucide React**: For icons
- **React Markdown**: For rendering markdown responses

### Data Structure

The application uses the following data structures:

1. **Message Interface**:
   ```typescript
   interface Message {
     id: string;
     role: 'user' | 'assistant';
     content: string;
     timestamp: Date;
   }
   ```

2. **Chat State**:
   ```typescript
   interface ChatState {
     messages: Message[];
     isLoading: boolean;
     error: string | null;
   }
   ```

3. **CDP Information**:
   ```typescript
   interface CDPInfo {
     name: string;
     description: string;
     docsUrl: string;
     logo: string;
   }
   ```

### Document Indexing

In a production environment, this application would use a document indexing approach:

1. **Document Preprocessing**:
   - Scrape and extract content from CDP documentation
   - Split content into chunks
   - Create embeddings for each chunk

2. **Vector Database**:
   - Store document chunks and their embeddings
   - Enable semantic search capabilities

3. **Retrieval Process**:
   - Convert user query to embedding
   - Find semantically similar documents
   - Retrieve relevant information

4. **Response Generation**:
   - Use retrieved documents to generate accurate responses
   - Format responses with proper citations

For this demo, we're using mock responses based on keywords in the questions.

## Why This Tech Stack?

- **React + TypeScript**: Provides a robust foundation with type safety
- **Tailwind CSS**: Enables rapid UI development with utility classes
- **Vite**: Offers fast development experience and optimized builds
- **React Markdown**: Allows for rich text formatting in responses

## Future Improvements

1. **Real Document Indexing**: Implement actual document scraping and indexing
2. **Vector Database**: Add a vector database for semantic search
3. **LLM Integration**: Connect to an LLM for more natural responses
4. **User Feedback Loop**: Add ability for users to rate responses
5. **Multi-language Support**: Add support for multiple languages
6. **Conversation History**: Persist conversation history
7. **Authentication**: Add user authentication for personalized experiences

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Build for production: `npm run build`

## License

MIT 
