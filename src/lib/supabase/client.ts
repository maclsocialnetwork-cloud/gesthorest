import { createBrowserClient } from "@supabase/ssr";

function sanitizeUrl(url: string): string {
  return url.replace(/^﻿/, '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

export function createClient() {
  const url = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!);

  return createBrowserClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "web_gesthorest" },
    }
  );
}
