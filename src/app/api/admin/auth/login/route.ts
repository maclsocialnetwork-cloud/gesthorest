import { NextResponse } from 'next/server'

function getDynamicPassword(): string {
  const now = new Date()
  const year = now.getFullYear()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${day}-${month}@GESTHOREST`
}

const ADMIN_EMAIL = 'admin@gesthorest.com'
const COOKIE_NAME = 'gesthorest_admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 heures

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.trim().toLowerCase() !== ADMIN_EMAIL ||
      password !== getDynamicPassword()
    ) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }
}
