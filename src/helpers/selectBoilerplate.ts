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
    const usingTw = packages.tailwind.inUse;
    const usingUno = packages.unocss.inUse;
    const usingMaplibre = packages.maplibre.inUse
    let indexFile = "base.tsx";
    if (usingTw && usingMaplibre) {
        indexFile = "with-maplibre-tw.tsx";
    } else if (usingUno && usingMaplibre) {
        indexFile = "with-maplibre-uno.tsx";
    } else if (!usingTw && !usingUno && usingMaplibre) {
        indexFile = "with-maplibre.tsx";
    }

    const indexSrc = path.join(indexFileDir, indexFile);
    const indexDest = path.join(projectDir, "src/app/page.tsx");
    fs.copySync(indexSrc, indexDest);
};
