import * as _ from "lodash";
import * as debug from "@unumux/ux-debug";
import * as depCheck from "./dep-check";
import * as fsp from "./fsp";
import {getVersionForPackage} from "./npm-registry";
import {exec} from "./exec";
 
interface Package {
    name: string;
    version?: string | Promise<string>;
}

class NPM {
    packages: Package[] = [];
    devPackages: Package[] = [];

    add(newPackage: Package) {
        if(!newPackage.version) {
            newPackage.version = getVersionForPackage(newPackage.name);
        }
        this.packages.push(newPackage);
    }

    addDev(newPackage: Package) {
        if(!newPackage.version) {
            newPackage.version = getVersionForPackage(newPackage.name);
        }
        this.devPackages.push(newPackage);
    }

    async saveToPackageJson() {
        const packageJSON = fsp.readJSON("./package.json");
        const devDependencies = this.devPackages.reduce(async (previousValue, currentValue) => {
            return {...previousValue, [currentValue.name]: await currentValue.version};
        }, {});

        const dependencies = this.packages.reduce(async (previousValue, currentValue) => {
            return {...previousValue, [currentValue.name]: await currentValue.version};
        }, {});

        const newPackageJSON = Object.assign({}, await packageJSON, { dependencies: await dependencies, devDependencies: await devDependencies });
        await fsp.writeFile("./package.json", JSON.stringify(newPackageJSON));
    }

    async install() {
        await this.loadPackagesFromJson();
        if(await depCheck.shouldInstallNPMPackages(_.merge([], this.devPackages, this.packages))) {
            console.log("Installing NPM Packages...");
            
            debug.log("Preparing to install prod packages");
            // install non-dev packages
            const packageNames = this.packages.map((packageItem) => packageItem.name);
            await exec(`npm install --save ${packageNames.join(" ")}`, debug.enabled());

            debug.log("Preparing to install dev packages");
            // install dev packages
            const devPackageNames = this.devPackages.map((packageItem) => packageItem.name);
            await exec(`npm install --save-dev ${devPackageNames.join(" ")}`, debug.enabled());
        }
    }
    
    async loadPackagesFromJson() {
        const packageJSON = await fsp.readJSON("./package.json");

        // load dev packages
        const newDevPackages = _.map(packageJSON.devDependencies, (value, key) => { 
            return { name: key, version: value }
        });
        this.devPackages = _.merge([], this.devPackages, newDevPackages);

        // load prod packages
        const newPackages = _.map(packageJSON.dependencies, (value, key) => { 
            return { name: key, version: value }
        });
        this.packages = _.merge([], this.packages, newPackages);
    }
}


export const npm = new NPM();