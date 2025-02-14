import path from "path";
import fs from "fs-extra";

import {PKG_ROOT} from "../consts";
import {type Installer} from "./index";
import {addPackageDependency} from "../utils/addPackageDependency";
import {type AvailableDependencies} from "./dependencyVersionMap";

export const maplibreInstaller: Installer = ({
                                                 projectDir,
                                                 packages,
                                             }) => {
    const devPackages: AvailableDependencies[] = [
        "maplibre-gl",
        "react-map-gl",
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
                packages?.tailwind.inUse ? "map-maplibre-tw.tsx" : packages?.unocss.inUse ? "map-maplibre-uno.tsx" : "map-maplibre.tsx"
            ),
            path.join(projectDir, "src/app/_components/map-container.tsx"),
        ],
    );

    copySrcDest.forEach(([src, dest]) => {
        fs.copySync(src, dest);
    });
};
