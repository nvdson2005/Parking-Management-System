'use client'

import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { t } from '@/i18n'
import type { Dict, Lang } from '@/i18n'

type I18nContextValue = {
  lang: Lang
  dict: Dict
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  lang,
  dict,
  children,
}: {
  lang: Lang
  dict: Dict
  children: ReactNode
}) {
  const value = useMemo(() => ({ lang, dict }), [lang, dict])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT/useLang must be used within I18nProvider')
  return ctx
}

export function useT(): (key: string) => string {
  const { dict } = useI18n()
  return (key: string) => t(dict, key)
}

export function useLang(): Lang {
  return useI18n().lang
}
