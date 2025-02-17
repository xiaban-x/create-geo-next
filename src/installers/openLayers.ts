import path from "path";
import fs from "fs-extra";
import {type PackageJson} from "type-fest";

import {PKG_ROOT} from "../consts";
import {type Installer} from "./index";
import {addPackageDependency} from "../utils/addPackageDependency";
import {type AvailableDependencies} from "./dependencyVersionMap";

export const openLayersInstaller: Installer = ({
                                                   projectDir,
                                                   packages,
                                                   scopedAppName,
                                                   databaseProvider,
                                               }) => {
    const devPackages: AvailableDependencies[] = [
        "ol",
        "ol-ext",
    ];

    addPackageDependency({
        projectDir,
        dependencies: devPackages,
        devMode: true,
    });

    const extrasDir = path.join(PKG_ROOT, "template/extras");

    const copySrcDest: [string, string][] = [];

    copySrcDest.push(
        [
            path.join(
                extrasDir,
                "src/app/_components",
                packages?.tailwind.inUse ? "map-open-layers-tw.tsx" : packages?.unocss.inUse ? "map-open-layers-uno.tsx" : "map-open-layers.tsx"
            ),
            path.join(projectDir, "src/app/_components/map-container.tsx"),
        ],
        [
            path.join(
                extrasDir,
                "src/app/_components",
                packages?.tailwind.inUse ? "open-layers-map1-tw.tsx" : packages?.unocss.inUse ? "open-layers-map1-uno.tsx" : "open-layers-map1.tsx"
            ),
            path.join(projectDir, "src/app/_components/map1.tsx"),
        ],
        [
            path.join(
                extrasDir,
                "src/app/_components",
                packages?.tailwind.inUse ? "open-layers-map2-tw.tsx" : packages?.unocss.inUse ? "open-layers-map2-uno.tsx" : "open-layers-map2.tsx"
            ),
            path.join(projectDir, "src/app/_components/map2.tsx"),
        ],
    );

    if(!packages?.tailwind.inUse && !packages?.unocss.inUse){
        copySrcDest.push(
            [
                path.join(
                    extrasDir,
                    "src/app/_components",
                    "open-layers.css"
                ),
                path.join(projectDir, "src/app/_components/map.css"),
            ],
        );
    }
    copySrcDest.forEach(([src, dest]) => {
        fs.copySync(src, dest);
    });
};
