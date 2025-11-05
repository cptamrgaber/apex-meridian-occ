/**
 * Gemini API Integration for OM-A RAG System
 * Provides semantic search and AI-powered query answering
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { OMAChunk } from './om-a-processor';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface RAGQuery {
  query: string;
  category?: string;
  maxResults?: number;
}

export interface RAGResult {
  answer: string;
  sources: OMAChunk[];
  confidence: number;
}

/**
 * Generate embeddings for text using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Search chunks using semantic similarity
 */
export async function semanticSearch(
  query: string,
  chunks: OMAChunk[],
  embeddings: Map<string, number[]>,
  maxResults: number = 5
): Promise<{ chunk: OMAChunk; similarity: number }[]> {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);
  
  // Calculate similarities
  const results: { chunk: OMAChunk; similarity: number }[] = [];
  
  for (const chunk of chunks) {
    const chunkEmbedding = embeddings.get(chunk.id);
    if (chunkEmbedding) {
      const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
      results.push({ chunk, similarity });
    }
  }
  
  // Sort by similarity and return top results
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, maxResults);
}

/**
 * Generate answer using RAG (Retrieval Augmented Generation)
 */
export async function generateRAGAnswer(
  query: string,
  relevantChunks: OMAChunk[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  // Prepare context from relevant chunks
  const context = relevantChunks
    .map((chunk, i) => `[Source ${i + 1}] Section ${chunk.section}: ${chunk.title}\n${chunk.content}`)
    .join('\n\n---\n\n');
  
  // Create prompt
  const prompt = `You are an expert aviation operations assistant with deep knowledge of EgyptAir's Operations Manual (OM-A).

Context from OM-A:
${context}

User Question: ${query}

Instructions:
1. Answer the question based ONLY on the provided OM-A context
2. Be precise and cite specific section numbers when applicable
3. If the context doesn't contain enough information, say so clearly
4. Use professional aviation terminology
5. Format your answer clearly with bullet points or numbered lists when appropriate

Answer:`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating RAG answer:', error);
    throw error;
  }
}

/**
 * Query OM-A using RAG
 */
export async function queryOMA(
  query: string,
  chunks: OMAChunk[],
  embeddings: Map<string, number[]>,
  options: { maxResults?: number; category?: string } = {}
): Promise<RAGResult> {
  const { maxResults = 5, category } = options;
  
  // Filter by category if specified
  const filteredChunks = category
    ? chunks.filter(c => c.category === category)
    : chunks;
  
  // Perform semantic search
  const searchResults = await semanticSearch(query, filteredChunks, embeddings, maxResults);
  
  // Extract relevant chunks
  const relevantChunks = searchResults.map(r => r.chunk);
  const avgSimilarity = searchResults.reduce((sum, r) => sum + r.similarity, 0) / searchResults.length;
  
  // Generate answer using RAG
  const answer = await generateRAGAnswer(query, relevantChunks);
  
  return {
    answer,
    sources: relevantChunks,
    confidence: avgSimilarity
  };
}

/**
 * Validate compliance rule against OM-A
 */
export async function validateCompliance(
  rule: string,
  context: any,
  chunks: OMAChunk[],
  embeddings: Map<string, number[]>
): Promise<{ compliant: boolean; reason: string; sources: OMAChunk[] }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  // Search for relevant regulations
  const searchResults = await semanticSearch(rule, chunks, embeddings, 3);
  const relevantChunks = searchResults.map(r => r.chunk);
  
  // Prepare context
  const regulations = relevantChunks
    .map((chunk, i) => `[Regulation ${i + 1}] Section ${chunk.section}: ${chunk.title}\n${chunk.content}`)
    .join('\n\n---\n\n');
  
  // Create validation prompt
  const prompt = `You are a compliance validation engine for EgyptAir operations.

Relevant OM-A Regulations:
${regulations}

Rule to Validate: ${rule}

Current Context:
${JSON.stringify(context, null, 2)}

Task:
1. Determine if the current context complies with the OM-A regulations
2. Respond with a JSON object containing:
   - "compliant": true or false
   - "reason": Clear explanation of why it is or isn't compliant
   - "section": The specific OM-A section number that applies

Response (JSON only):`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const validation = JSON.parse(jsonMatch[0]);
      return {
        compliant: validation.compliant,
        reason: validation.reason,
        sources: relevantChunks
      };
    }
    
    // Fallback if JSON parsing fails
    return {
      compliant: false,
      reason: 'Unable to validate compliance - parsing error',
      sources: relevantChunks
    };
  } catch (error) {
    console.error('Error validating compliance:', error);
    throw error;
  }
}

