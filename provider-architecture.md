# AGENSTIL - PROVIDER ARCHITECTURE

## Provider Registry System

### ProviderAdapter Interface
```typescript
interface ProviderAdapter {
  name: string;
  capability: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ERROR';
  priority: number;
  execute(input: any): Promise<GenerationResult>;
  validate(output: any): boolean;
  getRequirements(): Requirements;
  healthCheck(): Promise<boolean>;
}
```

## Provider Registry

### TEXT_LLM Capability
| Provider | Model | Local | Free | Fallback | Status |
|----------|-------|-------|------|----------|--------|
| Ollama | llama3.1:8b | ✅ | ✅ | Primary | Cloud-Free |
| LMStudio | mistral-7b | ✅ | ✅ | Secondary | Cloud-Free |
| Groq | mixtral-8x7b | ❌ | ✅ | Tertiary | Free API |

### IMAGE_GENERATION Capability
| Provider | Model | Local | Free | Fallback | Status |
|----------|-------|-------|------|----------|--------|
| ComfyUI | SDXL | ✅ | ✅ | Primary | Open-Source |
| ComfyUI | Flux | ✅ | ✅ | Secondary | Open-Source |
| Tensor.Art | Flux | ❌ | ✅ | Tertiary | Free API |

### VIDEO_GENERATION Capability
| Provider | Model | Local | Free | Fallback | Status |
|----------|-------|-------|------|----------|--------|
| ComfyUI | AnimateDiff | ✅ | ✅ | Primary | Open-Source |
| FFmpeg | H.264 | ✅ | ✅ | Secondary | Open-Source |
| Tensor.Art | Video | ❌ | ✅ | Tertiary | Free API |

### AVATAR Capability
| Provider | Model | Local | Free | Fallback | Status |
|----------|-------|-------|------|----------|--------|
| SadTalker | v0.0.2 | ✅ | ✅ | Primary | Open-Source |
| Wav2Lip | Checkpoint | ✅ | ✅ | Secondary | Open-Source |
| D-ID | Premium | ❌ | ❌ | None | Paid |

### TTS Capability
| Provider | Model | Local | Free | Fallback | Status |
|----------|-------|-------|------|----------|--------|
| XTTS-v2 | Multi-lang | ✅ | ✅ | Primary | Open-Source |
| Coqui-TTS | VITS | ✅ | ✅ | Secondary | Open-Source |
| Edge-TTS | Azure | ❌ | ✅ | Tertiary | Free API |

### STT Capability
| Provider | Model | Local | Free | Fallback | Status |
|----------|-------|-------|------|----------|--------|
| Whisper.cpp | Base | ✅ | ✅ | Primary | Open-Source |
| Faster-Whisper | Distil | ✅ | ✅ | Secondary | Open-Source |
| Groq | Whisper | ❌ | ✅ | Tertiary | Free API |

### VISION Capability
| Provider | Model | Local | Free | Fallback | Status |
|----------|-------|-------|------|----------|--------|
| Ollama | llava | ✅ | ✅ | Primary | Open-Source |
| Ollama | qwen2-vl | ✅ | ✅ | Secondary | Open-Source |
| Groq | Vision | ❌ | ✅ | Tertiary | Free API |

### EMBEDDINGS Capability
| Provider | Model | Local | Free | Fallback | Status |
|----------|-------|-------|------|----------|--------|
| Ollama | nomic-embed | ✅ | ✅ | Primary | Open-Source |
| sentence-transformers | all-mpnet | ✅ | ✅ | Secondary | Open-Source |

### VIDEO_MERGE Capability
| Provider | Tool | Local | Free | Fallback | Status |
|----------|------|-------|------|----------|--------|
| FFmpeg | ffmpeg | ✅ | ✅ | Primary | Open-Source |
| MoviePy | moviepy | ✅ | ✅ | Secondary | Open-Source |

## Provider Selection Algorithm

```typescript
async function executeCapability(
  capability: string,
  input: any
): Promise<GenerationResult> {
  const providers = registry.getProviders(capability);
  
  for (const provider of providers.sortByPriority()) {
    const status = await provider.healthCheck();
    
    if (status !== 'AVAILABLE') {
      updateGeneration({ status: 'WAITING_FOR_PROVIDER' });
      continue;
    }
    
    try {
      const result = await provider.execute(input);
      
      if (!provider.validate(result)) {
        throw new Error('Output validation failed');
      }
      
      return result; // SUCCESS
    } catch (error) {
      logError(provider.name, error);
      // Try next provider
    }
  }
  
  return { status: 'FAILED', reason: 'All providers exhausted' };
}
```

## Provider Adapters Location
```
src/providers/
├── registry.ts              # Central provider registry
├── types.ts                 # ProviderAdapter interface
├── adapters/
│   ├── ollama.ts           # Ollama LLM + Vision + Embeddings
│   ├── comfyui.ts          # ComfyUI Image + Video
│   ├── groq.ts             # Groq LLM + Vision + STT
│   ├── tensor-art.ts       # Tensor.Art Image + Video
│   ├── xtts.ts             # XTTS Voice
│   ├── sadtalker.ts        # SadTalker Avatar
│   ├── whisper.ts          # Whisper STT
│   ├── ffmpeg.ts           # FFmpeg Video Merge
│   └── moviepy.ts          # MoviePy Video
├── health-check.ts         # Provider health monitoring
└── fallback-chain.ts       # Fallback logic
```

## Environment Variables

```bash
# OLLAMA
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_LLM_MODEL=llama3.1:8b
OLLAMA_VISION_MODEL=llava
OLLAMA_EMBEDDINGS_MODEL=nomic-embed-text

# COMFYUI
COMFYUI_BASE_URL=http://localhost:8188
COMFYUI_IMAGE_MODEL=SDXL
COMFYUI_VIDEO_MODEL=AnimateDiff

# GROQ (Free API)
GROQ_API_KEY=your_key
GROQ_TEXT_MODEL=mixtral-8x7b-32768
GROQ_VISION_MODEL=llama-2-90b-vision
GROQ_STT_MODEL=whisper-large-v3

# XTTS Voice
XTTS_DEVICE=cuda  # or cpu

# Tensor.Art (Free Image/Video)
TENSOR_ART_API_KEY=your_key

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/agenstil

# Redis (BullMQ)
REDIS_URL=redis://localhost:6379

# NextAuth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Storage
STORAGE_PATH=/uploads
SUPABASE_URL=optional
SUPABASE_KEY=optional
```

## Health Check System

```typescript
interface HealthStatus {
  provider: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  lastCheck: Date;
  responseTime: number;
  errorCount: number;
}

// Check every 30 seconds
setInterval(() => {
  registry.providers.forEach(p => p.healthCheck());
}, 30000);
```

## Generation Status Flow

```
QUEUED
   ↓
RUNNING (Provider executing)
   ↓
   ├→ COMPLETED (Success)
   ├→ FAILED (This provider failed)
   │   ↓
   │   Try next provider (back to RUNNING)
   │
   └→ WAITING_FOR_PROVIDER (No available provider)
       ↓
       Health check every 60s
       ↓
       Once provider recovers → RUNNING
```

## No Fake Data Policy

If a generation cannot complete:

1. ✅ **Do NOT generate fake output**
2. ✅ **Mark as FAILED with reason**
3. ✅ **Show exact error to user**
4. ✅ **Suggest installation/fix**
5. ✅ **Allow manual provider configuration**

Example:
```json
{
  "status": "FAILED",
  "reason": "Image provider unavailable",
  "details": "ComfyUI not running at http://localhost:8188",
  "suggestion": "Start ComfyUI: docker-compose up comfyui",
  "retryable": true,
  "timestamp": "2026-09-03T07:30:00Z"
}
```
