interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  citations?: string[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class PerplexityClient {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchInfluencers(query: string, followerThreshold: number = 10000): Promise<any> {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are a social media research assistant. Provide accurate, current information about TikTok influencers including their handles, follower counts, and contact information when available. Focus on UK-based or UK-relevant content creators.'
      },
      {
        role: 'user',
        content: `Find TikTok influencers focused on money saving, budgeting, frugal living, and financial tips who have at least ${followerThreshold} followers. Include their:
        - TikTok handle (@username)
        - Approximate follower count
        - Engagement rate if available
        - Other social media handles (Instagram, YouTube)
        - Contact information (email, business inquiries)
        - Bio/description
        - Recent popular content themes
        
        Query: ${query}`
      }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages,
          max_tokens: 1000,
          temperature: 0.2,
          top_p: 0.9,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'month',
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        citations: data.citations || [],
        usage: data.usage,
      };
    } catch (error) {
      console.error('Perplexity search error:', error);
      throw error;
    }
  }

  async getInfluencerDetails(handle: string): Promise<any> {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'Provide detailed, current information about the specified TikTok influencer. Include all available contact and social media information.'
      },
      {
        role: 'user',
        content: `Get detailed information about TikTok user ${handle}:
        - Current follower count
        - Recent engagement rates
        - Bio and content themes
        - Contact information (email, business inquiries)
        - Other social platforms
        - Recent viral content
        - Partnership history with brands
        - Location/country focus`
      }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages,
          temperature: 0.1,
          max_tokens: 800,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        citations: data.citations || [],
      };
    } catch (error) {
      console.error('Perplexity influencer details error:', error);
      throw error;
    }
  }
}

export { PerplexityClient };