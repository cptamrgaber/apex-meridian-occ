// API route to initialize fleet management schema
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Read sql file relative to the project root
  const filePath = path.join(process.cwd(), 'database', 'fleet_management_schema.sql');
  const content = fs.readFileSync(filePath, 'utf8');

  // Split by semicolon and newline; naive but works for this schema
  const statements = content
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--'));

  let executed = 0;
  for (const stmt of statements) {
    try {
      const anySql: any = sql;
      if (typeof anySql.unsafe === 'function') {
        await anySql.unsafe(stmt);
      } else if (typeof anySql.query === 'function') {
        await anySql.query(stmt);
      } else {
        // Fallback: attempt parameterized execution
        await sql`${stmt}`;
      }
      executed++;
    } catch (error: any) {
      console.error('Error executing statement:', stmt, error);
      return NextResponse.json({ status: 'error', statement: stmt, message: error.message }, { status: 500 });
    }
  }
  return NextResponse.json({ status: 'ok', executed });
}
