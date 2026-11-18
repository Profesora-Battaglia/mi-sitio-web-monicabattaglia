import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const rootDir = path.resolve(__dirname, '..');
const sitePublicMoodleDir = path.resolve(__dirname, '../../apps/web/public/moodle-ai-creator');

if (!fs.existsSync(sitePublicMoodleDir)) {
  fs.mkdirSync(sitePublicMoodleDir, { recursive: true });
}

const filesToCopy = ['index.html', 'styles.css', 'app.js', 'standalone-engine.js', 'config.example.js'];

for (const file of filesToCopy) {
  const src = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(rootDir, file));
    fs.copyFileSync(src, path.join(sitePublicMoodleDir, file));
  }
}

console.log('✅ Archivos sincronizados en moodle-ai-creator/ y apps/web/public/moodle-ai-creator/.');
