#!/usr/bin/env node

import * as meow from "meow";
import * as debug from "@unumux/ux-debug";
import {start} from "./start";
import {init} from "./init";

const cli = meow(`

    Usage
      $ oak init
        - creates a new Oak project
    
      $ oak start
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
        await start(cli.flags);        
    } else if(cli.input.indexOf("start") > -1) {
        await start(cli.flags);
    } else {
        cli.showHelp();
    }
}

main();