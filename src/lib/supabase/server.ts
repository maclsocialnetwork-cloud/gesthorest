import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function sanitizeUrl(url: string): string {
  return url.replace(/^﻿/, '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

export function createClient() {
  const cookieStore = cookies();
  const url = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!);

  return createServerClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "web_gesthorest" },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll appelé depuis un Server Component : ignoré si un middleware
            // rafraîchit déjà les sessions utilisateur.
          }
        },
      },
    }
  );
}

export function createAdminClient() {
  const url = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!);

  return createServerClient(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: "web_gesthorest" },
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}
