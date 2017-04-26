import * as chalk from "chalk";
import * as debug from "@unumux/ux-debug";
import * as questions from "@unumux/ux-questions";

import * as fsp from "../lib/fsp";
import { scaffold } from "../lib/scaffold";
import { npm } from "../lib/npm";
import * as willow from "../lib/willow";


export async function init(flags) {
    npm.addDev({ name: "@unumux/ux-build-tools" });    
    const currentDirContents = await fsp.readdir("./");

    if(currentDirContents.length > 0) {
        console.log("Init should only be used in an empty directory!");
        return;
    }

    const shouldContinue = await questions.yesNo(`Create a new Oak project in ${chalk.yellow(process.cwd())}?`);

    if(!shouldContinue) {
        return;
    }

    await willow.promptForInstall();

    await scaffold("basic", "./");
    await npm.saveToPackageJson();
    console.log(`New project created! Run ${chalk.yellow("oak start")} to launch your project`);
}