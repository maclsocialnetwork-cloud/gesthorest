import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function createSupabaseMiddleware(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/espace-apprenant/connexion", "/espace-apprenant/inscription"];
  if (publicPaths.includes(pathname)) {
    const response = NextResponse.next();
    const supabase = createSupabaseMiddleware(request, response);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL("/espace-apprenant/dashboard", request.url));
    }
    return response;
  }

  const response = NextResponse.next();
  const supabase = createSupabaseMiddleware(request, response);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/espace-apprenant/connexion", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/espace-apprenant/:path*", "/admin/:path*"],
};
