import { chromium } from 'playwright';
import path from 'path';
import sharp from 'sharp';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const SCALE = 2; // 2倍サイズでキャプチャ

async function captureOgBackground() {
  const url = process.argv[2] || 'http://localhost:3000';

  console.log(`Capturing OG background from: ${url}`);
  console.log(`Capturing at ${OG_WIDTH * SCALE}x${OG_HEIGHT * SCALE}, resizing to ${OG_WIDTH}x${OG_HEIGHT}`);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({
    viewport: { width: OG_WIDTH * SCALE, height: OG_HEIGHT * SCALE },
    deviceScaleFactor: 1,
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  // パーティクルが安定するまで少し待つ
  await page.waitForTimeout(5000);

  // テキスト要素とNext.js開発バッジを非表示にする
  await page.evaluate(() => {
    const selectors = [
      '#content',
      'h1', 'h2', 'h3',
      'ul', 'li', 'a', 'p',
      '.home', '#wrapper',
      'nextjs-portal', // Next.js dev overlay
      '[data-nextjs-toast]',
      '.leva-c-kWgxhW', // Leva UI root
      '[class*="leva"]', // Leva UI elements
    ];
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    });
  });

  // 2倍サイズでスクリーンショット撮影
  const screenshotBuffer = await page.screenshot({ type: 'png' });

  // sharpで半分にリサイズ
  const outputPath = path.join(process.cwd(), 'public', 'og-bg.png');
  await sharp(screenshotBuffer)
    .resize(OG_WIDTH, OG_HEIGHT)
    .png()
    .toFile(outputPath);

  console.log(`Screenshot saved to: ${outputPath}`);

  await browser.close();
}

captureOgBackground().catch(console.error);
