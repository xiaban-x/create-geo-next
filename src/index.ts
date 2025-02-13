#!/usr/bin/env bun
import {getNpmVersion, renderVersionWarning} from "./utils/renderVersionWarning";
import {getUserPkgManager} from "./utils/getUserPkgManager";
import {renderTitle} from "./utils/renderTitle";
import {runCli} from "./cli";
import {buildPkgInstallerMap} from "./installers";
import {parseNameAndPath} from "./utils/parseNameAndPath.ts";
import {createProject} from "./helpers/createProject.ts";

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
    console.log("usePakc= ===>", usePackages)
    // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
    const [scopedAppName, appDir] = parseNameAndPath(appName);

    const projectDir = await createProject({
        projectName: appDir,
        scopedAppName,
        packages: usePackages,
        databaseProvider,
        importAlias,
        noInstall,
    });
}

main();
