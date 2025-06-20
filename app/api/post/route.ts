import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { title, content, author } = await request.json();
  const post = await prisma.post.create({
    data: { title, content, author },
  });
  return NextResponse.json(post, { status: 201 });
}
