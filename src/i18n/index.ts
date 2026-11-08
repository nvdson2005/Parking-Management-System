import { vi } from './vi'
import { en } from './en'

export type Lang = 'vi' | 'en'

// Recursively widens the Vietnamese dictionary's string-literal leaf types to
// plain `string`, so `en.ts` can assign its own translated strings while
// still being forced (by the compiler) to declare the exact same key shape.
// `en.ts` only imports the `Dict` *type* from this module (erased at compile
// time), so this is not a runtime circular import.
type DeepString<T> = T extends string ? string : { [K in keyof T]: DeepString<T[K]> }

export type Dict = DeepString<typeof vi>

export const LANG_COOKIE = 'lang'

const DICTS: Record<Lang, Dict> = { vi, en }

export function getDict(lang: Lang): Dict {
  return DICTS[lang]
}

// `next/headers` is dynamically imported so this module stays free of a
// static server-only import: `I18nProvider.tsx` ('use client') also imports
// from this module (for `Dict`/`Lang`/`t`), and a top-level `next/headers`
// import here would make Next.js refuse to bundle it for the client.
export async function getLang(): Promise<Lang> {
  const { cookies } = await import('next/headers')
  const store = await cookies()
  const value = store.get(LANG_COOKIE)?.value
  return value === 'en' ? 'en' : 'vi'
}

export function t(dict: Dict, key: string): string {
  const parts = key.split('.')
  let node: unknown = dict
  for (const part of parts) {
    if (typeof node !== 'object' || node === null) return key
    node = (node as Record<string, unknown>)[part]
  }
  return typeof node === 'string' ? node : key
}
