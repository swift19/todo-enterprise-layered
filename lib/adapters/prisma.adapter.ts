// ADAPTER LAYER - ONLY layer that touches DB
import { PrismaClient } from '@prisma/client';
import { eventBus } from '../bus/eventBus';
const prisma = new PrismaClient();

// Subscribe to commands from BFF
eventBus.subscribe('TodoCommand.Create', async (e: any) => {
  if (e.type !== 'TodoCommand.Create') return;
  const todo = await prisma.todo.create({ data: e.payload });
  await eventBus.publish({ type: 'TodoCreated', payload: todo });
});

eventBus.subscribe('TodoCommand.Update', async (e: any) => {
  if (e.type !== 'TodoCommand.Update') return;
  const todo = await prisma.todo.update({ where: { id: e.payload.id }, data: e.payload.data });
  await eventBus.publish({ type: 'TodoUpdated', payload: todo });
});

eventBus.subscribe('TodoCommand.Delete', async (e: any) => {
  if (e.type !== 'TodoCommand.Delete') return;
  await prisma.todo.delete({ where: { id: e.payload.id } });
  await eventBus.publish({ type: 'TodoDeleted', payload: { id: e.payload.id } });
});

export const prismaAdapter = {
  findByUser: (userId: string) => prisma.todo.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
  findById: (id: string) => prisma.todo.findUnique({ where: { id } }),
};
