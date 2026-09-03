import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create plans
  const brandPlan = await prisma.plan.upsert({
    where: { name: 'BRAND' },
    update: {},
    create: {
      name: 'BRAND',
      capabilities: {
        photoshoot: true,
        ads: true,
        animatedAds: true,
        graphicPosts: true,
        productPosts: true,
        videoshoot: true,
        websiteRedesign: true,
        liveWatcher: true,
      },
      features: ['agent2', 'agent3', 'live_watcher'],
      maxProjects: 5,
      maxStorage: 5368709120, // 5GB
    },
  });

  const industryPlan = await prisma.plan.upsert({
    where: { name: 'BIG_INDUSTRY' },
    update: {},
    create: {
      name: 'BIG_INDUSTRY',
      capabilities: {
        photoshoot: true,
        ads: true,
        animatedAds: true,
        avatar: true,
        graphicPosts: true,
        productPosts: true,
        videoshoot: true,
        testimonials: true,
        websiteRedesign: true,
        liveWatcher: true,
        marketingStrategy: true,
        agentPersonal: true,
        agentRegeneration: true,
        agentMemory: true,
      },
      features: ['agent1', 'agent2', 'agent3', 'live_watcher'],
      maxProjects: 50,
      maxStorage: 10737418240, // 10GB
    },
  });

  // Create providers
  const providers = [
    {
      name: 'ollama',
      capability: 'TEXT_LLM',
      priority: 0,
      baseUrl: 'http://localhost:11434',
    },
    {
      name: 'lmstudio',
      capability: 'TEXT_LLM',
      priority: 1,
      baseUrl: 'http://localhost:1234',
    },
    {
      name: 'groq',
      capability: 'TEXT_LLM',
      priority: 2,
      baseUrl: 'https://api.groq.com/openai/v1',
    },
    {
      name: 'comfyui',
      capability: 'IMAGE',
      priority: 0,
      baseUrl: 'http://localhost:8188',
    },
    {
      name: 'tensor-art',
      capability: 'IMAGE',
      priority: 1,
      baseUrl: 'https://api.tensor.art/v1',
    },
    {
      name: 'comfyui-video',
      capability: 'VIDEO',
      priority: 0,
      baseUrl: 'http://localhost:8188',
    },
    {
      name: 'tensor-art-video',
      capability: 'VIDEO',
      priority: 1,
      baseUrl: 'https://api.tensor.art/v1',
    },
    {
      name: 'sadtalker',
      capability: 'AVATAR',
      priority: 0,
      baseUrl: 'http://localhost:7860',
    },
    {
      name: 'xtts',
      capability: 'TTS',
      priority: 0,
      baseUrl: 'http://localhost:8020',
    },
    {
      name: 'whisper',
      capability: 'STT',
      priority: 0,
      baseUrl: 'http://localhost:9000',
    },
    {
      name: 'ollama-vision',
      capability: 'VISION',
      priority: 0,
      baseUrl: 'http://localhost:11434',
    },
  ];

  for (const p of providers) {
    await prisma.provider.upsert({
      where: { name: p.name },
      update: { baseUrl: p.baseUrl },
      create: { ...p, status: 'AVAILABLE' },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Plans created: BRAND, BIG_INDUSTRY`);
  console.log(`Providers configured: ${providers.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
