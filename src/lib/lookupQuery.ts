import type { IdMethod } from '@/lib/types'

const METHODS: IdMethod[] = ['PLATE', 'QR', 'RFID']

export type LookupQuery =
  | { kind: 'empty'; method: IdMethod; identifier: '' }
  | { kind: 'search'; method: IdMethod; identifier: string }
  | { kind: 'invalid'; method: IdMethod; identifier: '' }

/**
 * Reads the Staff lookup page's query string (A-65, G-08). Next.js gives a
 * repeated key as an array, so each value is checked before use: a repeated
 * or unknown `method`, or a repeated `identifier`, is an invalid query rather
 * than an error page. An absent or blank identifier means "no search yet".
 */
export function parseLookupQuery(raw: Record<string, string | string[] | undefined>): LookupQuery {
  const { method: rawMethod, identifier: rawIdentifier } = raw
  if (Array.isArray(rawMethod) || Array.isArray(rawIdentifier)) {
    return { kind: 'invalid', method: 'PLATE', identifier: '' }
  }
  if (rawMethod !== undefined && !METHODS.includes(rawMethod as IdMethod)) {
    return { kind: 'invalid', method: 'PLATE', identifier: '' }
  }
  const method = (rawMethod as IdMethod | undefined) ?? 'PLATE'
  const identifier = rawIdentifier?.trim() ?? ''
  return identifier ? { kind: 'search', method, identifier } : { kind: 'empty', method, identifier: '' }
}
