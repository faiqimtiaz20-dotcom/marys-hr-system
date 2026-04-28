import { mockOtpCode, mockUsers } from "@/mocks/auth";
import { AuthResult } from "@/types/auth";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  await wait(700);

  const user = mockUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user || password.length < 8) {
    return {
      success: false,
      message: "Invalid email or password. Use a registered email and valid password.",
    };
  }

  return {
    success: true,
    message: `Welcome back, ${user.fullName}.`,
  };
}

export async function registerAccount(email: string): Promise<AuthResult> {
  await wait(800);

  const alreadyExists = mockUsers.some((item) => item.email.toLowerCase() === email.toLowerCase());
  if (alreadyExists) {
    return {
      success: false,
      message: "This email is already registered. Please login instead.",
    };
  }

  return {
    success: true,
    message: "Account created. Continue with onboarding setup.",
  };
}

export async function requestResetLink(email: string): Promise<AuthResult> {
  await wait(600);

  const exists = mockUsers.some((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    return {
      success: false,
      message: "No account found with this email.",
    };
  }

  return {
    success: true,
    message: "Reset link sent successfully.",
  };
}

export async function verifyOtpCode(code: string): Promise<AuthResult> {
  await wait(500);

  if (code !== mockOtpCode) {
    return {
      success: false,
      message: "Invalid OTP code. Use 123456 for mock flow.",
    };
  }

  return {
    success: true,
    message: "OTP verified successfully.",
  };
}

export async function resetPassword(): Promise<AuthResult> {
  await wait(700);
  return {
    success: true,
    message: "Password updated successfully. You can now login.",
  };
}

export async function acceptInvitation(password: string): Promise<AuthResult> {
  await wait(700);
  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long.",
    };
  }
  return {
    success: true,
    message: "Invitation accepted. Your account is now active.",
  };
}

export async function loginWithSso(provider: "google" | "microsoft"): Promise<AuthResult> {
  await wait(650);
  return {
    success: true,
    message: `Signed in with ${provider === "google" ? "Google" : "Microsoft"} successfully.`,
  };
}
