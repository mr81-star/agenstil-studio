# AGENSTIL - LOCAL DEVELOPMENT SETUP

## Prerequisites

### Required
- Node.js 18+ (LTS recommended)
- npm or yarn
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (recommended)

### Optional (For AI Features)
- Ollama (LLM + Vision)
- ComfyUI (Image/Video generation)
- CUDA-capable GPU (for faster processing)

## Quick Start (Docker Compose)

### 1. Clone & Setup
```bash
git clone https://github.com/mr81-star/agenstil-studio.git
cd agenstil-studio
npm install
```

### 2. Copy Environment
```bash
cp .env.example .env.local
```

### 3. Start All Services
```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Ollama (port 11434) - LLM
- ComfyUI (port 8188) - Image/Video
- pgAdmin (port 5050) - DB management

### 4. Initialize Database
```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

## Services Status

After `docker-compose up`, check each service:

### PostgreSQL
```bash
psql -U agenstil -d agenstil -h localhost
\dt  # List tables
```

### Redis
```bash
redis-cli -h localhost ping
# Should return: PONG
```

### Ollama
```bash
curl http://localhost:11434/api/tags
# Should list available models
```

### ComfyUI
```bash
curl http://localhost:8188/api/
# Should return API info
```

## Development Commands

### Database
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Reset database (CAREFUL - deletes all data)
npm run db:reset

# Seed with test data
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio
```

### Build & Test
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test
npm run test

# Build
npm run build
```

### Jobs & Workers
```bash
# Start job worker (in separate terminal)
npm run worker

# View job queue
npm run queue:inspect

# Clear failed jobs
npm run queue:clear
```

## File Structure

```
agenstil-studio/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── auth/           # Auth pages
│   │   └── layout.tsx
│   ├── components/         # React components
│   │   ├── dashboard/
│   │   ├── agents/
│   │   ├── generation/
│   │   └── ui/
│   ├── providers/          # AI provider adapters
│   │   ├── registry.ts
│   │   ├── adapters/
│   │   └── types.ts
│   ├── jobs/               # BullMQ job definitions
│   │   ├── analyze-brand.ts
│   │   ├── generate-image.ts
│   │   └── ...
│   ├── lib/                # Utilities
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── ...
│   ├── middleware.ts       # NextAuth middleware
│   └── styles/             # Global styles
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/
├── public/
│   ├── images/
│   └── music/              # Background music
├── uploads/                # Local storage
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### PostgreSQL Connection Failed
```bash
# Check if container is running
docker ps | grep postgres

# View logs
docker logs agenstil-postgres

# Restart
docker-compose restart postgres
```

### Redis Connection Failed
```bash
# Check Redis
docker exec agenstil-redis redis-cli ping

# Restart
docker-compose restart redis
```

### Ollama Models Not Loading
```bash
# Pull model
docker exec agenstil-ollama ollama pull llama3.1:8b

# Check models
curl http://localhost:11434/api/tags
```

### ComfyUI Missing Models
```bash
# ComfyUI checkpoints folder
docker exec agenstil-comfyui ls /root/ComfyUI/models/checkpoints/

# Download model (requires setup)
docker exec agenstil-comfyui /root/ComfyUI/download_models.sh
```

## Environment Variables

Edit `.env.local` to configure:

```bash
# Use local Ollama
OLLAMA_BASE_URL=http://localhost:11434

# Use local ComfyUI
COMFYUI_BASE_URL=http://localhost:8188

# Enable Groq fallback (requires API key)
GROQ_API_KEY=your_key_here

# Change log level
LOG_LEVEL=debug
```

## Mobile Testing

To test on phone from same network:

```bash
# Get your machine IP
ifconfig | grep "inet "

# Connect from phone
http://<YOUR_IP>:3000
```

## Performance Tips

1. **Use GPU for AI** - Set `XTTS_DEVICE=cuda` if available
2. **Increase Redis memory** - For high job volume
3. **Scale workers** - Run `npm run worker` in multiple terminals
4. **Monitor jobs** - Use `npm run queue:inspect`

## Next Steps

After local setup works:

1. Create test account
2. Create test project
3. Analyze test website
4. Generate test assets
5. Check `/uploads` folder for results
6. View job logs in Redis UI
