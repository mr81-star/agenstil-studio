// src/jobs/live-watcher.ts
import { prisma } from '@/lib/db';
import playwright from 'playwright';
import { diff } from 'deep-diff';

interface PageSnapshot {
  content: string;
  products: Array<{ name: string; price?: number }>;
  links: Array<{ text: string; href: string }>;
  lastChecked: Date;
}

export async function watchWebsiteForChanges(projectId: string) {
  try {
    console.log(`👁️ Watching website for changes: ${projectId}`);

    const website = await prisma.website.findUnique({
      where: { projectId },
    });

    if (!website) {
      console.log('⚠️ No website configured for this project');
      return;
    }

    // Get previous snapshot
    const previousSnapshot = website.analysis as any;

    // Capture current state
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto(website.url, { waitUntil: 'networkidle' });

    const currentContent = await page.content();
    const currentProducts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-product], .product')).map(
        (el) => ({
          name: el.getAttribute('data-name') || el.textContent?.trim() || '',
          price: parseFloat(el.getAttribute('data-price') || '0'),
        })
      );
    });

    const currentLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map((a) => ({
          text: a.textContent?.trim() || '',
          href: a.href,
        }))
        .slice(0, 20);
    });

    await browser.close();

    const currentSnapshot: PageSnapshot = {
      content: currentContent,
      products: currentProducts,
      links: currentLinks,
      lastChecked: new Date(),
    };

    // Detect changes
    if (previousSnapshot) {
      const changes = diff(previousSnapshot, currentSnapshot);

      if (changes) {
        console.log('✅ Changes detected!');

        // Log change event
        let changeType = 'WEBSITE_UPDATE';
        let description = 'Website has been updated';

        if (currentProducts.length > previousSnapshot.products?.length) {
          changeType = 'NEW_PRODUCT';
          const newProducts = currentProducts.slice(previousSnapshot.products?.length);
          description = `New products added: ${newProducts.map((p) => p.name).join(', ')}`;
        } else if (currentProducts.length < previousSnapshot.products?.length) {
          changeType = 'PRODUCT_REMOVED';
          description = 'Some products have been removed';
        }

        // Check for price changes
        const priceChanges = currentProducts.filter((p) => {
          const old = previousSnapshot.products?.find((o) => o.name === p.name);
          return old && old.price !== p.price;
        });

        if (priceChanges.length > 0) {
          changeType = 'PRICE_CHANGE';
          description = `Price changes detected: ${priceChanges.map((p) => p.name).join(', ')}`;
        }

        await prisma.changeEvent.create({
          data: {
            projectId,
            type: changeType,
            description,
            data: {
              previousSnapshot,
              currentSnapshot,
              changes,
            },
          },
        });

        // Create notification
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: { workspace: true },
        });

        if (project) {
          await prisma.notification.create({
            data: {
              userId: project.workspace.userId,
              type: 'CHANGE_DETECTED',
              title: changeType,
              message: description,
              data: { projectId, changeType },
            },
          });
        }
      }
    }

    // Update website with latest snapshot
    await prisma.website.update({
      where: { projectId },
      data: {
        analysis: currentSnapshot,
        crawledAt: new Date(),
      },
    });

    console.log(`✅ Website watch complete for ${projectId}`);
  } catch (error) {
    console.error('❌ Website watching failed:', error);
  }
}

// Schedule periodic checks (would be called from a cron job)
export async function startLiveWatcher() {
  console.log('🚀 Starting live website watcher...');

  const pollInterval = parseInt(process.env.WATCHER_POLL_INTERVAL_HOURS || '24');
  const intervalMs = pollInterval * 60 * 60 * 1000;

  setInterval(async () => {
    const projects = await prisma.project.findMany({
      include: { website: true },
    });

    for (const project of projects) {
      if (project.website) {
        await watchWebsiteForChanges(project.id);
      }
    }
  }, intervalMs);
}
