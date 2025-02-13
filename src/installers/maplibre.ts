import path from "path";
import fs from "fs-extra";
import {type PackageJson} from "type-fest";

import {PKG_ROOT} from "../consts";
import {type Installer} from "./index";
import {addPackageDependency} from "../utils/addPackageDependency";
import {type AvailableDependencies} from "./dependencyVersionMap";

export const maplibreInstaller: Installer = ({
                                                 projectDir,
                                                 packages,
                                                 scopedAppName,
                                                 databaseProvider,
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
};
