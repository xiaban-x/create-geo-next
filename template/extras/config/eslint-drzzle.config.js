import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const tslintConfig = tseslint.config(
    {ignores: ["dist"]},
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "drizzle": drizzle,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                {allowConstantExport: true},
            ],
            "drizzle/enforce-delete-with-where": [
                "error",
                { drizzleObjectName: ["db", "ctx.db"] },
            ],
            "drizzle/enforce-update-with-where": [
                "error",
                { drizzleObjectName: ["db", "ctx.db"] },
            ],
        },
    }
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const _initialConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    ...tslintConfig,
];

export {_initialConfig};
