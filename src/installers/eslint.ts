import path from "path";
import fs from "fs-extra";

import {type Installer} from "./index";
import {PKG_ROOT} from "../consts.ts";

export const eslintInstaller: Installer = ({projectDir}) => {
    const extrasDir = path.join(PKG_ROOT, "template/extras");

    const eslintConfigSrc = path.join(extrasDir, "config/eslint.config.mjs")
    const eslintConfigDest = path.join(projectDir, "eslint.config.mjs");
    fs.copyFileSync(eslintConfigSrc, eslintConfigDest);
};
