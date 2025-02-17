import path from "path";
import fs from "fs-extra";
import {type PackageJson} from "type-fest";

import {PKG_ROOT} from "../consts";
import {type Installer} from "./index";
import {addPackageDependency} from "../utils/addPackageDependency";
import {type AvailableDependencies} from "./dependencyVersionMap";

export const cesiumInstaller: Installer = ({
                                                projectDir,
                                                packages,
                                                scopedAppName,
                                                databaseProvider,
                                            }) => {
    const devPackages: AvailableDependencies[] = [
        "copy-webpack-plugin",
    ];

    addPackageDependency({
        projectDir,
        dependencies: devPackages,
        devMode: true,
    });

    addPackageDependency({
        projectDir,
        dependencies: ["cesium"],
        devMode: false,
    })

    const packageJsonPath = path.join(projectDir, "package.json");

    const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;
    if(packageJsonContent.scripts?.dev){
        packageJsonContent.scripts.dev = packageJsonContent.scripts.dev.replace(" --turbo", "")
    }
    fs.writeJSONSync(packageJsonPath, packageJsonContent, {
        spaces: 2,
    });
    const extrasDir = path.join(PKG_ROOT, "template/extras");
    const copySrcDest: [string, string][] = [];

    copySrcDest.push(
        [
            path.join(
                extrasDir,
                "src/app/_components/map-cesium.tsx",
            ),
            path.join(projectDir, "src/app/_components/map-container.tsx"),
        ],
        [
            path.join(
                extrasDir,
                "src/app/_components/cesium-wrapper.tsx",
            ),
            path.join(projectDir, "src/app/_components/cesium-wrapper.tsx"),
        ],
        [
            path.join(
                extrasDir,
                "src/app/_components",
                packages?.tailwind.inUse ? "cesium-component-tw.tsx" : packages?.unocss.inUse ? "cesium-component-uno.tsx" : "cesium-component.tsx"
            ),
            path.join(projectDir, "src/app/_components/cesium-component.tsx"),
        ],
        [
            path.join(
                extrasDir,
                "src/types/cesium.ts"
            ),
            path.join(projectDir, "src/app/_types/cesium.ts")
        ],
        [
            path.join(
                extrasDir,
                "src/types/cesium-position.ts"
            ),
            path.join(projectDir, "src/app/_types/position.ts")
        ],

    );

    copySrcDest.forEach(([src, dest]) => {
        fs.copySync(src, dest);
    });
};
