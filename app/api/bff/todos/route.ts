import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge'; // BFF on Edge for perf

import { z } from 'zod';
import { eventBus } from '@/lib/bus/eventBus';
import { cacheAdapter } from '@/lib/adapters/cache.adapter';
import { prismaAdapter } from '@/lib/adapters/prisma.adapter';

const createSchema = z.object({ title: z.string().min(3).max(100), priority: z.enum(['low','medium','high']).optional() });

export async function GET(req: NextRequest) {
  // const user = await verifyBFF(req); // enable after auth
  const cached = await cacheAdapter.get('todos:all');
  if (cached) return NextResponse.json(cached, { headers: { 'x-cache': 'HIT' } });

  // In real prod, fetch via adapter: const todos = await prismaAdapter.findByUser(user.userId);
  const todos = [{ id: '1', title: 'From BFF (Edge)' }];
  await cacheAdapter.set('todos:all', todos, 30);
  return NextResponse.json(todos, { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.parse(body);
    // Publish command - BFF never touches DB directly
    await eventBus.publish({ type: 'TodoCommand.Create', payload: { ...parsed, userId: 'demo-user' } });
    await cacheAdapter.invalidate('todos');
    return NextResponse.json({ status: 'accepted', event: 'TodoCommand.Create' }, { status: 202 });
  } catch(e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await eventBus.publish({ type: 'TodoCommand.Update', payload: { id, userId: 'demo-user', data } });
  return NextResponse.json({ status: 'accepted' }, { status: 202 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await eventBus.publish({ type: 'TodoCommand.Delete', payload: { id, userId: 'demo-user' } });
  return NextResponse.json({ status: 'accepted' }, { status: 202 });
}
