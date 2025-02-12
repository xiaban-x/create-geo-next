import {execSync} from "child_process";
import https from "https";

import {getVersion} from "./getVersion.ts";
import {logger} from "./logger";

export const renderVersionWarning = (npmVersion: string) => {
    const currentVersion = getVersion();

    if (currentVersion.includes("beta")) {
        logger.warn("  You are using a beta version of create-geo-next-app.");
        logger.warn("  Please report any bugs you encounter.");
    } else if (currentVersion.includes("next")) {
        logger.warn(
            "  You are running create-geo-next-app with the @next tag which is no longer maintained."
        );
        logger.warn("  Please run the CLI with @latest instead.");
    } else if (currentVersion !== npmVersion) {
        logger.warn("  You are using an outdated version of create-geo-next-app.");
        logger.warn(
            "  Your version:",
            currentVersion + ".",
            "Latest version in the npm registry:",
            npmVersion
        );
        logger.warn("  Please run the CLI with @latest to get the latest updates.");
    }
    console.log("");
};

/**
 * Copyright (c) 2025-present, xiaban.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 * https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/LICENSE
 */
interface DistTagsBody {
    latest: string;
}

function checkForLatestVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
        https
            .get(
                "https://registry.npmjs.org/-/package/create-t3-app/dist-tags",
                (res) => {
                    if (res.statusCode === 200) {
                        let body = "";
                        res.on("data", (data) => (body += data));
                        res.on("end", () => {
                            resolve((JSON.parse(body) as DistTagsBody).latest);
                        });
                    } else {
                        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                        reject();
                    }
                }
            )
            .on("error", () => {
                // logger.error("Unable to check for latest version.");
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject();
            });
    });
}

export const getNpmVersion = () =>
    // `fetch` to the registry is faster than `npm view` so we try that first
    checkForLatestVersion().catch(() => {
        try {
            return execSync("npm view create-geo-next-app version").toString().trim();
        } catch {
            return null;
        }
    });
