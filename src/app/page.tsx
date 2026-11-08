import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/server/auth/session'
import type { Role } from '@/lib/types'

const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: '/customer',
  STAFF: '/staff',
  MANAGER: '/manager',
}

export default async function HomePage() {
  const user = await getCurrentUser()
  redirect(user ? ROLE_HOME[user.role] : '/login')
}
