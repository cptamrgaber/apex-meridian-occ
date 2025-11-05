/**
 * OM-A Query API Endpoint
 * Provides AI-powered answers to operations manual questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { OMAChunk, searchChunks } from '@/lib/om-a-processor';
import { generateRAGAnswer } from '@/lib/gemini-rag';
import fs from 'fs';
import path from 'path';

// Load chunks (cached in memory)
let chunksCache: OMAChunk[] | null = null;

function loadChunks(): OMAChunk[] {
  if (!chunksCache) {
    const chunksPath = path.join(process.cwd(), 'src/data/om-a/chunks.json');
    chunksCache = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
  }
  return chunksCache;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, maxResults = 5 } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Load chunks
    const chunks = loadChunks();
    
    // Filter by category if specified
    const filteredChunks = category
      ? chunks.filter(c => c.category === category)
      : chunks;
    
    // Perform keyword search (fast, no API calls)
    const searchResults = searchChunks(filteredChunks, query);
    const relevantChunks = searchResults.slice(0, maxResults);
    
    if (relevantChunks.length === 0) {
      return NextResponse.json({
        answer: 'I could not find any relevant information in the Operations Manual for your query. Please try rephrasing your question or contact Flight Operations for assistance.',
        sources: [],
        confidence: 0
      });
    }
    
    // Generate AI answer using RAG
    const answer = await generateRAGAnswer(query, relevantChunks);
    
    // Calculate confidence based on number of matches
    const confidence = Math.min(relevantChunks.length / maxResults, 1);
    
    return NextResponse.json({
      answer,
      sources: relevantChunks.map(chunk => ({
        section: chunk.section,
        title: chunk.title,
        category: chunk.category,
        content: chunk.content.substring(0, 200) + '...' // Preview only
      })),
      confidence
    });
  } catch (error) {
    console.error('Error processing OM-A query:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const category = searchParams.get('category') || undefined;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    // Load chunks
    const chunks = loadChunks();
    
    // Filter by category if specified
    const filteredChunks = category
      ? chunks.filter(c => c.category === category)
      : chunks;
    
    // Perform keyword search
    const searchResults = searchChunks(filteredChunks, query);
    const relevantChunks = searchResults.slice(0, 10);
    
    return NextResponse.json({
      results: relevantChunks.map(chunk => ({
        section: chunk.section,
        title: chunk.title,
        category: chunk.category,
        content: chunk.content.substring(0, 300) + '...'
      })),
      total: relevantChunks.length
    });
  } catch (error) {
    console.error('Error searching OM-A:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

