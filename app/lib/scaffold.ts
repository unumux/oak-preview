import * as path from "path";
import * as fsp from "./fsp";

export function scaffold(scaffoldName: string, dest: string) {
    const scaffoldDir = path.join(__dirname, "../../", "scaffolds", scaffoldName);
    return fsp.copydir(scaffoldDir, dest);
}