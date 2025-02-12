import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts";
import { type AvailableDependencies } from "~/installers/dependencyVersionMap.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const nextAuthInstaller: Installer = ({ projectDir, packages }) => {
  const usingPrisma = packages?.prisma.inUse;
  const usingDrizzle = packages?.drizzle.inUse;

  const deps: AvailableDependencies[] = ["next-auth"];
  if (usingPrisma) deps.push("@auth/prisma-adapter");
  if (usingDrizzle) deps.push("@auth/drizzle-adapter");

  addPackageDependency({
    projectDir,
    dependencies: deps,
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const apiHandlerFile = "src/app/api/auth/[...nextauth]/route.ts";

  const apiHandlerSrc = path.join(extrasDir, apiHandlerFile);
  const apiHandlerDest = path.join(projectDir, apiHandlerFile);

  const authConfigSrc = path.join(
    extrasDir,
    "src/server/auth/config",
    usingPrisma
      ? "with-prisma.ts"
      : usingDrizzle
        ? "with-drizzle.ts"
        : "base.ts"
  );
  const authConfigDest = path.join(projectDir, "src/server/auth/config.ts");

  const authIndexSrc = path.join(extrasDir, "src/server/auth/index.ts");
  const authIndexDest = path.join(projectDir, "src/server/auth/index.ts");

  fs.copySync(apiHandlerSrc, apiHandlerDest);
  fs.copySync(authConfigSrc, authConfigDest);
  fs.copySync(authIndexSrc, authIndexDest);
};
