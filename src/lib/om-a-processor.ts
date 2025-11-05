/**
 * OM-A Document Processor
 * Processes EgyptAir Operations Manual (OM-A) into structured chunks for RAG
 */

import fs from 'fs';
import path from 'path';

export interface OMAChunk {
  id: string;
  section: string;
  title: string;
  content: string;
  category: string;
  tokens: number;
}

export interface OMASection {
  number: string;
  title: string;
  content: string;
  subsections: OMASection[];
}

/**
 * Parse OM-A markdown into structured sections
 */
export function parseOMADocument(markdown: string): OMASection[] {
  const lines = markdown.split('\n');
  const sections: OMASection[] = [];
  let currentSection: OMASection | null = null;
  let currentContent: string[] = [];
  
  // Section number pattern: 1.2.3 or 1.2 or 1.
  const sectionPattern = /^(\d+(?:\.\d+)*)\.\s*(.*)$/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(sectionPattern);
    
    if (match) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      
      // Start new section
      const sectionNumber = match[1];
      const sectionTitle = match[2] || '';
      
      currentSection = {
        number: sectionNumber,
        title: sectionTitle,
        content: '',
        subsections: []
      };
      currentContent = [];
    } else if (currentSection) {
      // Add content to current section
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection && currentContent.length > 0) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Categorize sections by topic
 */
export function categorizeSection(sectionNumber: string, title: string): string {
  const majorSection = sectionNumber.split('.')[0];
  
  // Common OM-A structure categories
  const categories: { [key: string]: string } = {
    '1': 'General',
    '2': 'Organization',
    '3': 'Operations',
    '4': 'Flight Operations',
    '5': 'Flight Crew',
    '6': 'Aircraft',
    '7': 'Safety',
    '8': 'Security',
    '9': 'Training',
    '10': 'Quality',
  };
  
  return categories[majorSection] || 'Other';
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Create chunks from sections for RAG
 */
export function createChunks(sections: OMASection[], maxTokens: number = 500): OMAChunk[] {
  const chunks: OMAChunk[] = [];
  let chunkId = 1;
  
  for (const section of sections) {
    const category = categorizeSection(section.number, section.title);
    const fullContent = `${section.title}\n\n${section.content}`;
    const tokens = estimateTokens(fullContent);
    
    if (tokens <= maxTokens) {
      // Section fits in one chunk
      chunks.push({
        id: `chunk-${chunkId++}`,
        section: section.number,
        title: section.title,
        content: fullContent,
        category,
        tokens
      });
    } else {
      // Split large section into smaller chunks
      const sentences = fullContent.split(/(?<=[.!?])\s+/);
      let currentChunk: string[] = [];
      let currentTokens = 0;
      
      for (const sentence of sentences) {
        const sentenceTokens = estimateTokens(sentence);
        
        if (currentTokens + sentenceTokens > maxTokens && currentChunk.length > 0) {
          // Save current chunk
          chunks.push({
            id: `chunk-${chunkId++}`,
            section: section.number,
            title: section.title,
            content: currentChunk.join(' '),
            category,
            tokens: currentTokens
          });
          
          currentChunk = [sentence];
          currentTokens = sentenceTokens;
        } else {
          currentChunk.push(sentence);
          currentTokens += sentenceTokens;
        }
      }
      
      // Save last chunk
      if (currentChunk.length > 0) {
        chunks.push({
          id: `chunk-${chunkId++}`,
          section: section.number,
          title: section.title,
          content: currentChunk.join(' '),
          category,
          tokens: currentTokens
        });
      }
    }
  }
  
  return chunks;
}

/**
 * Process OM-A document and save chunks
 */
export async function processOMADocument(
  inputPath: string,
  outputPath: string
): Promise<{ chunks: OMAChunk[]; stats: any }> {
  console.log('📖 Reading OM-A document...');
  const markdown = fs.readFileSync(inputPath, 'utf-8');
  
  console.log('🔍 Parsing sections...');
  const sections = parseOMADocument(markdown);
  
  console.log('✂️ Creating chunks...');
  const chunks = createChunks(sections, 500);
  
  console.log('💾 Saving chunks...');
  fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2));
  
  // Calculate statistics
  const stats = {
    totalSections: sections.length,
    totalChunks: chunks.length,
    totalTokens: chunks.reduce((sum, c) => sum + c.tokens, 0),
    avgTokensPerChunk: Math.round(chunks.reduce((sum, c) => sum + c.tokens, 0) / chunks.length),
    categories: {} as { [key: string]: number }
  };
  
  // Count chunks by category
  for (const chunk of chunks) {
    stats.categories[chunk.category] = (stats.categories[chunk.category] || 0) + 1;
  }
  
  console.log('✅ Processing complete!');
  console.log(`   Sections: ${stats.totalSections}`);
  console.log(`   Chunks: ${stats.totalChunks}`);
  console.log(`   Total tokens: ${stats.totalTokens}`);
  console.log(`   Avg tokens/chunk: ${stats.avgTokensPerChunk}`);
  
  return { chunks, stats };
}

/**
 * Search chunks by keyword
 */
export function searchChunks(chunks: OMAChunk[], query: string): OMAChunk[] {
  const queryLower = query.toLowerCase();
  
  return chunks.filter(chunk => {
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.title.toLowerCase();
    
    return contentLower.includes(queryLower) || titleLower.includes(queryLower);
  }).sort((a, b) => {
    // Sort by relevance (number of query matches)
    const aMatches = (a.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
    const bMatches = (b.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
    return bMatches - aMatches;
  });
}

