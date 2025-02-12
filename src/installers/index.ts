import {type PackageManager} from "../utils/getUserPkgManager";
import {prismaInstaller} from "./prisma.ts";
import {drizzleInstaller} from "./drizzle.ts";
import {tailwindInstaller} from "./tailwind.ts";
import {dbContainerInstaller} from "./dbContainer.ts";
import {envVariablesInstaller} from "./envVars.ts";
import {dynamicEslintInstaller} from "./eslint.ts";
import {unocssInstaller} from "./unocss.ts";
import {maplibreInstaller} from "./maplibre.ts";
import {mapboxInstaller} from "./mapbox.ts";
import {openLayersInstaller} from "./openLayers.ts";
import {cesiumInstaller} from "./cesium.ts";

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

export const buildPkgInstallerMap = (
    packages: AvailablePackages[],
    databaseProvider: DatabaseProvider
): PkgInstallerMap => ({
    maplibre: {
        inUse: packages.includes("maplibre"),
        installer: maplibreInstaller,
    },
    mapbox: {
        inUse: packages.includes("mapbox"),
        installer: mapboxInstaller,
    },
    openLayers: {
        inUse: packages.includes("openLayers"),
        installer: openLayersInstaller,
    },
    cesium: {
        inUse: packages.includes("cesium"),
        installer: cesiumInstaller,
    },
    prisma: {
        inUse: packages.includes("prisma"),
        installer: prismaInstaller,
    },
    drizzle: {
        inUse: packages.includes("drizzle"),
        installer: drizzleInstaller,
    },
    tailwind: {
        inUse: packages.includes("tailwind"),
        installer: tailwindInstaller,
    },
    unocss: {
        inUse: packages.includes("unocss"),
        installer: unocssInstaller,
    },
    dbContainer: {
        inUse: ["mysql", "postgres"].includes(databaseProvider),
        installer: dbContainerInstaller,
    },
    envVariables: {
        inUse: true,
        installer: envVariablesInstaller,
    },
    eslint: {
        inUse: true,
        installer: dynamicEslintInstaller,
    },
});
