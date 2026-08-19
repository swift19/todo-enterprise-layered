import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { bus } from "@/lib/bus";
import { TodoDomain } from "@/lib/domain/todo.entity";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json([]);

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const todos = await prisma.todo.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { text, priority = "MEDIUM" } = await req.json();
  if (!text)
    return NextResponse.json({ error: "Text required" }, { status: 400 });

  try {
    TodoDomain.validateTitle(text); // will throw if <3 chars
  } catch (e: any) {
    console.log("VALIDATION FAILED:", e.message);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  const normalizedPriority = priority.toLowerCase() as any;
  const domainData = TodoDomain.create(text, user.id, normalizedPriority);

  const todo = await prisma.todo.create({
    data: {
      text: domainData.text,
      priority: priority,
      user: {
        connect: { id: user.id },
      },
      done: domainData.completed,
    },
  });

  await bus.publish("todo.created", todo);

  return NextResponse.json(todo);
}
