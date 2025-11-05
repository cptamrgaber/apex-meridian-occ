/**
 * Script to process OM-A document into chunks for RAG
 * Run with: npx tsx scripts/process-om-a.ts
 */

import { processOMADocument } from '../src/lib/om-a-processor';
import path from 'path';

async function main() {
  const inputPath = path.join(process.cwd(), 'src/data/om-a/OM-A.md');
  const outputPath = path.join(process.cwd(), 'src/data/om-a/chunks.json');
  
  console.log('🚀 Starting OM-A document processing...\n');
  
  try {
    const { chunks, stats } = await processOMADocument(inputPath, outputPath);
    
    console.log('\n📊 Statistics by category:');
    for (const [category, count] of Object.entries(stats.categories)) {
      console.log(`   ${category}: ${count} chunks`);
    }
    
    console.log(`\n✅ Chunks saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error processing OM-A:', error);
    process.exit(1);
  }
}

main();

