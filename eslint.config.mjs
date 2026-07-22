import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow `any` types — codebase uses them extensively in API integrations
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars as warnings rather than errors
      "@typescript-eslint/no-unused-vars": "warn",
      // These patterns are intentional in the codebase (map library, data fetching)
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/exhaustive-deps": "warn",
      // JSX in try/catch is an established pattern for server component error handling
      "react-hooks/error-boundaries": "warn",
    },
  },
]);

export default eslintConfig;
