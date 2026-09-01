/**
 * Generate responsive image variants for content cards using Sharp
 * Run: node scripts/generate-responsive-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = 'assets/images';
const OUTPUT_DIR = 'assets/images/responsive';

// Target widths for srcset (based on card display sizes)
const WIDTHS = [300, 600, 900, 1200]; // mobile, tablet, desktop, large desktop

// Images to process (Default versions shown initially)
const IMAGES = [
  'hbo-default_0.webp',
  'MAX-Default.webp',
  'DC_Default.webp',
  'WB-Default.webp',
  'CN-Default.webp',
  'UCL-Default.webp',
];

async function generateResponsiveImages() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🖼️  Gerando variantes responsivas...\n');

  for (const image of IMAGES) {
    const inputPath = path.join(INPUT_DIR, image);
    const basename = path.parse(image).name; // e.g., "hbo-default_0"
    const ext = 'webp';

    console.log(`📸 Processando: ${image}`);

    try {
      // Get original metadata
      const metadata = await sharp(inputPath).metadata();
      console.log(`   Original: ${metadata.width}x${metadata.height} (${metadata.format})`);

      // Generate each width
      for (const width of WIDTHS) {
        // Skip if original is smaller than target
        if (metadata.width && metadata.width < width) {
          console.log(`   ⏭️  Pulando ${width}w (original menor)`);
          continue;
        }

        const outputName = `${basename}-${width}w.${ext}`;
        const outputPath = path.join(OUTPUT_DIR, outputName);

        await sharp(inputPath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        console.log(`   ✅ ${width}w → ${outputName} (${(stats.size / 1024).toFixed(1)} KB)`);
      }

      // Also generate a 1x/2x version for the hover images if needed
      console.log(`   ✨ Concluído: ${image}\n`);

    } catch (error) {
      console.error(`   ❌ Erro ao processar ${image}:`, error.message);
    }
  }

  console.log('🎉 Geração completa!');
  console.log(`📁 Imagens salvas em: ${OUTPUT_DIR}/`);
}

generateResponsiveImages().catch(console.error);