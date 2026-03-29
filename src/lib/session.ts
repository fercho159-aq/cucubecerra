import { cookies } from "next/headers";
import { v4 } from "./uuid";

/**
 * Read-only: returns the session ID if one exists, or null.
 * Safe to call from Server Components (layouts, pages).
 */
export async function getSessionIdReadOnly(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("cart_session")?.value ?? null;
}

/**
 * Returns the session ID, creating one if it doesn't exist.
 * Can ONLY be called from Server Actions or Route Handlers (sets a cookie).
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session")?.value;

  if (!sessionId) {
    sessionId = v4();
    cookieStore.set("cart_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }

  return sessionId;
}
