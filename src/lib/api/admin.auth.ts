import { createServerFn } from "@tanstack/react-start";
import { clearSession, updateSession } from "@tanstack/react-start/server";
import { z } from "zod";

import {
  getAdminSessionConfig,
  isAdminAuthenticated,
  isAdminAuthConfigured,
  verifyAdminCredentials,
  type AdminSessionData,
} from "../auth/admin.server";

export const adminGetSession = createServerFn({ method: "GET" }).handler(async () => ({
  authed: await isAdminAuthenticated(),
}));

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    if (!isAdminAuthConfigured() || !verifyAdminCredentials(data.username, data.password)) {
      return { ok: false as const };
    }

    await updateSession<AdminSessionData>(getAdminSessionConfig(), { admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  if (!isAdminAuthConfigured()) return { ok: true as const };
  await clearSession(getAdminSessionConfig());
  return { ok: true as const };
});
