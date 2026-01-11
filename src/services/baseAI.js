import { apiLoadBalancer } from './loadBalancer.js';
import { connectionPool } from './connectionPool.js';

export class BaseAI {
  static cache = new Map();
  
  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim()
                .substring(0, 10000);
  }

  static async callAPI(prompt, systemPrompt = '') {
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!API_KEY) {
      throw new Error('OpenRouter API key not found');
    }

    const sanitizedPrompt = this.sanitizeInput(prompt);
    const sanitizedSystemPrompt = this.sanitizeInput(systemPrompt);

    if (!sanitizedPrompt) {
      throw new Error('Invalid or empty prompt provided');
    }

    // Check cache first
    const cacheKey = btoa(sanitizedPrompt + sanitizedSystemPrompt).substring(0, 50);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const messages = [
      ...(sanitizedSystemPrompt ? [{ role: "system", content: sanitizedSystemPrompt }] : []),
      { role: "user", content: sanitizedPrompt }
    ];

    // Use connection pool + load balancer
    await connectionPool.acquire();
    
    const requestFn = async (endpoint) => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            model: "nvidia/nemotron-nano-9b-v2:free",
            messages: messages,
            max_tokens: 3000,
            temperature: 0.2
          })
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from AI model');
        }
        
        connectionPool.recordSuccess();
        return content;
      } catch (error) {
        connectionPool.recordFailure();
        throw error;
      } finally {
        connectionPool.release();
      }
    };

    try {
      const result = await apiLoadBalancer.queueRequest(requestFn);
      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('BaseAI API Error:', error);
      throw error;
    }
  }

  static parseJSON(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      try {
        // Extract JSON from code blocks
        const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          return JSON.parse(codeBlockMatch[1].trim());
        }
        
        // Find complete JSON objects with proper nesting
        const jsonMatches = response.match(/\{(?:[^{}]|\{[^{}]*\})*\}/g);
        if (jsonMatches) {
          for (let i = jsonMatches.length - 1; i >= 0; i--) {
            try {
              const parsed = JSON.parse(jsonMatches[i]);
              if (parsed && typeof parsed === 'object') {
                return parsed;
              }
            } catch (e) { continue; }
          }
        }
        
        // Look for JSON after specific keywords
        const afterJsonMatch = response.match(/(?:json|result|output)\s*:?\s*(\{[\s\S]*?\})/);
        if (afterJsonMatch) {
          return JSON.parse(afterJsonMatch[1]);
        }
        
        return null;
      } catch (parseError) {
        console.warn('JSON parsing failed, using fallback data:', parseError.message);
        return null;
      }
    }
  }
}