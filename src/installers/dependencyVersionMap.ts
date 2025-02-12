/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
    // maplibre
    "maplibre-gl": "^5.1.0",
    "react-map-gl": "^8.0.1",
    // Prisma
    prisma: "^5.14.0",
    "@prisma/client": "^5.14.0",
    "@prisma/adapter-planetscale": "^5.14.0",

    // Drizzle
    "drizzle-kit": "^0.24.0",
    "drizzle-orm": "^0.33.0",
    "eslint-plugin-drizzle": "^0.2.3",
    mysql2: "^3.11.0",
    "@planetscale/database": "^1.19.0",
    postgres: "^3.4.4",
    "@libsql/client": "^0.9.0",

    // TailwindCSS
    tailwindcss: "^3.4.3",
    postcss: "^8.4.39",
    prettier: "^3.3.2",
    "prettier-plugin-tailwindcss": "^0.6.5",


    superjson: "^2.2.1",
    "server-only": "^0.0.1",
} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;
