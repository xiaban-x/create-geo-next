import {type PackageManager} from "../utils/getUserPkgManager";

// Turning this into a const allows the list to be iterated over for programmatically creating prompt options
// Should increase extensibility in the future
export const availablePackages = [
    "prisma",
    "drizzle",
    "tailwind",
    "unocss",
    "mapbox",
    "maplibre",
    "openLayers",
    "cesium",
    "envVariables",
    "eslint",
    "dbContainer",
] as const;
export type AvailablePackages = (typeof availablePackages)[number];

export const databaseProviders = [
    "mysql",
    "postgres",
    "sqlite",
    "planetscale",
] as const;
export type DatabaseProvider = (typeof databaseProviders)[number];

export interface InstallerOptions {
    projectDir: string;
    pkgManager: PackageManager;
    noInstall: boolean;
    packages?: PkgInstallerMap;
    appRouter?: boolean;
    projectName: string;
    scopedAppName: string;
    databaseProvider: DatabaseProvider;
}

export type Installer = (opts: InstallerOptions) => void;

export type PkgInstallerMap = {
    [pkg in AvailablePackages]: {
        inUse: boolean;
        installer: Installer;
    };
};

// export const buildPkgInstallerMap = (
//     packages: AvailablePackages[],
//     databaseProvider: DatabaseProvider
// ): PkgInstallerMap => ({
//     prisma: {
//         inUse: packages.includes("prisma"),
//         installer: prismaInstaller,
//     },
//     drizzle: {
//         inUse: packages.includes("drizzle"),
//         installer: drizzleInstaller,
//     },
//     tailwind: {
//         inUse: packages.includes("tailwind"),
//         installer: tailwindInstaller,
//     },
//     dbContainer: {
//         inUse: ["mysql", "postgres"].includes(databaseProvider),
//         installer: dbContainerInstaller,
//     },
//     envVariables: {
//         inUse: true,
//         installer: envVariablesInstaller,
//     },
//     eslint: {
//         inUse: true,
//         installer: dynamicEslintInstaller,
//     },
// });
