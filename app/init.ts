import * as fsp from "./lib/fsp";
import { scaffold } from "./lib/scaffold";

export async function init(flags) {
    const currentDirContents = await fsp.readdir("./");

    if(currentDirContents.length > 0) {
        console.log("Init should only be used in an empty directory!");
        return;
    }

    await scaffold("basic", "./");
}