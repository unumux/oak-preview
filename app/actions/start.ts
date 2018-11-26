import * as question from "@unumux/ux-questions";
import * as debug from "@unumux/ux-debug";

import * as fse from "fs-extra";
import {npm} from "../lib/npm";
import {exec} from "../lib/exec";

export async function start(flags) {
    // check if `npm start` exists
    // if it does, run it and stop execution
    if(await fse.pathExists("./package.json")) {
        const packageJSON = await fse.readJson("./package.json");

        if(packageJSON.scripts.start) {
            await npm.install();
            console.log("Starting Oak...");
            await exec("npm start", true);
        } else {
            // TODO: Add error handling
        }

    }
}