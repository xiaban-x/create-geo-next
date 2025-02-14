import path from "path";
import fs from "fs-extra";

import {type Installer} from "./index";
import {PKG_ROOT} from "../consts.ts";
import {addPackageDependency} from "../utils/addPackageDependency.ts";

export const eslintInstaller: Installer = ({projectDir, packages}) => {
    // addPackageDependency({
    //     projectDir,
    //     dependencies: [
    //         "eslint-plugin-react-hooks",
    //         "eslint-plugin-react-refresh",
    //         "eslint-config-next",
    //         "globals",
    //         "@eslint/js",
    //         "@eslint/eslintrc"
    //     ],
    //     devMode: true,
    // });
    const extrasDir = path.join(PKG_ROOT, "template/extras");

    const eslintConfigSrc = path.join(extrasDir, "config/eslint.config.mjs")
    const eslintConfigDest = path.join(projectDir, "eslint.config.mjs");
    fs.copyFileSync(eslintConfigSrc, eslintConfigDest);
};
