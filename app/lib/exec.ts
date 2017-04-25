import {spawn} from "child_process";
import * as debug from "@unumux/ux-debug";

const isWin = process.platform === "win32";

export function exec(cmd: string, visible: boolean = false) {
    debug.log(`Executing command: ${cmd}`);
    return new Promise((resolve) => {
        const shell = isWin ? "cmd.exe" : "sh";
        const cmdSwitch = isWin ? "/c" : "-c";
        const stdio = debug.enabled() || visible ? [0, process.stdout, process.stderr] : "ignore";

        spawn(shell, [cmdSwitch, cmd], {
            stdio: stdio
        }).on("close", function() {
            debug.log(`Command completed successfully: ${cmd}`);
            resolve();
        });
    });
}