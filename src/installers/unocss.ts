import path from "path";
import fs from "fs-extra";
import {type PackageJson} from "type-fest";

import {PKG_ROOT} from "../consts";
import {type Installer} from "./index";
import {addPackageDependency} from "../utils/addPackageDependency";

export const unocssInstaller: Installer = ({projectDir}) => {
    addPackageDependency({
        projectDir,
        dependencies: [
            "unocss",
            "@unocss/preset-attributify",
            "@unocss/postcss",
            "prettier-plugin-tailwindcss"
        ],
        devMode: true,
    });

    const extrasDir = path.join(PKG_ROOT, "template/extras");

    const twCfgSrc = path.join(extrasDir, "config/uno.config.ts");
    const twCfgDest = path.join(projectDir, "uno.config.ts");

    const postcssCfgSrc = path.join(extrasDir, "config/postcss-uno.config.js");
    const postcssCfgDest = path.join(projectDir, "postcss.config.js");

    const prettierSrc = path.join(extrasDir, "config/_prettier.config.js");
    const prettierDest = path.join(projectDir, "prettier.config.js");

    const cssSrc = path.join(extrasDir, "src/styles/globals-uno.css");
    const cssDest = path.join(projectDir, "src/styles/globals.css");

    const typesSrc = path.join(extrasDir, "src/utils/uno-attributify.d.ts");
    const typesDest = path.join(projectDir, "types/uno-attributify.d.ts");

    // add format:* scripts to package.json
    const packageJsonPath = path.join(projectDir, "package.json");

    const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;
    packageJsonContent.scripts = {
        ...packageJsonContent.scripts,
        "format:write": 'prettier --write "**/*.{ts,tsx,js,jsx,mdx}" --cache',
        "format:check": 'prettier --check "**/*.{ts,tsx,js,jsx,mdx}" --cache',
    };

    fs.copySync(twCfgSrc, twCfgDest);
    fs.copySync(postcssCfgSrc, postcssCfgDest);
    fs.copySync(cssSrc, cssDest);
    fs.copySync(typesSrc, typesDest);
    fs.copySync(prettierSrc, prettierDest);
    fs.writeJSONSync(packageJsonPath, packageJsonContent, {
        spaces: 2,
    });
};
