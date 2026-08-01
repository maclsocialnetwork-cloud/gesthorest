import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = {
  title: 'Administration',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const hasAdminCookie = cookieStore.get('gesthorest_admin_session')?.value === '1'

  // Tentative d'auth Supabase
  let displayName = 'Administrateur'
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: apprenant } = await supabase
        .from('apprenants')
        .select('nom, prenom, role')
        .eq('user_id', user.id)
        .single()

      if (apprenant && apprenant.role === 'admin') {
        displayName = `${apprenant.prenom} ${apprenant.nom}`
        return <AdminShell displayName={displayName}>{children}</AdminShell>
      }
    }
  } catch {
    // Supabase non configuré ou erreur → on continue avec le cookie
  }

  // Cookie de session admin local
  if (hasAdminCookie) {
    return <AdminShell displayName={displayName}>{children}</AdminShell>
  }

  // Pas de session valide → laisser passer (le middleware gère la redirection,
  // ici on est sur /admin/login ou une route qui a contourné le middleware)
  return <>{children}</>
}
