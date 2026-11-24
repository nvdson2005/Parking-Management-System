import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

// CR-03 group B (A-49 observation): `--font-sans: var(--font-sans)` refers to
// itself, resolves to nothing, and every page falls back to the browser serif.
const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8')

describe('globals.css fonts (FR-012, spec 006)', () => {
  it('maps the sans and heading fonts to the Geist variable loaded in layout.tsx', () => {
    expect(css).toMatch(/--font-sans:\s*var\(--font-geist-sans\)/)
    expect(css).toMatch(/--font-heading:\s*var\(--font-geist-sans\)/)
  })

  it('has no custom property that refers to itself', () => {
    const selfRefs = [...css.matchAll(/(--[\w-]+):\s*var\((--[\w-]+)\)/g)].filter((m) => m[1] === m[2])
    expect(selfRefs.map((m) => m[0])).toEqual([])
  })

  // T020 finding: `font-sans` was applied on <html>, but the Geist variable is
  // set by a class on <body>, so on <html> the variable is undefined and body
  // text still fell back to serif (headings inside <body> looked right).
  it('applies font-sans on the element that defines the Geist variable', () => {
    const layout = readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8')
    const variableTag = layout.match(/<(html|body)\b[^>]*geistSans\.variable/)?.[1]
    const fontSansTag = css.match(/\b(html|body)\s*\{[^}]*@apply[^;}]*\bfont-sans\b/)?.[1]
    expect(variableTag).toBeDefined()
    expect(fontSansTag).toBe(variableTag)
  })
})

