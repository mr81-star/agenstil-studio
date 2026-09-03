// src/providers/adapters/groq.ts
import { ProviderAdapter, GenerationResult } from '../types';

class GroqAdapter implements ProviderAdapter {
  name = 'groq';
  capability = 'TEXT_LLM';
  priority = 2;
  apiKey = process.env.GROQ_API_KEY;
  model = 'mixtral-8x7b-32768';

  async execute(input: { prompt: string }): Promise<GenerationResult> {
    if (!this.apiKey) {
      return { status: 'FAILED', error: 'GROQ_API_KEY not configured' };
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: input.prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        return { status: 'FAILED', error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return {
        status: 'COMPLETED',
        url: data.choices[0].message.content,
        metadata: { model: this.model },
      };
    } catch (error) {
      return { status: 'FAILED', error: String(error) };
    }
  }

  validate(output: any): boolean {
    return typeof output === 'string' && output.length > 0;
  }

  async healthCheck(): Promise<boolean> {
    return !!this.apiKey;
  }
}

export const groqAdapter = new GroqAdapter();
