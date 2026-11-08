'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useT } from '@/components/I18nProvider'
import type { UserGroup } from '@/lib/types'

export default function RegisterPage() {
  const t = useT()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [userGroup, setUserGroup] = useState<UserGroup>('STUDENT')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, userGroup }),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(t(`errors.${body.error ?? 'UNKNOWN_CODE'}`))
        return
      }
      router.push('/customer')
      router.refresh()
    } catch {
      // fetch rejected (offline, DNS failure, etc.) rather than resolving
      setError(t('common.networkError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('auth.register.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">{t('auth.register.name')}</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t('auth.register.email')}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t('auth.register.password')}</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="userGroup">{t('auth.register.userGroup')}</Label>
              <Select value={userGroup} onValueChange={(value) => setUserGroup(value as UserGroup)}>
                <SelectTrigger id="userGroup" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">{t('auth.register.userGroupStudent')}</SelectItem>
                  <SelectItem value="LECTURER_STAFF">
                    {t('auth.register.userGroupLecturerStaff')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? t('auth.register.submitting') : t('auth.register.submit')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('auth.register.haveAccount')}{' '}
              <Link href="/login" className="text-foreground hover:underline">
                {t('auth.register.loginLink')}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
