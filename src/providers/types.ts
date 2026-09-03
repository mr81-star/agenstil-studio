// src/providers/types.ts
export interface ProviderAdapter {
  name: string;
  capability: string;
  priority: number;
  execute(input: any): Promise<GenerationResult>;
  validate(output: any): boolean;
  healthCheck(): Promise<boolean>;
}

export interface GenerationResult {
  status: 'COMPLETED' | 'FAILED' | 'WAITING_FOR_PROVIDER';
  url?: string;
  error?: string;
  metadata?: any;
}

export interface BrandAnalysis {
  name: string;
  niche: string;
  industry: string;
  audience: string;
  colors: string[];
  fonts: string[];
  tone: string;
  products: Array<{
    name: string;
    price?: number;
    category?: string;
  }>;
  services: Array<{
    name: string;
    price?: number;
  }>;
  screenshots: string[];
  analysis: any;
}
