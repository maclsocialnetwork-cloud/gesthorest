import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'gesthorest_admin_session'
const APPRENANT_COOKIE = 'gesthorest_apprenant_session'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin login est public
  if (pathname === '/admin/login') return NextResponse.next()

  const hasAdminCookie =
    request.cookies.get(ADMIN_COOKIE)?.value === '1'

  // Protection admin — cookie uniquement
  if (pathname.startsWith('/admin')) {
    if (!hasAdminCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // Espace apprenant — cookie UUID uniquement (connexion + inscription sont publiques)
  if (
    pathname.startsWith('/espace-apprenant') &&
    !pathname.includes('/connexion') &&
    !pathname.includes('/inscription')
  ) {
    const apprenantVal = request.cookies.get(APPRENANT_COOKIE)?.value ?? ''
    const hasApprenantCookie = UUID_RE.test(apprenantVal)
    if (!hasApprenantCookie) {
      return NextResponse.redirect(
        new URL('/espace-apprenant/connexion', request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin(.*)', '/espace-apprenant(.*)'],
}
