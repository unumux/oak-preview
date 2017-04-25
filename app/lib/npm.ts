import * as depCheck from "./dep-check";
import {exec} from "./exec";
 
interface Package {
    name: string;
}

class NPM {
    packages: Package[] = [];

    add(newPackage: Package) {
        this.packages.push(newPackage);
    }

    async install() {
        if(await depCheck.shouldInstallNPMPackages()) {
            console.log("Installing NPM Packages...");
            return exec("yarn", true);
        }
    }
}


export const npm = new NPM();