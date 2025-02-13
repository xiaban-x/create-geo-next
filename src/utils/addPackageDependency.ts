import path from "path";
import fs from "fs-extra";
import sortPackageJson from "sort-package-json";
import { type PackageJson } from "type-fest";

import {
  dependencyVersionMap,
  type AvailableDependencies,
} from "../installers/dependencyVersionMap";

export const addPackageDependency = (opts: {
  dependencies: AvailableDependencies[];
  devMode: boolean;
  projectDir: string;
}) => {
  const { dependencies, devMode, projectDir } = opts;
  console.log("projectDir==>", projectDir)
  const pkgJson = fs.readJSONSync(
    path.join(projectDir, "package.json")
  ) as PackageJson;

  dependencies.forEach((pkgName) => {
    const version = dependencyVersionMap[pkgName];

    if (devMode && pkgJson.devDependencies) {
      pkgJson.devDependencies[pkgName] = version;
    } else if (pkgJson.dependencies) {
      pkgJson.dependencies[pkgName] = version;
    }
  });
  const sortedPkgJson = sortPackageJson(pkgJson);

  fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
    spaces: 2,
  });
};
