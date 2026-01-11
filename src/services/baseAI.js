import { LRUCache } from '../utils/performance.js';

export class BaseAI {
  static cache = new LRUCache(500);
  static cacheTTL = 300000; // 5 minutes
  
  static getMockResponse(prompt, systemPrompt) {
    // Provide realistic mock responses based on prompt content
    if (prompt.toLowerCase().includes('crop') || prompt.toLowerCase().includes('disease')) {
      return JSON.stringify({
        cropType: "Tomato",
        healthScore: 75,
        diseases: ["Early Blight"],
        treatments: ["Apply copper-based fungicide", "Improve air circulation"],
        confidence: 0.8
      });
    }
    
    if (prompt.toLowerCase().includes('soil')) {
      return JSON.stringify({
        soilType: "Loamy",
        pH: 6.5,
        healthScore: 80,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium"
        },
        suitableCrops: ["Tomatoes", "Peppers", "Lettuce"]
      });
    }
    
    if (prompt.toLowerCase().includes('market')) {
      return JSON.stringify({
        marketTrends: "Stable",
        priceOutlook: "Positive",
        demandLevel: "High",
        recommendations: ["Focus on organic produce", "Consider direct-to-consumer sales"]
      });
    }
    
    // Default response
    return JSON.stringify({
      status: "success",
      message: "Mock response - Please configure API keys for full functionality",
      data: {}
    });
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim()
                .substring(0, 10000);
  }

  // Enhanced cache with TTL and size limits
  static getCacheKey(prompt, systemPrompt) {
    try {
      // Use a simple hash instead of btoa to avoid encoding issues
      const combined = (prompt + systemPrompt).replace(/[^\x00-\x7F]/g, '');
      return combined.substring(0, 50) + '_' + combined.length;
    } catch (error) {
      return 'fallback_' + Date.now();
    }
  }

  static getCachedResult(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  static setCachedResult(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  static async callAPI(prompt, systemPrompt = '', priority = 'normal') {
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!API_KEY || API_KEY === 'your_openrouter_api_key_here') {
      console.warn('OpenRouter API key not configured. Using mock response.');
      return this.getMockResponse(prompt, systemPrompt);
    }

    const sanitizedPrompt = this.sanitizeInput(prompt);
    const sanitizedSystemPrompt = this.sanitizeInput(systemPrompt);

    if (!sanitizedPrompt) {
      throw new Error('Invalid or empty prompt provided');
    }

    // Check cache first
    const cacheKey = this.getCacheKey(sanitizedPrompt, sanitizedSystemPrompt);
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const messages = [
      ...(sanitizedSystemPrompt ? [{ role: "system", content: sanitizedSystemPrompt }] : []),
      { role: "user", content: sanitizedPrompt }
    ];

    // Direct API call without load balancer for simplicity
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages: messages,
          max_tokens: 3000,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        console.warn('API call failed, using mock response');
        return this.getMockResponse(prompt, systemPrompt);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      if (!content) {
        return this.getMockResponse(prompt, systemPrompt);
      }
      
      this.setCachedResult(cacheKey, content);
      return content;
    } catch (error) {
      console.warn('API error, using mock response:', error.message);
      return this.getMockResponse(prompt, systemPrompt);
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