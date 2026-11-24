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
})
