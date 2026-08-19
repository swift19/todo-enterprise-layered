import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { bus } from "@/lib/bus";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const todo = await prisma.todo.update({ where: { id }, data: body });
  await bus.publish("todo.updated", todo);
  return NextResponse.json(todo);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.todo.findFirst({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ ok: true });
    }

    await prisma.todo.delete({ where: { id } });
    await bus.publish("todo.deleted", { id });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.code === "P2025") {
      return NextResponse.json({ ok: true }); // treat as success
    }
    throw e;
  }
}
