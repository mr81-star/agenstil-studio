// src/providers/adapters/ollama.ts
import { ProviderAdapter, GenerationResult } from '../types';

class OllamaAdapter implements ProviderAdapter {
  name = 'ollama';
  capability = 'TEXT_LLM';
  priority = 0;
  baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  model = process.env.OLLAMA_LLM_MODEL || 'llama3.1:8b';

  async execute(input: { prompt: string }): Promise<GenerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: input.prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        return { status: 'FAILED', error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return {
        status: 'COMPLETED',
        url: data.response,
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
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ollamaAdapter = new OllamaAdapter();
