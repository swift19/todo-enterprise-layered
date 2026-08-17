import { authAdapter } from '../adapters/auth.adapter';
import { NextRequest } from 'next/server';

export async function verifyBFF(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) throw new Error('Unauthorized');
  const token = auth.replace('Bearer ', '');
  return await authAdapter.verify(token) as { userId: string; role: string; email: string };
}
export function rateLimit() { /* simple in-memory - replace with Upstash Ratelimit for prod */ return true; }
