# AGENSTIL - CORE ARCHITECTURE

## System Overview

Agenstil is an AI Creative Studio that transforms any website/brand into a complete marketing campaign automatically using a combination of local open-source and cloud-free AI services.

### Core Flow
```
Analyze Brand → Redesign Products → Create Ads → Create Videos → 
Create Avatar → Redesign Website → Create Posts → 
MERGE POSTS INTO CINEMATIC VIDEO → Watch Site For Changes
```

## Core Entities

```
User
├── Workspace
│   ├── Plan (BRAND | BIG_INDUSTRY)
│   └── Project
│       ├── Brand
│       ├── Website
│       ├── Product[]
│       ├── Service[]
│       ├── Collection[]
│       ├── Generation[]
│       ├── GenerationVersion[]
│       ├── Asset[]
│       └── ChangeEvent[]
├── Agent[]
│   ├── Conversation[]
│   └── Message[]
└── Notification[]
```

## Tech Stack

### Frontend
- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Theme:** next-themes (dark/light)
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Real-time:** Socket.io

### Backend
- **Framework:** Next.js API Routes + Node.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** NextAuth.js v5
- **Job Queue:** BullMQ + Redis
- **Browser Automation:** Playwright
- **Storage:** Local /uploads + Supabase adapter

### AI Services (Local-First)
- **LLM:** Ollama (llama3.1:8b, qwen2-vl)
- **Image Gen:** ComfyUI (SDXL, Flux, AnimateDiff)
- **Voice:** XTTS-v2, Whisper.cpp
- **Avatar:** SadTalker, Wav2Lip
- **Video:** FFmpeg, MoviePy
- **Embeddings:** Ollama-nomic-embed
- **Vector DB:** ChromaDB

### Infrastructure
- **Docker:** docker-compose.yml
- **Process Manager:** node
- **Queue:** Redis
- **Database:** PostgreSQL

## Provider System

### 3-Provider Strategy Per Task
Every AI task has: **[Local1, Local2, CloudFreeFallback]**

#### Capabilities Registry
```
TEXT_LLM: [Ollama-llama3.1:8b, LMStudio, Groq-free]
IMAGE: [ComfyUI-SDXL, ComfyUI-Flux, Tensor.Art-free]
VIDEO: [ComfyUI-AnimateDiff, ComfyUI-Wan2.1, Tensor.Art-free]
AVATAR: [SadTalker, MuseTalk, Wav2Lip]
TTS: [XTTS-v2, Coqui-TTS, Edge-TTS]
STT: [Whisper.cpp, Faster-Whisper, Groq-free]
VISION: [Ollama-llava, Ollama-qwen2-vl, Groq-free]
EMBEDDINGS: [Ollama-nomic-embed, sentence-transformers]
VIDEO_MERGE: [FFmpeg, MoviePy]
```

## Data Flow

### Generation Pipeline
```
User Request
    ↓
AGENSTIL ORCHESTRATOR
    ↓
TASK PLANNER (Determine capability needed)
    ↓
TOOL/PROVIDER DISCOVERY (Search registry)
    ↓
PREFER: Local → Local2 → Cloud Free
    ↓
EXECUTE (Run provider adapter)
    ↓
QUALITY CHECK (Validate output)
    ↓
FAILED? → Try Alternative Provider
    ↓
SUCCESS → Save to Library with metadata
    ↓
NOTIFICATION → User approval required
```

## Generation Metadata
Every generated asset saves:
```json
{
  "id": "gen_123",
  "projectId": "proj_123",
  "type": "IMAGE|VIDEO|AUDIO|WEBSITE|MERGED_VIDEO",
  "status": "QUEUED|RUNNING|COMPLETED|FAILED|WAITING_FOR_PROVIDER",
  "provider": "ollama|comfyui|tensor.art",
  "model": "llama3.1:8b|SDXL|flux-dev",
  "prompt": "original prompt",
  "resultUrl": "url/to/asset",
  "metadata": {
    "seed": 12345,
    "settings": {...},
    "parentGenerationId": "gen_122",
    "sourceAssetIds": ["asset_1", "asset_2"],
    "duration": "10s",
    "dimensions": "1920x1080",
    "quality": "high"
  }
}
```

## Library Organization
```
Library
├── Photoshoots (PHOTOSHOOT_REDESIGN)
├── Ads (ADVERTISEMENT)
├── Animated Ads (ANIMATED_AD)
├── Avatars (AVATAR_IMAGE)
├── Avatar Videos (AVATAR_VIDEO)
├── Graphic Posts (GRAPHIC_POST)
├── Animated Posts (ANIMATED_GRAPHIC_POST)
├── Websites (WEBSITE_REDESIGN)
├── Product Posts (PRICE_POST)
├── Videoshoots (VIDEOSHOOT)
├── Feedback Videos (FEEDBACK_VIDEO)
├── Marketing Strategy (STRATEGY)
└── Merged Videos (MERGED_VIDEO)
```

## 22-Layer Build Plan

| Layer | Component | Status |
|-------|-----------|--------|
| 0 | Architecture + Environment | Building |
| 1 | Authentication + Dashboard + Plans | Queued |
| 2 | Website Analyzer | Queued |
| 3 | Photoshoot Engine | Queued |
| 4 | Ad Creation Engine | Queued |
| 5 | Animated Ads + Motion | Queued |
| 6 | Avatar System | Queued |
| 7 | Cinematic Graphic Posts | Queued |
| 8 | Website Redesign Engine | Queued |
| 9 | Product/Service Price Posts | Queued |
| 10 | Fashion Videoshoot Engine | Queued |
| 11 | Feedback/Testimonial Video | Queued |
| 12 | Live Website Watcher | Queued |
| 13 | Three Intelligent Agents | Queued |
| 14 | Universal Tool Discovery | Queued |
| 15 | Master Orchestrator | Queued |
| 16 | Marketing Strategy Engine | Queued |
| 17 | Quality Control Engine | Queued |
| 18 | Library + Versioning | Queued |
| 19 | UI/UX/Theme | Queued |
| 20 | Local Free Deployment | Queued |
| 21 | Final Test + Self-Repair | Queued |
| 22 | Graphic Post Merger Video | Queued |

## Key Rules

1. **Build 1 layer at a time** - Implement → Run → Test → Fix → Document
2. **NO FAKE DATA** - If AI fails, show "FAILED: Service not running"
3. **3 PROVIDERS PER TASK** - Always have fallback chains
4. **ALL JOBS USE BullMQ** - Show % progress and logs
5. **EVERY GENERATION SAVED** - With full metadata + versions
6. **Environment Variables** - Never expose keys to frontend
7. **No Fabrication** - Never invent prices, claims, or testimonials
8. **Truthful Status** - COMPLETED, IN_PROGRESS, WAITING_FOR_PROVIDER, FAILED, NEEDS_APPROVAL

## Success Criteria

- ✅ Runs on phone browser (responsive)
- ✅ Generates real marketing content
- ✅ No hallucinated data
- ✅ Free/open-source first
- ✅ Full job progress tracking
- ✅ Extensible provider system
- ✅ Production-grade database
- ✅ Authentication + plan gating
- ✅ Local + cloud fallbacks
