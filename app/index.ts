#!/usr/bin/env node

import * as meow from "meow";
import * as debug from "@unumux/ux-debug";
import * as chalk from "chalk";

import {main} from "./main";

const cli = meow(`

    Usage
      $ ${chalk.yellow("oak init")}
        - creates a new Oak project
    
      $ ${chalk.yellow("oak start")}
        - starts an Oak project
 
    Options
      --debug       Display debug logging
      --version     Display version information
      --force       Forces Oak to run init, even if folder is not empty
 
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

main(cli.input, cli.flags, cli.showHelp);