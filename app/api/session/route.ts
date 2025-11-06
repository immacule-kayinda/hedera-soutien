import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "handihelp-session";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return new NextResponse(null, { status: 204 });
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
        },
      },
    },
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    return new NextResponse(null, { status: 204 });
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token: sessionToken } });
    cookieStore.delete(SESSION_COOKIE);
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json({ user: session.user });
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionToken) {
    await prisma.session.deleteMany({ where: { token: sessionToken } });
    cookieStore.delete(SESSION_COOKIE);
  }

  return new NextResponse(null, { status: 204 });
}