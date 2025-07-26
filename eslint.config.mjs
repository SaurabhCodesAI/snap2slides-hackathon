// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigAsPlugin } from "@eslint/compat";

export default tseslint.config(
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      fixupConfigAsPlugin(pluginReactConfig),
    ],
    rules: {
      // Common rules to adjust for flexibility in development:
      "react/react-in-jsx-scope": "off", // Not required with Next.js's automatic React runtime.
      "@typescript-eslint/no-explicit-any": "off", // Allows 'any' type, useful for quick development.
      "@typescript-eslint/ban-ts-comment": "off", // Allows TypeScript comments like @ts-ignore.
    },
  },
  {
    // Specific overrides for Next.js applications.
    files: ["app/**/*.{ts,tsx}", "pages/**/*.{ts,tsx}"],
    extends: ["eslint-config-next"],
    rules: {
      // Add Next.js specific ESLint rules or overrides here if needed.
    }
  }
);