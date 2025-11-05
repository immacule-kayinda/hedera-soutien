import { NextResponse } from "next/server";
import { z } from "zod";

const donorSchema = z.object({
  organizationName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  donationPreferences: z.string().optional(),
});

export type DonorRegistration = z.infer<typeof donorSchema>;

const donors: Array<{
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  donationPreferences?: string;
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = donorSchema.parse(body);

    if (donors.some((item) => item.email === data.email)) {
      return NextResponse.json(
        { message: "Un donateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    const donor = {
      id: `donor-${Date.now()}`,
      name: data.organizationName,
      email: data.email,
      phone: data.phone,
      website: data.website,
      donationPreferences: data.donationPreferences,
    };

    donors.push(donor);

    const { password, confirmPassword, ...responsePayload } = data;

    return NextResponse.json(
      {
        ...responsePayload,
        id: donor.id,
        name: donor.name,
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
      { message: "Erreur interne lors de la création du donateur" },
      { status: 500 }
    );
  }
}