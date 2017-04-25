import * as _ from "lodash";
import * as debug from "@unumux/ux-debug";
import * as depCheck from "./dep-check";
import * as fsp from "./fsp";
import {exec} from "./exec";
 
interface Package {
    name: string;
    version: string;
}

class NPM {
    packages: Package[] = [];
    devPackages: Package[] = [];

    add(newPackage: Package) {
        this.packages.push(newPackage);
    }

    addDev(newPackage: Package) {
        this.devPackages.push(newPackage);
    }

    async install() {
        await this.loadPackagesFromJson();
        if(await depCheck.shouldInstallNPMPackages(this.devPackages)) {
            console.log("Installing NPM Packages...");
            const packageNames = this.devPackages.map((packageItem) => packageItem.name);
            return exec(`npm install --save-dev ${packageNames.join(" ")}`, debug.enabled);
        }
    }
    
    async loadPackagesFromJson() {
        const packageJSON = await fsp.readJSON("./package.json");

        // load dev packages
        const newDevPackages = _.map(packageJSON.devDependencies, (value, key) => { 
            return { name: key, version: value }
        });
        this.devPackages = _.merge(this.devPackages, newDevPackages);

        // load prod packages
        const newPackages = _.map(packageJSON.dependencies, (value, key) => { 
            return { name: key, version: value }
        });
        this.packages = _.merge(this.packages, newPackages);
        
    }
}


export const npm = new NPM();