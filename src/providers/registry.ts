// src/providers/registry.ts
import { PrismaClient } from '@prisma/client';
import { ProviderAdapter, GenerationResult } from './types';

const prisma = new PrismaClient();

class ProviderRegistry {
  private adapters: Map<string, ProviderAdapter[]> = new Map();

  async registerAdapter(adapter: ProviderAdapter) {
    const key = adapter.capability;
    if (!this.adapters.has(key)) {
      this.adapters.set(key, []);
    }
    this.adapters.get(key)!.push(adapter);
    this.adapters.get(key)!.sort((a, b) => a.priority - b.priority);
  }

  async executeCapability(
    capability: string,
    input: any,
    generationId?: string
  ): Promise<GenerationResult> {
    const providers = this.adapters.get(capability) || [];

    for (const provider of providers) {
      try {
        const isHealthy = await provider.healthCheck();
        if (!isHealthy) {
          if (generationId) {
            await prisma.generation.update({
              where: { id: generationId },
              data: { status: 'WAITING_FOR_PROVIDER', error: `${provider.name} unavailable` },
            });
          }
          continue;
        }

        if (generationId) {
          await prisma.generation.update({
            where: { id: generationId },
            data: { status: 'RUNNING', provider: provider.name },
          });
        }

        const result = await provider.execute(input);

        if (result.status === 'COMPLETED' && provider.validate(result.url || '')) {
          return result;
        } else if (result.status === 'FAILED') {
          console.log(`Provider ${provider.name} failed, trying next...`);
          continue;
        }
      } catch (error) {
        console.error(`Provider ${provider.name} error:`, error);
        continue;
      }
    }

    return {
      status: 'FAILED',
      error: 'All providers exhausted',
    };
  }
}

export const registry = new ProviderRegistry();
