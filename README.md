# 🎨 Agenstil - AI Creative Studio

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-Building-yellow)
![Node](https://img.shields.io/badge/node-18+-green)

> Transform any website/brand into a complete marketing campaign automatically using AI.

## 🚀 Features

- **Brand Analysis** - Automatic website analysis with Playwright
- **Photoshoot Redesign** - AI-generated product photography in multiple styles
- **Advertisement Creation** - Smart ad copy and visuals
- **Animated Campaigns** - Auto-generated video ads and graphics
- **Avatar System** - AI presenter videos with voice
- **Website Redesign** - Multiple design directions as live code
- **Live Watcher** - Detects site changes, auto-generates content
- **Intelligent Agents** - Personal assistant, regeneration, memory
- **100% Local AI** - Ollama, ComfyUI, XTTS (no mandatory paid APIs)
- **Job Queue** - BullMQ for background processing
- **Library** - Organized asset management with versioning
- **Mobile Responsive** - Full-featured on phone browsers

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Next.js 14 (Frontend + API)         │
├─────────────────────────────────────────────┤
│  Dashboard │ Agents │ Library │ Settings   │
├─────────────────────────────────────────────┤
│            Provider Registry                │
│  ┌─────────┬──────────┬──────────┐         │
│  │ Ollama  │ ComfyUI  │ Groq     │         │
│  │ (Local) │ (Local)  │ (Cloud)  │         │
│  └─────────┴──────────┴──────────┘         │
├─────────────────────────────────────────────┤
│      BullMQ + Redis (Job Queue)            │
├─────────────────────────────────────────────┤
│        PostgreSQL (Prisma ORM)             │
└─────────────────────────────────────────────┘
```

## 📋 Tech Stack

**Frontend:**
- Next.js 14 App Router
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion, Recharts

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js

**Jobs & Queue:**
- BullMQ
- Redis

**AI (Local First):**
- Ollama (LLM, Vision, Embeddings)
- ComfyUI (Image, Video)
- XTTS (Voice)
- SadTalker (Avatar)
- Whisper (STT)
- FFmpeg (Video Merge)

**Fallback (Cloud Free):**
- Groq API (LLM, Vision, STT)
- Tensor.Art (Image, Video)

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+
```

### Installation

```bash
# Clone repository
git clone https://github.com/mr81-star/agenstil-studio.git
cd agenstil-studio

# Install dependencies
npm install

# Copy environment
cp .env.example .env.local

# Start services (Docker)
docker-compose up -d

# Initialize database
npm run db:migrate
npm run db:seed

# Start development
npm run dev
```

Open **http://localhost:3000**

### With AI Services

```bash
# Start with Ollama + ComfyUI
docker-compose --profile with-ai up -d

# Pull AI models
docker exec agenstil-ollama ollama pull llama3.1:8b
docker exec agenstil-ollama ollama pull llava
```

### On Phone (Same Network)

```bash
# Get your IP
ifconfig | grep "inet "

# Visit from phone
http://<YOUR_IP>:3000
```

## 📚 Documentation

- [Architecture](./architecture.md) - System design
- [Provider Architecture](./provider-architecture.md) - AI provider system
- [Development](./development.md) - Local setup guide
- [Roadmap](./implementation-roadmap.md) - 22-layer build plan

## 🎯 Layers (Build Phases)

| # | Component | Status |
|---|-----------|--------|
| 0 | Architecture + Environment | ✅ Building |
| 1 | Auth + Dashboard + Plans | ⏳ Queued |
| 2 | Website Analyzer | ⏳ Queued |
| 3 | Photoshoot Engine | ⏳ Queued |
| 4 | Ad Creation | ⏳ Queued |
| 5 | Animated Ads | ⏳ Queued |
| 6 | Avatar System | ⏳ Queued |
| 7 | Graphic Posts | ⏳ Queued |
| 8 | Website Redesign | ⏳ Queued |
| 9 | Price Posts | ⏳ Queued |
| 10 | Videoshoot | ⏳ Queued |
| 11 | Testimonials | ⏳ Queued |
| 12 | Live Watcher | ⏳ Queued |
| 13 | AI Agents | ⏳ Queued |
| 14-22 | Advanced Features | ⏳ Queued |

## 🔧 Environment Variables

See `.env.example` for full list.

**Key variables:**
```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
OLLAMA_BASE_URL=http://localhost:11434
COMFYUI_BASE_URL=http://localhost:8188
GROQ_API_KEY=... # Optional free fallback
```

## 📦 Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # Type check
npm run lint             # Lint code

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data
npm run db:studio        # Open Prisma Studio

# Jobs
npm run worker           # Start job worker
npm run queue:inspect    # View job queue

# Production
npm run build            # Build for production
npm start                # Start production server
```

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📝 License

MIT License - see [LICENSE](./LICENSE)

## 🆘 Support

- GitHub Issues: [Report a bug](https://github.com/mr81-star/agenstil-studio/issues)
- Documentation: [Read docs](./development.md)
- Discord: Coming soon

---

**Built with ❤️ for creators, by creators**