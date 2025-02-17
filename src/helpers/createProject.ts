import fs from "fs";
import path from "path";

import {PKG_ROOT} from "../consts";
import {installPackages} from "./installPackages";
import {scaffoldProject} from "./scaffoldProject";
import {
    selectLayoutFile,
    selectPageFile,
} from "./selectBoilerplate";
import {
    type DatabaseProvider,
    type PkgInstallerMap,
} from "../installers";
import {getUserPkgManager} from "../utils/getUserPkgManager";

interface CreateProjectOptions {
    projectName: string;
    packages: PkgInstallerMap;
    scopedAppName: string;
    noInstall: boolean;
    importAlias: string;
    databaseProvider: DatabaseProvider;
}

export const createProject = async ({
                                        projectName,
                                        scopedAppName,
                                        packages,
                                        noInstall,
                                        databaseProvider,
                                    }: CreateProjectOptions) => {
    const pkgManager = getUserPkgManager();
    const projectDir = path.resolve(process.cwd(), projectName);

    // Bootstraps the base Next.js application
    await scaffoldProject({
        projectName,
        projectDir,
        pkgManager,
        scopedAppName,
        noInstall,
        databaseProvider,
    });

    // Install the selected packages
    installPackages({
        projectName,
        scopedAppName,
        projectDir,
        pkgManager,
        packages,
        noInstall,
        databaseProvider,
    });

    // Replace next.config
    fs.copyFileSync(
        packages.cesium.inUse
            ? path.join(PKG_ROOT, "template/extras/config/next-config-cesium.ts")
            : path.join(PKG_ROOT, "template/base/config/next-config.ts"),
        path.join(projectDir, "next.config.ts")
    );

    selectLayoutFile({projectDir, packages});
    selectPageFile({projectDir, packages});

    return projectDir;
};
