// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigAsPlugin } from "@eslint/compat";

export default tseslint.config(
  {
    // Apply to all supported file types
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        ecmaFeatures: { 
          jsx: true,
          generators: true,
          objectRestSpread: true,
        },
      },
      globals: { 
        ...globals.browser, 
        ...globals.node,
        ...globals.es2024,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      fixupConfigAsPlugin(pluginReactConfig),
    ],
    rules: {
      // React rules
      "react/react-in-jsx-scope": "off", // Not required with Next.js automatic React runtime
      "react/prop-types": "off", // Using TypeScript for prop validation
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/display-name": "warn",
      "react/jsx-key": "error",
      "react/no-array-index-key": "warn",
      "react/no-unescaped-entities": "warn",
      "react/self-closing-comp": "warn",
      
      // TypeScript rules - balanced approach for development speed
      "@typescript-eslint/no-explicit-any": "warn", // Warn but allow for rapid development
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true 
      }],
      "@typescript-eslint/ban-ts-comment": ["warn", {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": "allow-with-description",
        "ts-nocheck": false,
        "ts-check": false,
      }],
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
      
      // General code quality rules
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "warn",
      "no-duplicate-imports": "error",
      "no-unreachable": "error",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "prefer-template": "warn",
      "object-shorthand": "warn",
      "arrow-function-preference": "off", // Allow both arrow and regular functions
      
      // Performance and accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
    },
  },
  {
    // Specific overrides for Next.js applications
    files: ["app/**/*.{ts,tsx}", "pages/**/*.{ts,tsx}"],
    extends: ["next/core-web-vitals"],
    rules: {
      // Next.js specific rules
      "@next/next/no-img-element": "warn", // Prefer Next.js Image component
      "@next/next/no-page-custom-font": "warn",
      "@next/next/no-css-tags": "error",
      "@next/next/no-sync-scripts": "error",
    }
  },
  {
    // Test files - more relaxed rules
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-console": "off",
    }
  },
  {
    // Configuration files - allow CommonJS
    files: ["*.config.{js,mjs,cjs}", "*.setup.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off",
    }
  }
);