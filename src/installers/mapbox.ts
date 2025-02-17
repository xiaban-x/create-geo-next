import path from "path";
import fs from "fs-extra";
import {type PackageJson} from "type-fest";

import {PKG_ROOT} from "../consts";
import {type Installer} from "./index";
import {addPackageDependency} from "../utils/addPackageDependency";
import {type AvailableDependencies} from "./dependencyVersionMap";

export const mapboxInstaller: Installer = ({
                                                projectDir,
                                                packages,
                                                scopedAppName,
                                                databaseProvider,
                                            }) => {
    const devPackages: AvailableDependencies[] = [
        "react-map-gl",
        "mapbox-gl",
        "@types/mapbox-gl"
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
                packages?.tailwind.inUse ? "map-mapbox-tw.tsx" : packages?.unocss.inUse ? "map-mapbox-uno.tsx" : "map-mapbox.tsx"
            ),
            path.join(projectDir, "src/app/_components/map-container.tsx"),
        ],
    );

    copySrcDest.forEach(([src, dest]) => {
        fs.copySync(src, dest);
    });
};
