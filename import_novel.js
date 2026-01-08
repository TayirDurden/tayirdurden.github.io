import fs from 'fs';
import path from 'path';

// CONFIGURATION
const INPUT_FILE = 'full_novel.txt';
const OUTPUT_DIR = 'src/content/novel/en';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const rawText = fs.readFileSync(INPUT_FILE, 'utf-8');

// --- THE FIX ---
// 1. [A-Za-z\-]+ allows hyphens (Twenty-One)
// 2. We use specific matching to ensure we capture the title line correctly
const chapterRegex = /Chapter\s+([A-Za-z\-]+)\r?\n\s*(.+?)(?=\r?\n)/g;

let match;
let chapterCount = 1;
let chapters = [];

while ((match = chapterRegex.exec(rawText)) !== null) {
    const chapterWord = match[1]; // "Twenty-One"
    const title = match[2].trim(); // "The Bug"
    const startIndex = match.index + match[0].length;
    
    if (chapters.length > 0) {
        chapters[chapters.length - 1].endIndex = match.index;
    }

    chapters.push({
        number: chapterCount,
        title: title,
        startIndex: startIndex,
        endIndex: rawText.length,
        word: chapterWord
    });

    chapterCount++;
}

console.log(`Found ${chapters.length} chapters.`);

chapters.forEach(chapter => {
    let content = rawText.slice(chapter.startIndex, chapter.endIndex).trim();
    
    // Clean up artifacts
    content = content.replace(/^\s*\d+\s*$/gm, ''); // Stray numbers
    content = content.replace(/--- PAGE \d+ ---/g, ''); // Page headers
    content = content.replace(/Zero Sum City/gi, '');
    content = content.replace(/Mahmut Tahsin Ülgen/gi, '');
    content = content.replace(/([^\n])\n(?!\n)/g, '$1 '); // Fix broken lines

    const fileContent = `---
title: "${chapter.title}"
chapter_number: ${chapter.number}
lang: "en"
slug: "chapter-${chapter.number}"
---

${content}
`;

    const fileName = `chapter-${chapter.number}.md`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), fileContent);
    console.log(`Processed Chapter ${chapter.number}: ${chapter.title}`);
});