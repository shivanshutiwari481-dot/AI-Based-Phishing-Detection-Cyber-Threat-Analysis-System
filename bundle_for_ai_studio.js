import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const outputFile = path.join(projectRoot, 'PROJECT_BUNDLE_FOR_GOOGLE_AI_STUDIO.txt');

const includeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.md'];
const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.gemini'];

let combinedText = `# AI-BASED PHISHING DETECTION & CYBER THREAT ANALYZER SYSTEM
# Complete Codebase Bundle for Google AI Studio
# Maintainer: shivanshutiwari481-dot
# Generated: ${new Date().toISOString()}

`;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(projectRoot, fullPath);

    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        scanDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (includeExtensions.includes(ext) && entry.name !== 'PROJECT_BUNDLE_FOR_GOOGLE_AI_STUDIO.txt' && !entry.name.endsWith('.db')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        combinedText += `\n==================================================================\n`;
        combinedText += `FILE: ${relPath.replace(/\\/g, '/')}\n`;
        combinedText += `==================================================================\n`;
        combinedText += content + `\n\n`;
      }
    }
  }
}

scanDir(projectRoot);
fs.writeFileSync(outputFile, combinedText, 'utf8');

console.log(`✅ Successfully generated complete project codebase bundle for Google AI Studio!`);
console.log(`📄 Saved to: ${outputFile}`);
