export type RoleType = "BENEFICIARY" | "DONOR";

export type BeneficiaryRegisterPayload = {
  role: "BENEFICIARY";
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  city?: string;
  needsDescription: string;
};

export type DonorRegisterPayload = {
  role: "DONOR";
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  website?: string;
  donationPreferences?: string;
};

export type RegisterPayload = BeneficiaryRegisterPayload | DonorRegisterPayload;

export type RegisterResponse = {
  user: {
    id: string;
    email: string;
    role: RoleType;
    name: string;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = RegisterResponse;

const BASE_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as { error?: string; message?: string } | null)?.error ??
      (data as { message?: string } | null)?.message ??
      "Une erreur est survenue";
    throw new Error(message);
  }

  return data as T;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse<RegisterResponse>(response);
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify(payload),
  });

  return handleResponse<LoginResponse>(response);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/session", {
    method: "GET",
    headers: BASE_HEADERS,
  });

  if (response.status === 204) {
    return null;
  }

  return handleResponse<RegisterResponse>(response).then((data) => data.user);
}

export type AuthUser = RegisterResponse["user"];