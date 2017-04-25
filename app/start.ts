import * as question from "@unumux/ux-questions";
import * as debug from "@unumux/ux-debug";

import * as fsp from "./lib/fsp";
import {npm} from "./lib/npm";
import {exec} from "./lib/exec";

export async function start(flags) {
    // check if `npm start` exists
    // if it does, run it and stop execution
    if(await fsp.fileExists("./package.json")) {
        const packageJSON = await fsp.readJSON("./package.json");
        
        if(packageJSON.scripts.start) {
            await npm.install();
            console.log("Starting Oak...");
            await exec("npm start", true);
        } else {
            // TODO: Add error handling
        }

    }
}