import * as chalk from "chalk";

import {init} from "./actions/init";
import {start} from "./actions/start";



export async function main(input, flags, showHelp) {
    if(input.indexOf("init") > -1) {
        await init(flags);
        console.log(`New project created! Run ${chalk.yellow("oak start")} to launch your project`);
    } else if(input.indexOf("start") > -1) {
        await start(flags);
    } else {
        showHelp();
    }
}