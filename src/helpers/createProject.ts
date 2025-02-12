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
        path.join(PKG_ROOT, "template/extras/config/next-config-appdir.ts"),
        path.join(projectDir, "next.config.ts")
    );

    selectLayoutFile({projectDir, packages});
    selectPageFile({projectDir, packages});

    // If no tailwind, select use css modules
    if (!packages.tailwind.inUse) {
        const indexModuleCss = path.join(
            PKG_ROOT,
            "template/extras/src/index.module.css"
        );
        const indexModuleCssDest = path.join(
            projectDir,
            "src",
            "app",
            "index.module.css"
        );
        fs.copyFileSync(indexModuleCss, indexModuleCssDest);
    }

    return projectDir;
};
