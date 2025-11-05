/**
 * Generate embeddings for all OM-A chunks
 * Run with: npx tsx scripts/generate-embeddings.ts
 */

import { generateEmbedding } from '../src/lib/gemini-rag';
import { OMAChunk } from '../src/lib/om-a-processor';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 Starting embedding generation...\n');
  
  // Load chunks
  const chunksPath = path.join(process.cwd(), 'src/data/om-a/chunks.json');
  const chunks: OMAChunk[] = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
  
  console.log(`📚 Loaded ${chunks.length} chunks`);
  
  // Generate embeddings
  const embeddings: { [key: string]: number[] } = {};
  let processed = 0;
  const batchSize = 10;
  
  console.log('\n🔮 Generating embeddings...');
  
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, Math.min(i + batchSize, chunks.length));
    
    // Process batch in parallel
    const batchPromises = batch.map(async (chunk) => {
      try {
        const embedding = await generateEmbedding(chunk.content);
        embeddings[chunk.id] = embedding;
        processed++;
        
        if (processed % 100 === 0) {
          console.log(`   Progress: ${processed}/${chunks.length} (${Math.round(processed / chunks.length * 100)}%)`);
        }
        
        return { success: true, id: chunk.id };
      } catch (error) {
        console.error(`   Error processing chunk ${chunk.id}:`, error);
        return { success: false, id: chunk.id, error };
      }
    });
    
    await Promise.all(batchPromises);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✅ Generated ${Object.keys(embeddings).length} embeddings`);
  
  // Save embeddings
  const outputPath = path.join(process.cwd(), 'src/data/om-a/embeddings.json');
  fs.writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));
  
  console.log(`💾 Embeddings saved to: ${outputPath}`);
  
  // Calculate statistics
  const embeddingDimensions = embeddings[Object.keys(embeddings)[0]]?.length || 0;
  const totalSize = JSON.stringify(embeddings).length;
  
  console.log('\n📊 Statistics:');
  console.log(`   Total embeddings: ${Object.keys(embeddings).length}`);
  console.log(`   Embedding dimensions: ${embeddingDimensions}`);
  console.log(`   File size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Success rate: ${Math.round(Object.keys(embeddings).length / chunks.length * 100)}%`);
}

main().catch(console.error);

