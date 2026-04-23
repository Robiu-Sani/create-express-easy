# Complete Documentation: AI-Powered Chatbot System with Gemini AI

## Table of Contents
1. Overview of the Chatbot System
2. How the Chatbot Works
3. Configuration and Setup
4. Training Your Chatbot
5. Knowledge Base Management
6. API Reference
7. Complete Usage Examples
8. Language Detection System
9. Page Navigation System
10. AI Response Generation
11. Integration with Express.js
12. Testing and Debugging
13. Advanced Customization
14. Best Practices
15. Troubleshooting Guide

---

## Overview of the Chatbot System

This AI-powered chatbot system integrates Google's Gemini AI with your Express.js application to create an intelligent conversational assistant. The chatbot understands user queries in multiple languages, searches through your knowledge base, and provides concise, helpful responses with suggested page navigation.

### Key Features

Multi-language support for English, Bangla, Arabic, Hindi, and Urdu. Automatic language detection without user configuration. Smart page suggestion based on user queries. Configurable response length between 10 to 40 words. Knowledge base that can hold up to 5000 words of business information. Contact information integration for support requests. Fallback responses when AI service is unavailable. Response time tracking for performance monitoring.

### How the System Works

The user sends a prompt to the chatbot endpoint. The system detects the user's language automatically. It searches through your knowledge base for relevant information. Relevant page suggestions are generated based on the query. Gemini AI generates a conversational response following your length and style rules. The response returns with suggested pages and metadata.

---

## How the Chatbot Works

### Step by Step Flow

The user submits a prompt through the chat interface. The controller validates the prompt and checks for empty or invalid input. The service function detects the language of the prompt using regex patterns.

The system searches through your knowledge base information to find relevant content. It also matches the query against your client-side page list to suggest relevant navigation pages.

The system builds a comprehensive system prompt for Gemini AI including your knowledge base, relevant pages, contact information, and response rules. Gemini generates a response following your configured length and style guidelines.

The response is cleaned and formatted. Page links are added naturally when relevant. The final response returns to the user with metadata including success status, response time, source count, and suggested pages.

### Architecture Overview

The chatbot consists of three main components. The controller handles HTTP requests and responses. The service contains all business logic including language detection, page matching, and AI integration. The configuration file holds your knowledge base, page list, contact methods, and response settings.

---

## Configuration and Setup

### Step 1: Install Required Dependencies

You need the Google Gemini AI package for Node.js.

```bash
npm install @google/genai
```

### Step 2: Get Gemini API Key

Visit Google AI Studio at makersuite.google.com. Sign in with your Google account. Click on Get API Key. Create a new API key. Copy the key to your environment variables.

### Step 3: Configure Environment Variables

Add your Gemini API key to your .env file.

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Update Your Config File

Add the Gemini API key to your config index file.

```typescript
// config/index.ts
export default {
  gemini_api_key: process.env.GEMINI_API_KEY,
  // other configurations
};
```

### Step 5: Configure Client Side Pages

Update the CLIENT_SIDE_PAGES array with all your website pages. Each page needs a name and a path. The name is what users see and what the AI uses for suggestions. The path is the actual URL route.

### Step 6: Build Your Knowledge Base

The KNOWLEDGE_BASE_INFO is the most important configuration. This is where you put all information about your business, products, services, policies, and FAQs. The AI reads this to answer user questions.

### Step 7: Set Up Contact Methods

Update the CONTACT_METHODS object with all your contact information. Include email, phone, social media links, address, and support hours.

### Step 8: Configure Response Settings

Adjust the RESPONSE_CONFIG to match your brand voice. Set maxWords between 30 to 50 for optimal user experience. Set responseStyle to conversational, professional, or friendly. Choose whether to include page links and contact information.

---

## Training Your Chatbot

### What Training Means for This Chatbot

Unlike traditional machine learning models, this chatbot does not require training on custom datasets. The Gemini AI model is already pre-trained by Google. Your job is to provide high-quality knowledge base information. The better your knowledge base, the better the responses.

### How to Write Effective Knowledge Base Content

Write in clear, complete sentences. Use natural language that matches how users ask questions. Organize information with clear headings. Include specific details like prices, dates, and policies.

Your knowledge base should answer the questions users actually ask. Think about what customers want to know. Include product specifications, service details, pricing information, operating hours, return policies, and common troubleshooting steps.

### Knowledge Base Structure Template

Start with your company name, mission, and vision. Write a detailed about us section explaining your history and values. List every service or product with descriptions, features, benefits, and pricing.

Explain how your service works step by step. List all features and their benefits to customers. Describe every pricing plan with exact amounts and included features.

Add frequently asked questions with thorough answers. Include all policies like returns, shipping, privacy, and terms. List achievements, awards, and milestones. Add customer testimonials with real quotes.

Include support information like hours, response times, and languages. Add troubleshooting guides for common issues. List integrations with other platforms. Share your product roadmap and recent updates.

### Knowledge Base Length Guidelines

The system can handle up to 5000 words. Aim for 3000 to 4000 words for optimal performance. Too little information results in vague responses. Too much information may exceed token limits.

### Updating Knowledge Base Over Time

Your knowledge base should grow with your business. Add new products when they launch. Update pricing when it changes. Add new FAQs based on customer questions. Remove outdated information.

---

## Knowledge Base Management

### Writing Effective Content for AI

Use complete sentences with proper grammar. Avoid jargon unless you define it. Be specific rather than general. Include numbers, dates, and prices whenever possible.

The AI understands natural language best. Write as if you are explaining to a human. Use examples to illustrate complex concepts. Break long paragraphs into shorter ones.

### Example Knowledge Base Entry for an E-commerce Store

Company Name: TechGadgets Store. Established in 2020. Mission to provide affordable electronics with excellent customer service.

Products include wireless headphones with 20 hour battery life for 49 dollars. Smart watches with heart rate monitoring for 89 dollars. Phone cases compatible with iPhone and Samsung for 15 dollars.

Shipping takes 3 to 5 business days. Free shipping on orders over 50 dollars. Returns accepted within 30 days with original packaging.

Support hours are Monday to Friday 9 AM to 6 PM Eastern Time. Email support at help at techgadgets.com. Phone support at 1 800 555 1234.

### Example Knowledge Base Entry for a Service Business

Company Name: DigitalMarketing Pro. Founded in 2018. We help small businesses grow through social media marketing.

Services include social media management starting at 500 dollars per month. Content creation packages from 300 dollars monthly. SEO optimization starting at 400 dollars per month.

Our process starts with a free consultation. Then we create a custom strategy. We implement and monitor results. Monthly reports show your growth.

Pricing plans include Basic for 500 dollars with 10 posts monthly. Pro for 800 dollars with 20 posts and ads management. Enterprise custom pricing for large businesses.

### Testing Your Knowledge Base

After writing your knowledge base, test it with real user questions. Ask about your products and see if the AI gives correct answers. Ask about policies and verify accuracy. Ask about pricing and check for correct amounts.

Refine your knowledge base based on test results. Add missing information. Clarify vague statements. Remove contradictory information.

---

## API Reference

### Function: ChatBotController

This controller handles incoming HTTP requests for the chatbot.

**Endpoint:** POST /api/v1/chatbot

**Request Body:** { prompt: "user question here" }

**Success Response:** { success: true, statusCode: 200, message: "AI response generated successfully", data: { aiResponse, foundResults, sourceCount, sources, language } }

**Error Response:** { success: false, statusCode: 400, message: "Prompt is required", data: null }

### Function: ChatBotFunction

The core service function that processes prompts and returns responses.

**Parameters:** prompt is a string containing the user's question

**Returns:** Promise resolving to ChatResponse object with success flag, response text, foundResults boolean, suggestedPages array, contactInfo object, and responseTime number

### Function: detectLanguage

Automatically detects the language of user input.

**Supported Languages:** English, Bangla, Arabic, Hindi, Urdu

**Returns:** String representing detected language code

### Function: findRelevantPages

Matches user query against your client-side pages to suggest navigation.

**Parameters:** query is the user's prompt string

**Returns:** Array of page matches sorted by relevance score

### Function: generateAIResponse

Calls Gemini AI to generate a conversational response.

**Parameters:** prompt is user question, language is detected language, relevantPages are matched pages

**Returns:** Object containing response text and suggested pages

### Function: formatContactInfo

Converts your contact methods object into formatted text for AI context.

**Returns:** String with all contact methods formatted with emojis

### Function: generateFallbackResponse

Provides a default response when AI service is unavailable.

**Parameters:** language is detected language, prompt is original question

**Returns:** String with fallback response in detected language

---

## Complete Usage Examples

### Example 1: Basic Chatbot Integration in Express

Create your chatbot router file.

```typescript
// module/chatbot/chatbot.router.ts
import express from 'express';
import { ChatBotController } from './chatbot.controller';

const router = express.Router();

// Send a message to the chatbot
router.post('/message', ChatBotController);

// Get chatbot status and configuration
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Chatbot is active',
    supportedLanguages: ['English', 'Bangla', 'Arabic', 'Hindi', 'Urdu'],
    responseTime: '< 2 seconds'
  });
});

export const chatbotRouter = router;
```

### Example 2: Frontend Integration with Fetch API

Create a simple chat interface in your frontend.

```javascript
// chat.js
async function sendMessageToChatbot(userMessage) {
  try {
    const response = await fetch('/api/v1/chatbot/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userMessage })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('AI Response:', result.data.aiResponse);
      console.log('Suggested Pages:', result.data.sources);
      console.log('Language:', result.data.language);
      return result.data;
    } else {
      console.error('Error:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// Example usage
sendMessageToChatbot('What products do you offer?');
```

### Example 3: React Component Integration

Create a reusable chat component in React.

```jsx
// ChatbotComponent.jsx
import React, { useState } from 'react';

function ChatbotComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/v1/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const aiMessage = {
          role: 'assistant',
          content: result.data.aiResponse,
          sources: result.data.sources,
          language: result.data.language
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
            {msg.sources && (
              <div className="suggested-pages">
                Suggested: {msg.sources.map(s => s.name).join(', ')}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="loading">AI is thinking...</div>}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
```

### Example 4: Multi-Language Testing

Test the chatbot with different languages.

```javascript
// Test different languages
const testQueries = [
  { language: 'English', query: 'Tell me about your services' },
  { language: 'Bangla', query: 'আপনার সেবা সম্পর্কে বলুন' },
  { language: 'Arabic', query: 'أخبرني عن خدماتك' },
  { language: 'Hindi', query: 'अपनी सेवाओं के बारे में बताएं' },
];

for (const test of testQueries) {
  const response = await sendMessageToChatbot(test.query);
  console.log(`${test.language} Response:`, response.aiResponse);
}
```

### Example 5: Getting Page Suggestions

Use the helper function to get page suggestions for navigation.

```typescript
// In your navigation component
import { getPageSuggestions } from './chatbot.service';

function handleUserSearch(query: string) {
  const suggestions = getPageSuggestions(query);
  
  suggestions.forEach(suggestion => {
    console.log(`Check out ${suggestion.name} at ${suggestion.path}`);
  });
  
  // Redirect or show suggested links
  return suggestions;
}
```

### Example 6: Quick Reply for Simple Queries

Use the quickReply function for simple responses without full metadata.

```typescript
import { quickReply } from './chatbot.service';

async function handleQuickQuestion(question: string) {
  const shortAnswer = await quickReply(question);
  console.log('Quick answer:', shortAnswer);
  return shortAnswer;
}
```

### Example 7: Monitoring Response Times

Track chatbot performance for analytics.

```typescript
// In your analytics service
async function trackChatbotPerformance(prompt: string) {
  const startTime = performance.now();
  const result = await ChatBotFunction(prompt);
  const endTime = performance.now();
  
  console.log({
    promptLength: prompt.length,
    responseLength: result.response.length,
    responseTime: result.responseTime,
    totalLatency: endTime - startTime,
    success: result.success,
    foundResults: result.foundResults
  });
  
  return result;
}
```

---

## Language Detection System

### How Language Detection Works

The detectLanguage function uses regular expressions to identify character ranges. Bangla characters fall within the Unicode range u0980 to u09FF. Arabic characters are in u0600 to u06FF. Hindi characters are in u0900 to u097F. Urdu characters are in u0600 to u06FF and u0750 to u077F.

If none of these ranges match, English is the default language.

### Adding New Languages

To add a new language, extend the detectLanguage function with new regex patterns. Find the Unicode range for your target language. Add a new condition to check for that range. Return the language code. Update the fallback responses to include the new language.

### Language-Specific Response Generation

The AI receives the detected language in its system prompt. It generates responses in that exact language. This ensures users receive responses in their preferred language without any configuration.

---

## Page Navigation System

### How Page Matching Works

The findRelevantPages function analyzes the user query against your page list. It checks for direct page name matches first. Then it checks individual words from the query against page names. Finally, it uses synonym mapping to catch related terms.

Each match gets a relevance score. Higher scores indicate stronger relevance. The function returns the top three most relevant pages.

### Synonym Mapping

The system includes built-in synonyms for common page types. Contact maps to reach, call, email, phone, support. About maps to company, us, team, story. Services maps to offer, provide, solution, feature. Products maps to item, goods, merchandise.

You can extend the synonym list by adding more mappings to the synonyms object.

### Customizing Page Suggestions

To change how pages are suggested, modify the relevance scoring weights. Increase the weight for exact matches to prioritize direct page references. Decrease weights for partial matches to reduce false positives. Add custom synonyms for your specific business terms.

---

## AI Response Generation

### System Prompt Structure

The system prompt sent to Gemini includes multiple sections. Critical rules define response length, style, language, and behavior guidelines. The knowledge base provides all your business information. Relevant pages show which pages match the query. Contact information provides support channels. The user question is the actual prompt.

### Response Length Control

The system enforces strict word count limits. The AI receives explicit instructions to respond within the configured range. Responses are trimmed and cleaned after generation. Page suggestions are added naturally without exceeding length limits.

### Response Style Options

Conversational style sounds like a friendly human assistant. Professional style uses formal language and complete sentences. Friendly style is warm and welcoming with occasional exclamation points.

### Handling AI Failures

If Gemini AI fails to respond, the system uses fallback responses. Fallback responses are language-specific and include contact information. The user never sees technical error messages.

---

## Integration with Express.js

### Complete Router Setup

Add the chatbot router to your version router.

```typescript
// routers/v1/index.ts
import { chatbotRouter } from '../../module/chatbot/chatbot.router';

const moduleRoutes = [
  {
    path: '/chatbot',
    route: chatbotRouter,
    description: 'AI-powered chatbot for user assistance'
  },
  // other routes
];
```

### Rate Limiting for Chatbot

Add rate limiting to prevent abuse.

```typescript
import rateLimit from 'express-rate-limit';

const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many messages. Please wait a moment.'
});

router.post('/message', chatbotLimiter, ChatBotController);
```

### Request Validation

Add validation middleware for better error handling.

```typescript
import { body, validationResult } from 'express-validator';

const validatePrompt = [
  body('prompt')
    .isString()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Prompt must be between 1 and 500 characters'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: errors.array()[0].msg,
        data: null
      });
    }
    next();
  }
];

router.post('/message', validatePrompt, ChatBotController);
```

---

## Testing and Debugging

### Testing the Chatbot Directly

Create a test script to verify functionality.

```typescript
// test/chatbot.test.ts
import { ChatBotFunction } from '../module/chatbot/chatbot.service';

async function testChatbot() {
  const testCases = [
    { prompt: 'What services do you offer?', expectedContains: ['service'] },
    { prompt: 'How can I contact support?', expectedContains: ['email', 'phone'] },
    { prompt: 'Tell me about pricing', expectedContains: ['price', 'plan'] },
    { prompt: 'আপনার সেবা কি কি?', expectedContains: [], language: 'bangla' },
  ];
  
  for (const testCase of testCases) {
    const result = await ChatBotFunction(testCase.prompt);
    console.log(`\nPrompt: ${testCase.prompt}`);
    console.log(`Response: ${result.response}`);
    console.log(`Success: ${result.success}`);
    console.log(`Response Time: ${result.responseTime}ms`);
    console.log(`Suggested Pages:`, result.suggestedPages);
    console.log('---');
  }
}

testChatbot();
```

### Debugging Common Issues

Enable detailed logging during development.

```typescript
// Add to chatbot.service.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log(`[Chatbot] Prompt: ${prompt}`);
  console.log(`[Chatbot] Detected language: ${language}`);
  console.log(`[Chatbot] Relevant pages:`, relevantPages);
  console.log(`[Chatbot] Response time: ${responseTime}ms`);
}
```

### Monitoring Dashboard

Create a simple monitoring endpoint.

```typescript
router.get('/metrics', async (req, res) => {
  const metrics = {
    status: 'healthy',
    responseTime: averageResponseTime,
    totalRequests: requestCount,
    successRate: (successCount / requestCount) * 100,
    languageDistribution: languageStats,
    popularQueries: topQueries
  };
  res.json(metrics);
});
```

---

## Advanced Customization

### Adding Custom Response Rules

Extend the system prompt with custom rules for your business.

```typescript
const customRules = `
SPECIFIC BUSINESS RULES:
- Never discuss competitor products
- Always mention free shipping on orders over $50
- For refund questions, direct to returns page
- For technical issues, offer to create support ticket
`;

const systemPrompt = basePrompt + customRules;
```

### Implementing Conversation Memory

Store conversation history for context.

```typescript
interface ConversationContext {
  userId: string;
  history: { role: string; content: string }[];
  lastIntent: string;
}

const conversationStore = new Map<string, ConversationContext>();

async function chatWithMemory(userId: string, prompt: string) {
  let context = conversationStore.get(userId);
  if (!context) {
    context = { userId, history: [], lastIntent: '' };
    conversationStore.set(userId, context);
  }
  
  context.history.push({ role: 'user', content: prompt });
  const result = await ChatBotFunction(prompt);
  context.history.push({ role: 'assistant', content: result.response });
  
  return result;
}
```

### Adding Sentiment Analysis

Analyze user sentiment to adjust responses.

```typescript
function detectSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry'];
  const positiveWords = ['good', 'great', 'excellent', 'love', 'happy'];
  
  const lowerText = text.toLowerCase();
  if (negativeWords.some(word => lowerText.includes(word))) return 'negative';
  if (positiveWords.some(word => lowerText.includes(word))) return 'positive';
  return 'neutral';
}

// Use in response generation
const sentiment = detectSentiment(prompt);
if (sentiment === 'negative') {
  systemPrompt += ` The user seems upset. Apologize and be extra helpful.`;
}
```

---

## Best Practices

### Knowledge Base Maintenance

Update your knowledge base weekly based on user questions. Add new information immediately when products or policies change. Remove outdated information promptly. Keep information consistent across all sections.

### Response Quality Monitoring

Log all chatbot interactions for quality review. Review conversations weekly to identify gaps in knowledge. Add missing information to your knowledge base. Track which questions the AI answers poorly and improve those sections.

### Rate Limiting and Throttling

Implement rate limiting per user to prevent abuse. Set higher limits for authenticated users. Return friendly messages when limits are exceeded. Monitor usage patterns to detect bots.

### Security Considerations

Never include sensitive information like passwords or API keys in the knowledge base. Sanitize user inputs before processing. Implement content filtering for inappropriate queries. Log all interactions for audit purposes.

### Performance Optimization

Cache knowledge base content in memory. Use connection pooling for AI API calls. Implement response caching for identical questions. Monitor response times and set timeout thresholds.

---

## Troubleshooting Guide

### Issue: Gemini API Key Not Working

Solution: Verify the API key is correct in your environment variables. Check that the key has billing enabled. Ensure you have not exceeded free tier limits.

### Issue: Chatbot Not Responding in Correct Language

Solution: Verify the language detection regex patterns. Check that your knowledge base contains content in that language. The AI generates responses based on knowledge base language.

### Issue: Responses Too Long or Too Short

Solution: Adjust the minWords and maxWords in RESPONSE_CONFIG. The AI strictly follows these limits. Verify the configuration is being passed correctly.

### Issue: Page Suggestions Not Appearing

Solution: Check that your CLIENT_SIDE_PAGES array is populated correctly. Verify the user query contains relevant keywords. The synonym mapping may need expansion for your specific terms.

### Issue: AI Response Seems Generic

Solution: Your knowledge base may be too vague. Add more specific information with examples. Include exact prices, dates, and names. The AI can only respond with information you provide.

### Issue: High Response Times

Solution: Reduce knowledge base length if over 5000 words. Implement response caching for common questions. Check your internet connection to Gemini API.

---

## Summary

This AI-powered chatbot system provides a complete solution for adding intelligent conversation to your Express.js application.

**Key components to configure:** Client side pages for navigation suggestions. Knowledge base with 3000 to 5000 words of business information. Contact methods for support requests. Response configuration for length and style.

**How training works:** No model training required. Just write high-quality knowledge base content. The AI reads your content to answer questions. Update content regularly as your business evolves.

**Basic usage pattern:**
```typescript
router.post('/chatbot', ChatBotController);
```

The system handles language detection, page matching, AI response generation, and fallback responses automatically. Your only job is to provide accurate, complete information in the knowledge base.
