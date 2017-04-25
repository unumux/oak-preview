import * as chalk from "chalk";
import * as debug from "@unumux/ux-debug";

import * as fsp from "../lib/fsp";
import { scaffold } from "../lib/scaffold";
import { npm } from "../lib/npm";

export async function init(flags) {
    const currentDirContents = await fsp.readdir("./");

    if(currentDirContents.length > 0) {
        console.log("Init should only be used in an empty directory!");
        return;
    }

    await scaffold("basic", "./");
    npm.addDev({ name: "@unumux/ux-build-tools", version: "*" });
    await npm.install();
}