import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pages publiques de l'espace admin : laisser passer sans auth check
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Mode dégradé : si clés non configurées, rediriger vers login sans planter
  if (
    !supabaseUrl ||
    supabaseUrl.includes('REMPLACER') ||
    !supabaseKey ||
    supabaseKey.includes('REMPLACER')
  ) {
    if (
      request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.includes('/admin/login')
    ) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (
      request.nextUrl.pathname.startsWith('/espace-apprenant') &&
      !request.nextUrl.pathname.includes('/connexion') &&
      !request.nextUrl.pathname.includes('/inscription')
    ) {
      return NextResponse.redirect(new URL('/espace-apprenant/connexion', request.url))
    }
    return NextResponse.next()
  }

  // Logique auth normale avec Supabase
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

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      if (
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.includes('/admin/login')
      ) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      if (
        request.nextUrl.pathname.startsWith('/espace-apprenant') &&
        !request.nextUrl.pathname.includes('/connexion') &&
        !request.nextUrl.pathname.includes('/inscription')
      ) {
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
