import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'gesthorest_admin_session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/login est une page publique — toujours laisser passer
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Cookie de session admin local (posé par /api/admin/auth/login)
  const hasAdminCookie = request.cookies.get(ADMIN_COOKIE)?.value === '1'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Mode dégradé : clés Supabase absentes ou placeholder
  if (
    !supabaseUrl ||
    supabaseUrl.includes('REMPLACER') ||
    !supabaseKey ||
    supabaseKey.includes('REMPLACER')
  ) {
    if (pathname.startsWith('/admin')) {
      if (!hasAdminCookie) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return NextResponse.next()
    }
    if (
      pathname.startsWith('/espace-apprenant') &&
      !pathname.includes('/connexion') &&
      !pathname.includes('/inscription')
    ) {
      return NextResponse.redirect(new URL('/espace-apprenant/connexion', request.url))
    }
    return NextResponse.next()
  }

  // Mode normal avec Supabase
  try {
    const { createServerClient } = await import('@supabase/ssr')
    const response = NextResponse.next({ request: { headers: request.headers } })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    })

    const { data: { session } } = await supabase.auth.getSession()

    // Admin : cookie local OU session Supabase suffisent
    if (pathname.startsWith('/admin')) {
      if (!session && !hasAdminCookie) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return response
    }

    // Espace apprenant : session Supabase uniquement
    if (
      pathname.startsWith('/espace-apprenant') &&
      !pathname.includes('/connexion') &&
      !pathname.includes('/inscription')
    ) {
      if (!session) {
        return NextResponse.redirect(new URL('/espace-apprenant/connexion', request.url))
      }
    }

    return response
  } catch (e) {
    console.error('Middleware error:', e)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin(.*)', '/espace-apprenant(.*)'],
}
