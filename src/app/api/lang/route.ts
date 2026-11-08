import { z } from 'zod'
import { cookies } from 'next/headers'
import { handle } from '@/server/api'
import { LANG_COOKIE } from '@/i18n'

const LANG_MAX_AGE = 60 * 60 * 24 * 365

const bodySchema = z.object({
  lang: z.enum(['vi', 'en']),
})

export const POST = handle(async (req) => {
  const body = await req.json()
  const { lang } = bodySchema.parse(body)

  const store = await cookies()
  store.set(LANG_COOKIE, lang, {
    path: '/',
    maxAge: LANG_MAX_AGE,
    sameSite: 'lax',
  })

  return { lang }
})
