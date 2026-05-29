import { timingSafeEqual } from "node:crypto";
import { getSession } from "@tanstack/react-start/server";

const SESSION_COOKIE_NAME = "layeronic-admin";

export type AdminSessionData = {
  admin?: boolean;
};

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    sessionSecret: process.env.ADMIN_SESSION_SECRET ?? "",
  };
}

export function isAdminAuthConfigured(): boolean {
  const { username, password, sessionSecret } = getAdminCredentials();
  return username.length > 0 && password.length > 0 && sessionSecret.length >= 32;
}

export function getAdminSessionConfig() {
  const { sessionSecret } = getAdminCredentials();
  if (sessionSecret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  }

  return {
    name: SESSION_COOKIE_NAME,
    password: sessionSecret,
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  };
}

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  if (!isAdminAuthConfigured()) return false;
  const expected = getAdminCredentials();
  return safeEqual(username, expected.username) && safeEqual(password, expected.password);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminAuthConfigured()) return false;
  try {
    const session = await getSession<AdminSessionData>(getAdminSessionConfig());
    return session.data?.admin === true;
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Response("Unauthorized", { status: 401 });
  }
}
