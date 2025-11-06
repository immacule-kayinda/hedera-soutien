import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";

const SESSION_COOKIE = "handihelp-session";
const SESSION_DURATION_HOURS = 24;

const sharedSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "Veuillez confirmer votre mot de passe"),
  role: z.nativeEnum(Role),
});

const beneficiarySchema = sharedSchema.extend({
  fullName: z.string().min(3, "Veuillez indiquer votre nom complet"),
  phone: z.string().optional(),
  city: z.string().optional(),
  needsDescription: z.string().min(10, "Décrivez vos besoins"),
});

const donorSchema = sharedSchema.extend({
  organizationName: z.string().min(3, "Veuillez indiquer le nom du donateur"),
  phone: z.string().optional(),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  donationPreferences: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const parsed = (() => {
      if (json?.role === Role.BENEFICIARY) {
        return beneficiarySchema.parse(json);
      }

      if (json?.role === Role.DONOR) {
        return donorSchema.parse(json);
      }

      throw new z.ZodError([
        {
          path: ["role"],
          message: "Rôle invalide",
          code: z.ZodIssueCode.custom,
        },
      ]);
    })();

    const { confirmPassword, password } = parsed;

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Les mots de passe ne correspondent pas" },
        { status: 422 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password: hashedPassword,
        role: parsed.role,
        name:
          parsed.role === Role.BENEFICIARY ? parsed.fullName : parsed.organizationName,
        phone: parsed.phone,
        city: parsed.role === Role.BENEFICIARY ? parsed.city : undefined,
        needsDescription:
          parsed.role === Role.BENEFICIARY ? parsed.needsDescription : undefined,
        website: parsed.role === Role.DONOR ? parsed.website || undefined : undefined,
        donationPreferences:
          parsed.role === Role.DONOR ? parsed.donationPreferences : undefined,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    });

    const userAgent = request.headers.get("user-agent") ?? undefined;
    const ipAddress = request.headers.get("x-forwarded-for") ?? undefined;

    const token = randomBytes(48).toString("hex");
    const expiresAt = addHours(new Date(), SESSION_DURATION_HOURS);

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", issues: error.flatten() },
        { status: 422 },
      );
    }

    console.error("[REGISTER_POST]", error);

    return NextResponse.json(
      { error: "Erreur interne lors de l'inscription" },
      { status: 500 },
    );
  }
}