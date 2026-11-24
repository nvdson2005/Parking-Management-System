import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".worktrees/**",
    ],
  },
  {
    // Baseline V1.0 generators, frozen at tag baseline-v1.0 (docs/m3/baseline-v1.0-freeze.md,
    // rule 5 of docs/m3-m4-work-division.md): editing them would break the freeze check, so
    // their two unused locals (GAP in diagrams.mjs, deterministicMakespan in schedule.mjs)
    // are not linted for unused variables. Everything else in them is still linted.
    files: ["docs/m2-report/scripts/diagrams.mjs", "docs/m2-report/scripts/schedule.mjs"],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
];

export default eslintConfig;
