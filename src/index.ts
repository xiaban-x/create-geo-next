#!/usr/bin/env bun
import {getNpmVersion, renderVersionWarning} from "./utils/renderVersionWarning";
import {getUserPkgManager} from "./utils/getUserPkgManager";
import {renderTitle} from "./utils/renderTitle";
import {runCli} from "./cli";
import {buildPkgInstallerMap} from "./installers";
import {parseNameAndPath} from "./utils/parseNameAndPath.ts";

async function main() {
    // const npmVersion = await getNpmVersion();
    const npmVersion = "0.0.1";
    const pkgManager = getUserPkgManager();
    renderTitle();
    if (npmVersion) {
        renderVersionWarning(npmVersion);
    }

    const {
        appName,
        packages,
        flags: {noGit, noInstall, importAlias},
        databaseProvider,
    } = await runCli();
    const usePackages = buildPkgInstallerMap(packages, databaseProvider);

    // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
    const [scopedAppName, appDir] = parseNameAndPath(appName);
//     console.log(chalk.cyan("✨ Welcome to the Next.js Starter CLI!"));
//     // 交互式选择
//     const response = await prompts([
//         {
//             type: "text",
//             name: "projectName",
//             message: "Enter your project name:",
//             initial: "my-next-app",
//         },
//         {
//             type: "toggle",
//             name: "useTypeScript",
//             message: "Enable TypeScript?",
//             initial: false,
//             active: "Yes",
//             inactive: "No",
//         },
//         {
//             type: "toggle",
//             name: "useUnocss",
//             message: "Enable UnoCSS?",
//             initial: false,
//             active: "Yes",
//             inactive: "No",
//         },
//         {
//             type: "select",
//             name: "stateManagement",
//             message: "Choose a state management library:",
//             choices: [
//                 {title: "None", value: "none"},
//                 {title: "Redux", value: "redux"},
//                 {title: "Zustand", value: "zustand"},
//                 {title: "Recoil", value: "recoil"},
//             ],
//             initial: 0,
//         },
//     ]);
//
//     const {projectName, useTypeScript, useUnocss, stateManagement} = response;
//     const repo = "https://github.com/vercel/next.js/tree/canary/examples/default";
//
//     console.log(chalk.green(`🚀 Creating Next.js project: ${projectName}`));
//     execSync(`bun create next-app@latest ${projectName} --${useTypeScript ? "" : "no-"}ts --eslint --app --turbopack --no-tailwind --no-src-dir --import-alias "@/*"`, {stdio: "inherit"});
//
//     // 进入项目目录
//     process.chdir(projectName);
//
//     // 安装 Unocss
//     if (useUnocss) {
//         console.log(chalk.blue("📦 Installing UnoCSS..."));
//         execSync("bun add unocss @unocss/reset", {stdio: "inherit"});
//
//         // 添加 UnoCSS 配置
//         const unoConfig = `import { defineConfig, presetUno, presetAttributify } from 'unocss';
//
// export default defineConfig({
//   presets: [
//     presetUno(),
//     presetAttributify(),
//   ],
// });
// `;
//         Bun.write("uno.config.ts", unoConfig);
//         Bun.write("src/styles/global.css", `@unocss/reset/tailwind.css;`);
//         console.log(chalk.green("✅ UnoCSS setup complete!"));
//     }
//
//     // 安装状态管理库
//     if (stateManagement !== "none") {
//         console.log(chalk.blue(`📦 Installing ${stateManagement}...`));
//         if (stateManagement === "redux") {
//             execSync("bun add @reduxjs/toolkit react-redux", {stdio: "inherit"});
//         } else {
//             execSync(`bun add ${stateManagement}`, {stdio: "inherit"});
//         }
//         console.log(chalk.green(`✅ ${stateManagement} installed!`));
//     }
//
//     console.log(chalk.green("🎉 Setup complete! Run the following to start:"));
//     console.log(chalk.yellow(`cd ${projectName} && bun dev`));
}

main();
