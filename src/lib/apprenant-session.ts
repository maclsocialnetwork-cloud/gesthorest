import { cookies } from "next/headers";

export const APPRENANT_COOKIE = "gesthorest_apprenant_session";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getApprenantId(): string | null {
  const val = cookies().get(APPRENANT_COOKIE)?.value;
  if (!val || !UUID_RE.test(val)) return null;
  return val;
}
