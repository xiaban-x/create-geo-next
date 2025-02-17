import path from "path";
import fs from "fs-extra";

import {PKG_ROOT} from "../consts";
import {type InstallerOptions} from "../installers";

type SelectBoilerplateProps = Required<
    Pick<InstallerOptions, "packages" | "projectDir">
>;
// Similar to _app, but for app router
export const selectLayoutFile = ({
                                     projectDir,
                                     packages,
                                 }: SelectBoilerplateProps) => {
    const layoutFileDir = path.join(PKG_ROOT, "template/extras/src/app/layout");

    const usingTw = packages.tailwind.inUse;
    const usingUno = packages.unocss.inUse;
    let layoutFile = "base.tsx";
    if (usingTw) {
        layoutFile = "with-tw.tsx";
    } else if (usingUno) {
        layoutFile = "with-uno.tsx";
    }

    const appSrc = path.join(layoutFileDir, layoutFile);
    const appDest = path.join(projectDir, "src/app/layout.tsx");
    fs.copySync(appSrc, appDest);
};

// Similar to index, but for app router
export const selectPageFile = ({
                                   projectDir,
                                   packages,
                               }: SelectBoilerplateProps) => {
    const indexFileDir = path.join(PKG_ROOT, "template/extras/src/app/page");
    const usingMaplibre = packages.maplibre.inUse
    const usingMapbox = packages.mapbox.inUse;
    const usingOpenLayers = packages.openLayers.inUse;
    const usingCesium = packages.cesium.inUse;
    let indexFile = "with-maplibre.tsx";
    if (usingMaplibre) {
        indexFile = "with-maplibre.tsx";
    } else if (usingMapbox) {
        indexFile = "with-mapbox.tsx";
    } else if (usingOpenLayers) {
        indexFile = "with-open-layers.tsx";
    } else if (usingCesium) {
        indexFile = "with-cesium.tsx";
    }

    const indexSrc = path.join(indexFileDir, indexFile);
    const indexDest = path.join(projectDir, "src/app/page.tsx");
    fs.copySync(indexSrc, indexDest);
};
