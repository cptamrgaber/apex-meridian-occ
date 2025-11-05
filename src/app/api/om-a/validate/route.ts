/**
 * OM-A Compliance Validation API Endpoint
 * Validates operations against OM-A regulations
 */

import { NextRequest, NextResponse } from 'next/server';
import { OMAChunk, searchChunks } from '@/lib/om-a-processor';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Load chunks (cached)
let chunksCache: OMAChunk[] | null = null;

function loadChunks(): OMAChunk[] {
  if (!chunksCache) {
    const chunksPath = path.join(process.cwd(), 'src/data/om-a/chunks.json');
    chunksCache = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
  }
  return chunksCache as OMAChunk[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rule, context, category } = body;
    
    if (!rule || !context) {
      return NextResponse.json(
        { error: 'Rule and context are required' },
        { status: 400 }
      );
    }
    
    // Load chunks
    const chunks = loadChunks();
    
    // Search for relevant regulations
    const searchResults = searchChunks(chunks, rule);
    const relevantChunks = searchResults.slice(0, 3);
    
    if (relevantChunks.length === 0) {
      return NextResponse.json({
        compliant: false,
        reason: 'No relevant regulations found in OM-A',
        sources: [],
        severity: 'warning'
      });
    }
    
    // Prepare context for AI
    const regulations = relevantChunks
      .map((chunk, i) => `[Regulation ${i + 1}] Section ${chunk.section}: ${chunk.title}\n${chunk.content}`)
      .join('\n\n---\n\n');
    
    // Create validation prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `You are a compliance validation engine for EgyptAir operations based on the Operations Manual (OM-A).

Relevant OM-A Regulations:
${regulations}

Rule to Validate: ${rule}

Current Context:
${JSON.stringify(context, null, 2)}

Task:
Determine if the current context complies with the OM-A regulations. Respond with a JSON object:
{
  "compliant": true or false,
  "reason": "Clear explanation of compliance status",
  "section": "Specific OM-A section number",
  "severity": "info" | "warning" | "error",
  "recommendation": "What action should be taken if non-compliant"
}

Response (JSON only):`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const validation = JSON.parse(jsonMatch[0]);
      
      return NextResponse.json({
        compliant: validation.compliant,
        reason: validation.reason,
        section: validation.section,
        severity: validation.severity || 'warning',
        recommendation: validation.recommendation || '',
        sources: relevantChunks.map(chunk => ({
          section: chunk.section,
          title: chunk.title,
          category: chunk.category
        }))
      });
    }
    
    // Fallback if JSON parsing fails
    return NextResponse.json({
      compliant: false,
      reason: 'Unable to validate compliance - AI response parsing error',
      sources: relevantChunks.map(chunk => ({
        section: chunk.section,
        title: chunk.title,
        category: chunk.category
      })),
      severity: 'error'
    });
  } catch (error) {
    console.error('Error validating compliance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

