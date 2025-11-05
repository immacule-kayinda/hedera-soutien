import { NextResponse } from "next/server";
import { z } from "zod";

const beneficiarySchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  phone: z.string().optional(),
  city: z.string().optional(),
  needsDescription: z.string().min(10),
});

export type BeneficiaryRegistration = z.infer<typeof beneficiarySchema>;

const beneficiaries: Array<{
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  needsDescription: string;
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = beneficiarySchema.parse(body);

    if (beneficiaries.some((item) => item.email === data.email)) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email" },
        { status: 409 }
      );
    }

    const beneficiary = {
      id: `beneficiary-${Date.now()}`,
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      needsDescription: data.needsDescription,
    };

    beneficiaries.push(beneficiary);

    const { password, confirmPassword, ...responsePayload } = data;

    return NextResponse.json(
      {
        ...responsePayload,
        id: beneficiary.id,
        name: beneficiary.name,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Données invalides", issues: error.flatten() },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { message: "Erreur interne lors de la création du bénéficiaire" },
      { status: 500 }
    );
  }
}