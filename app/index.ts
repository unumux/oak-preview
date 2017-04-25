#!/usr/bin/env node

import * as meow from "meow";
import * as debug from "@unumux/ux-debug";
import * as chalk from "chalk";

import {init} from "./init";
import {start} from "./start";

const cli = meow(`

    Usage
      $ ${chalk.yellow("oak init")}
        - creates a new Oak project
    
      $ ${chalk.yellow("oak start")}
        - starts an Oak project
 
    Options
      --debug       Display debug logging
      --version     Display version information
 
`, {
    alias: {
        verbose: "debug",
        v: "version",
        s: "start",
        run: "start"
    }
});

// enable debug logging if one of the following flags are passed:
//    --debug
//    --verbose
if(cli.flags.debug) {
    debug.enable();
    debug.log("Debug logging enabled");
}

async function main() {
    if(cli.input.indexOf("init") > -1) {
        await init(cli.flags);
        console.log(`New project created! Run ${chalk.yellow("oak start")} to launch your project`);
    } else if(cli.input.indexOf("start") > -1) {
        await start(cli.flags);
    } else {
        cli.showHelp();
    }
}

main();