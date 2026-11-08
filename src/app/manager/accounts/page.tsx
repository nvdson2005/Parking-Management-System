'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useT } from '@/components/I18nProvider'

type User = {
  id: string
  email: string
  name: string
  roleCode: string
  userGroup: string | null
  locked: boolean
}

export default function ManagerAccountsPage() {
  const t = useT()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'STAFF' | 'MANAGER'>('STAFF')

  const load = useCallback(async () => {
    const res = await fetch('/api/accounts')
    const body = await res.json()
    setUsers(res.ok ? (body as User[]) : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load().catch(() => setLoading(false))
  }, [load])

  async function send(url: string, method: string, payload: unknown, key: string): Promise<boolean> {
    setError(null)
    setBusy(key)
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(t(`errors.${body.error ?? 'UNKNOWN_CODE'}`))
        return false
      }
      await load()
      return true
    } catch {
      setError(t('common.networkError'))
      return false
    } finally {
      setBusy(null)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    const ok = await send('/api/accounts', 'POST', { email, name, password, role }, 'create')
    if (ok) {
      setEmail('')
      setName('')
      setPassword('')
      setRole('STAFF')
    }
  }

  async function handleToggleLock(user: User) {
    await send(`/api/accounts/${user.id}`, 'PATCH', { locked: !user.locked }, `lock-${user.id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t('accounts.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('accounts.createTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-end gap-4" onSubmit={handleCreate}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-email">{t('accounts.email')}</Label>
              <Input id="acc-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-name">{t('accounts.name')}</Label>
              <Input id="acc-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-password">{t('accounts.password')}</Label>
              <Input
                id="acc-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-role">{t('accounts.role')}</Label>
              <select
                id="acc-role"
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as 'STAFF' | 'MANAGER')}
              >
                <option value="STAFF">{t('accounts.roles.STAFF')}</option>
                <option value="MANAGER">{t('accounts.roles.MANAGER')}</option>
              </select>
            </div>
            <Button type="submit" disabled={busy === 'create'}>
              {busy === 'create' ? t('accounts.creating') : t('accounts.create')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('accounts.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('accounts.email')}</TableHead>
              <TableHead>{t('accounts.name')}</TableHead>
              <TableHead>{t('accounts.role')}</TableHead>
              <TableHead>{t('accounts.group')}</TableHead>
              <TableHead>{t('accounts.locked')}</TableHead>
              <TableHead>{t('accounts.action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{t(`accounts.roles.${user.roleCode}`)}</TableCell>
                <TableCell>{user.userGroup ? t(`accounts.groups.${user.userGroup}`) : '—'}</TableCell>
                <TableCell>{user.locked ? t('accounts.yes') : t('accounts.no')}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === `lock-${user.id}`}
                    onClick={() => handleToggleLock(user)}
                  >
                    {user.locked ? t('accounts.unlock') : t('accounts.lock')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
