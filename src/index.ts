#!/usr/bin/env bun
import {getNpmVersion, renderVersionWarning} from "./utils/renderVersionWarning";
import {getUserPkgManager} from "./utils/getUserPkgManager";
import {renderTitle} from "./utils/renderTitle";
import {runCli} from "./cli";
import {buildPkgInstallerMap} from "./installers";
import {parseNameAndPath} from "./utils/parseNameAndPath.ts";
import {createProject} from "./helpers/createProject.ts";
import fs from "fs-extra";
import path from "path";
import {getVersion} from "./utils/getVersion.ts";
import {execa} from "execa";
import type {PackageJson} from "type-fest";
import {setImportAlias} from "./helpers/setImportAlias.ts";
import {installDependencies} from "./helpers/installDependencies.ts";
import {initializeGit} from "./helpers/git.ts";
import {logNextSteps} from "./helpers/logNextSteps.ts";
import {logger} from "./utils/logger.ts";
type CGNPackageJSON = PackageJson & {
    cgnMetadata?: {
        initVersion: string;
    };
};

async function main() {
    // const npmVersion = await getNpmVersion();
    const npmVersion = "0.0.1";
    const pkgManager = getUserPkgManager();
    renderTitle();
    if (npmVersion) {
        renderVersionWarning(npmVersion);
    }

    const {
        appName,
        packages,
        flags: {noGit, noInstall, importAlias},
        databaseProvider,
    } = await runCli();
    const usePackages = buildPkgInstallerMap(packages, databaseProvider);

    const [scopedAppName, appDir] = parseNameAndPath(appName);

    const projectDir = await createProject({
        projectName: appDir,
        scopedAppName,
        packages: usePackages,
        databaseProvider,
        importAlias,
        noInstall,
    });
    // Write name to package.json
    const pkgJson = fs.readJSONSync(
        path.join(projectDir, "package.json")
    ) as CGNPackageJSON;
    pkgJson.name = scopedAppName;
    pkgJson.cgnMetadata = { initVersion: getVersion() };

    // ? Bun doesn't support this field (yet)
    if (pkgManager !== "bun") {
        const { stdout } = await execa(pkgManager, ["-v"], {
            cwd: projectDir,
        });
        pkgJson.packageManager = `${pkgManager}@${stdout.trim()}`;
    }

    fs.writeJSONSync(path.join(projectDir, "package.json"), pkgJson, {
        spaces: 2,
    });

    // update import alias in any generated files if not using the default
    if (importAlias !== "~/") {
        setImportAlias(projectDir, importAlias);
    }

    if (!noInstall) {
        await installDependencies({ projectDir });
    }

    if (!noGit) {
        await initializeGit(projectDir);
    }

    await logNextSteps({
        projectName: appDir,
        packages: usePackages,
        noInstall,
        projectDir,
        databaseProvider,
    });

    process.exit(0);
}

main().catch((err) => {
    logger.error("Aborting installation...");
    if (err instanceof Error) {
        logger.error(err);
    } else {
        logger.error(
            "An unknown error has occurred. Please open an issue on github with the below:"
        );
        console.log(err);
    }
    process.exit(1);
});
