import * as p from "@clack/prompts";
import chalk from "chalk";
import {Command} from "commander";

import {CREATE_GEO_NEXT, DEFAULT_APP_NAME} from "../consts";
import {
    databaseProviders,
    type AvailablePackages,
    type DatabaseProvider,
} from "../installers";
import {getVersion} from "../utils/getVersion.ts";
import {getUserPkgManager} from "../utils/getUserPkgManager";
import {IsTTYError} from "../utils/isTTYError";
import {logger} from "../utils/logger";
import {validateAppName} from "../utils/validateAppName";
import {validateImportAlias} from "../utils/validateImportAlias";

interface CliFlags {
    noGit: boolean;
    noInstall: boolean;
    default: boolean;
    importAlias: string;

    /** @internal Used in CI. */
    CI: boolean;
    /** @internal Used in CI. */
    tailwind: boolean;
    /** @internal Used in CI. */
    unocss: boolean;
    /** @internal Used in CI. */
    prisma: boolean;
    /** @internal Used in CI. */
    drizzle: boolean;
    /** @internal Used in CI. */
    maplibre: boolean;
    /** @internal Used in CI. */
    mapbox: boolean;
    /** @internal Used in CI. */
    openLayers: boolean;
    /** @internal Used in CI. */
    cesium: boolean;
    /** @internal Used in CI. */
    dbProvider: DatabaseProvider;
}

interface CliResults {
    appName: string;
    packages: AvailablePackages[];
    flags: CliFlags;
    databaseProvider: DatabaseProvider;
}

const defaultOptions: CliResults = {
    appName: DEFAULT_APP_NAME,
    packages: ["maplibre", "unocss", "prisma"],
    flags: {
        noGit: false,
        noInstall: false,
        default: false,
        CI: false,
        unocss: false,
        tailwind: false,
        prisma: false,
        drizzle: false,
        maplibre: false,
        mapbox: false,
        openLayers: false,
        cesium: false,
        importAlias: "~/",
        dbProvider: "postgres",
    },
    databaseProvider: "postgres",

};

export const runCli = async (): Promise<CliResults> => {
    const cliResults = defaultOptions;

    const program = new Command()
        .name(CREATE_GEO_NEXT)
        .description("A CLI for creating web applications with the gis")
        .argument(
            "[dir]",
            "The name of the application, as well as the name of the directory to create"
        )
        .option(
            "--noGit",
            "Explicitly tell the CLI to not initialize a new git repo in the project",
            false
        )
        .option(
            "--noInstall",
            "Explicitly tell the CLI to not run the package manager's install command",
            false
        )
        .option(
            "-y, --default",
            "Bypass the CLI and use all default options to bootstrap a new geo-next",
            false
        )
        /** START CI-FLAGS */
        /**
         * @experimental Used for CI E2E tests. If any of the following option-flags are provided, we
         *               skip prompting.
         */
        .option("--CI", "Boolean value if we're running in CI", false)
        /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
        .option(
            "--unocss [boolean]",
            "Experimental: Boolean value if we should install UnoCSS. Must be used in conjunction with `--CI`.",
            (value) => !!value && value !== "false"
        )
        .option(
            "--prisma [boolean]",
            "Experimental: Boolean value if we should install Prisma. Must be used in conjunction with `--CI`.",
            (value) => !!value && value !== "false"
        )
        .option(
            "--drizzle [boolean]",
            "Experimental: Boolean value if we should install Drizzle. Must be used in conjunction with `--CI`.",
            (value) => !!value && value !== "false"
        )
        .option(
            "-i, --import-alias",
            "Explicitly tell the CLI to use a custom import alias",
            defaultOptions.flags.importAlias
        )
        .option(
            "--dbProvider [provider]",
            `Choose a database provider to use. Possible values: ${databaseProviders.join(
                ", "
            )}`,
            defaultOptions.flags.dbProvider
        )
        /** END CI-FLAGS */
        .version(getVersion(), "-v, --version", "Display the version number")
        .addHelpText(
            "afterAll",
            `\n The geo-next reference is from ${chalk
                .hex("#E8DCFF")
                .bold(
                    "@create-t3-app"
                )} \n`
        )
        .parse(process.argv);

    // FIXME: TEMPORARY WARNING WHEN USING YARN 3. SEE ISSUE #57
    if (process.env.npm_config_user_agent?.startsWith("yarn/3")) {
        logger.warn(`  WARNING: It looks like you are using Yarn 3. This is currently not supported,
  and likely to result in a crash. Please run create-t3-app with another
  package manager such as pnpm, npm, or Yarn Classic.
  See: https://github.com/t3-oss/create-t3-app/issues/57`);
    }

    // Needs to be separated outside the if statement to correctly infer the type as string | undefined
    const cliProvidedName = program.args[0];
    if (cliProvidedName) {
        cliResults.appName = cliProvidedName;
    }

    cliResults.flags = program.opts();

    /** @internal Used for CI E2E tests. */
    if (cliResults.flags.CI) {
        cliResults.packages = [];
        if (cliResults.flags.tailwind) cliResults.packages.push("tailwind");
        if (cliResults.flags.unocss) cliResults.packages.push("unocss");
        if (cliResults.flags.prisma) cliResults.packages.push("prisma");
        if (cliResults.flags.drizzle) cliResults.packages.push("drizzle");
        if (cliResults.flags.mapbox) cliResults.packages.push("mapbox");
        if (cliResults.flags.maplibre) cliResults.packages.push("maplibre");
        if (cliResults.flags.openLayers) cliResults.packages.push("openLayers");
        if (cliResults.flags.cesium) cliResults.packages.push("cesium");
        if (cliResults.flags.prisma && cliResults.flags.drizzle) {
            // We test a matrix of all possible combination of packages in CI. Checking for impossible
            // combinations here and exiting gracefully is easier than changing the CI matrix to exclude
            // invalid combinations. We are using an "OK" exit code so CI continues with the next combination.
            logger.warn("Incompatible combination Prisma + Drizzle. Exiting.");
            process.exit(0);
        }
        if (cliResults.flags.mapbox && cliResults.flags.maplibre) {
            logger.warn("Incompatible combination Mapbox + Maplibre. Exiting.");
            process.exit(0);
        }
        const selectedFlags = (['mapbox', 'maplibre', 'openLayers', 'cesium'] as Array<keyof CliFlags>)
            .filter(flag => cliResults.flags[flag]);

        if (selectedFlags.length > 1) {
            logger.warn(`Incompatible combination of flags: ${selectedFlags.join(' + ')}. Exiting.`);
            process.exit(0);
        }

        if (!databaseProviders.includes(cliResults.flags.dbProvider)) {
            logger.warn(
                `Incompatible database provided. Use: ${databaseProviders.join(", ")}. Exiting.`
            );
            process.exit(0);
        }
        cliResults.databaseProvider =
            cliResults.packages.includes("drizzle") ||
            cliResults.packages.includes("prisma")
                ? cliResults.flags.dbProvider
                : "postgres";

        return cliResults;
    }

    if (cliResults.flags.default) {
        return cliResults;
    }

    // Explained below why this is in a try/catch block
    try {
        if (process.env.TERM_PROGRAM?.toLowerCase().includes("mintty")) {
            logger.warn(`  WARNING: It looks like you are using MinTTY, which is non-interactive. This is most likely because you are
  using Git Bash. If that's that case, please use Git Bash from another terminal, such as Windows Terminal. Alternatively, you
  can provide the arguments from the CLI directly: https://create.t3.gg/en/installation#experimental-usage to skip the prompts.`);

            throw new IsTTYError("Non-interactive environment");
        }

        // if --CI flag is set, we are running in CI mode and should not prompt the user

        const pkgManager = getUserPkgManager();

        const project = await p.group(
            {
                ...(!cliProvidedName && {
                    name: () =>
                        p.text({
                            message: "What will your project be called?",
                            defaultValue: cliProvidedName,
                            validate: validateAppName,
                        }),
                }),
                language: () => {
                    return p.select({
                        message: "Will you be using TypeScript or JavaScript?",
                        options: [
                            {value: "typescript", label: "TypeScript"},
                            {value: "javascript", label: "JavaScript"},
                        ],
                        initialValue: "typescript",
                    });
                },
                _: ({results}) =>
                    results.language === "javascript"
                        ? p.note(chalk.redBright("Wrong answer, using TypeScript instead"))
                        : undefined,
                mappingLib: () => {
                    return p.select({
                        message: "Will you be using which mapping library?",
                        options: [
                            {value: "maplibre", label: "Maplibre"},
                            {value: "mapbox", label: "Mapbox"},
                            {value: "openLayers", label: "OpenLayers"},
                            {value: "cesium", label: "Cesium"},
                        ],
                        initialValue: "maplibre",
                    });
                },
                styling: () => {
                    return p.select({
                        message: "Will you be using Tailwind CSS for styling?",
                        options: [
                            {value: "none", label: "None"},
                            {value: "unocss", label: "UnoCSS"},
                            {value: "tailwind", label: "Tailwind CSS"},
                        ],
                        initialValue: "unocss",
                    });
                },
                database: () => {
                    return p.select({
                        message: "What database ORM would you like to use?",
                        options: [
                            {value: "none", label: "None"},
                            {value: "prisma", label: "Prisma"},
                            {value: "drizzle", label: "Drizzle"},
                        ],
                        initialValue: "none",
                    });
                },
                databaseProvider: ({results}) => {
                    if (results.database === "none") return;
                    return p.select({
                        message: "What database provider would you like to use?",
                        options: [
                            {value: "sqlite", label: "SQLite (LibSQL)"},
                            {value: "mysql", label: "MySQL"},
                            {value: "postgres", label: "PostgreSQL"},
                            {value: "planetscale", label: "PlanetScale"},
                        ],
                        initialValue: "postgres",
                    });
                },
                ...(!cliResults.flags.noGit && {
                    git: () => {
                        return p.confirm({
                            message:
                                "Should we initialize a Git repository and stage the changes?",
                            initialValue: !defaultOptions.flags.noGit,
                        });
                    },
                }),
                ...(!cliResults.flags.noInstall && {
                    install: () => {
                        return p.confirm({
                            message:
                                `Should we run '${pkgManager}` +
                                (pkgManager === "yarn" ? `'?` : ` install' for you?`),
                            initialValue: !defaultOptions.flags.noInstall,
                        });
                    },
                }),
                importAlias: () => {
                    return p.text({
                        message: "What import alias would you like to use?",
                        defaultValue: defaultOptions.flags.importAlias,
                        placeholder: defaultOptions.flags.importAlias,
                        validate: validateImportAlias,
                    });
                },
            },
            {
                onCancel() {
                    process.exit(1);
                },
            }
        );

        const packages: AvailablePackages[] = [];
        if (project.mappingLib === "maplibre") packages.push("maplibre");
        if (project.mappingLib === "mapbox") packages.push("mapbox");
        if (project.mappingLib === "openLayers") packages.push("openLayers");
        if (project.mappingLib === "cesium") packages.push("cesium");
        if (project.styling === "unocss") packages.push("tailwind");
        if (project.styling === "tailwind") packages.push("tailwind");
        if (project.database === "prisma") packages.push("prisma");
        if (project.database === "drizzle") packages.push("drizzle");

        return {
            appName: project.name ?? cliResults.appName,
            packages,
            databaseProvider:
                (project.databaseProvider as DatabaseProvider) || "postgres",
            flags: {
                ...cliResults.flags,
                noGit: !project.git || cliResults.flags.noGit,
                noInstall: !project.install || cliResults.flags.noInstall,
                importAlias: project.importAlias ?? cliResults.flags.importAlias,
            },
        };
    } catch (err) {
        // If the user is not calling create-t3-app from an interactive terminal, inquirer will throw an IsTTYError
        // If this happens, we catch the error, tell the user what has happened, and then continue to run the program with a default t3 app
        if (err instanceof IsTTYError) {
            logger.warn(`
  ${CREATE_GEO_NEXT} needs an interactive terminal to provide options`);

            const shouldContinue = await p.confirm({
                message: `Continue scaffolding a default GEO-NEXT app?`,
                initialValue: true,
            });

            if (!shouldContinue) {
                logger.info("Exiting...");
                process.exit(0);
            }

            logger.info(`Bootstrapping a default GEO-NEXT app in ./${cliResults.appName}`);
        } else {
            throw err;
        }
    }

    return cliResults;
};
