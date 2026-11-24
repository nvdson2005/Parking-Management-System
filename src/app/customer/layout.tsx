import { requireSection } from '@/server/auth/rbac'

/** Role check for every page under /customer (G-06, FR-43); see requireSection. */
export default async function SectionLayout({ children }: { children: React.ReactNode }) {
  await requireSection('/customer')
  return children
}
